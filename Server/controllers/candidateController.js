import { prisma } from "../config/prismaConfig.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import csv from 'csv-parser'
import xlsx from 'xlsx'
import stream from 'stream'
import path from 'path';
import fs from "fs";
import multer from "multer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// require pdf-parse (v1.1.1)
const pdfParse = require("pdf-parse");

// export const extractEmailFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer); // now guaranteed to work
//     const text = pdfData.text || "";

//     const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
//     const emails = text.match(emailRegex);

//     return emails ? emails[0] : null;
//   } catch (err) {
//     console.error("Error extracting email from PDF:", err.message);
//     return null;
//   }
// };

export const extractCandidateDataFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // ----------------------
    // Email
    // ----------------------
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : null;

    // ----------------------
    // Phone
    // ----------------------
    const phoneRegex = /(?:phone|mobile|mob|no\.?|number)[:\s]*([+\d][\d\s\-().]{5,}\d)/gi;
    const phoneMatch = text.match(phoneRegex);
    let phone = null;
    if (phoneMatch) {
      const match = phoneMatch[0].match(/([+\d][\d\s\-().]{5,}\d)/);
      phone = match ? match[0].replace(/\s+/g, '') : null;
    }

    // ----------------------
    // Location
    // ----------------------
    // Match common patterns for location/city/address
    const locationRegex = /(?:loc(?:ation)?|city|residence|address)[:\s]*([A-Za-z0-9 ,.\-]+)/i;
    const locationMatch = text.match(locationRegex);
    let location = null;
    if (locationMatch && locationMatch[1]) {
      location = locationMatch[1].trim().replace(/\s+/g, ' ');
    }


    // ----------------------
    // Name
    // ----------------------
    const nameRegex = /(?:name|username|sur\s?name|employee name)[:\s]*([A-Za-z ,.'-]+)/gi;
    const nameMatch = text.match(nameRegex);
    console.log("nameMatch", nameMatch)
    let name = null;
    if (nameMatch) {
      const match = nameMatch[0].match(/(?:name|username|sur\s?name|employee name)[:\s]*([A-Za-z ,.'-]+)/i);
      console.log("match", match)
      name = match ? match[1].trim() : null; // no space normalization
      // name = match ? match[1].trim().replace(/\s+/g, ' ') : null; // ensures single space between words

    }
    console.log("extracted data from resume", email, phone, location, name)

    return { email, phone, location, name };

  } catch (error) {
    console.error("Error extracting data from PDF:", error.message);
    return { email: null, phone: null, location: null, name: null };
  }
};




// ===========================
// Multer storage config
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, "../uploads/resumes");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// ===========================
// Create Candidate
// ===========================
export const createCandidate = async (req, res) => {
  try {
    const {
      firstName,
      //   lastName,
      email,
      phone,
      experience_years,
      position_applied,
    } = req.body;


    let nameFromPDF = null;
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    let resume_url = null;
    let extractedEmail = null;

    if (req.file) {
      resume_url = `/uploads/resumes/${req.file.filename}`;

      // Extract email from PDF if email not provided
      if (!email) {
        const fullPath = path.join(__dirname, "../uploads/resumes", req.file.filename);
        const { email: emailFromPDF, phone: phoneFromPDF, name: extractedName } = await extractEmailAndPhoneFromPDF(filePath);
      }
    }

    const candidateEmail = email || extractedEmail || ""; // fallback to empty string if none
    nameFromPDF = extractedName;
    const newCandidate = await prisma.candidate.create({
      data: {
        name: nameFromPDF || firstName || '',
        // lastName: null,
        email: candidateEmail,
        phone,
        experience_years: parseFloat(experience_years) || 0,
        position_applied,
        resume_url,
        resume_url_redacted: null, // keep null for now
      },
    });


    // checking saved searches

    const savedSearches = await prisma.savedSearch.findMany();

    const now = new Date();

    for (const search of savedSearches) {
      // Only check searches with notifications enabled
      if (search.notify_frequency !== NotifyFrequency.none) {
        const last = search.last_notified_at;
        let shouldNotify = false;

        if (!last) {
          shouldNotify = true; // never notified before
        } else if (search.notify_frequency === NotifyFrequency.daily) {
          shouldNotify = now.getTime() - last.getTime() >= 24 * 60 * 60 * 1000;
        } else if (search.notify_frequency === NotifyFrequency.weekly) {
          shouldNotify = now.getTime() - last.getTime() >= 7 * 24 * 60 * 60 * 1000;
        }
        /*
                if (shouldNotify && matchesFilters(search.filters, { role, experience })) {
                  // Create notification
                  await prisma.notification.create({
                    data: {
                      userId: search.userId,
                      message: `New candidate matches your saved search: ${search.query}`,
                    },
                  });
        
                  // Update lastNotifiedAt
                  await prisma.savedSearch.update({
                    where: { id: search.id },
                    data: { lastNotifiedAt: now },
                  });
                }*/
      }
    }




    res.status(201).json(newCandidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Failed to create candidate", error });
  }
};

// ===========================
// Get All Candidates
// ===========================
export const getAllCandidates = async (_req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
};

// ===========================
// DELETE Candidate
// ===========================
export const deleteCandidate = async (req, res) => {
  try {
    const { candidate_id } = req.body;
    console.log("candidate to be deleted", candidate_id)

    const candidate = await prisma.candidate.findUnique({ where: { candidate_id } });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Delete resume file if exists
    if (candidate.resume_url) {
      const resumePath = path.join(process.cwd(), candidate.resume_url); // full path
      if (fs.existsSync(resumePath)) fs.unlinkSync(resumePath);
    }
    //unlinking but not deleting??
    console.log("candidate found", candidate)

    // Delete from database
    await prisma.candidate.delete({ where: { candidate_id } });

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Failed to delete candidate" });
  }
};

// ===========================
// DELETE Candidate by EMAIL
// ===========================

export const deleteCandidateByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    console.log("candidate to be deleted", email);

    // Find candidate by email
    const candidate = await prisma.candidate.findUnique({ where: { email } });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    console.log("candidate found", candidate);

    // Delete resume file if exists
    if (candidate.resume_url) {
      const resumePath = path.join(process.cwd(), candidate.resume_url); // full path
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
        console.log("Resume deleted:", resumePath);
      }
    }

    // Delete candidate from database
    await prisma.candidate.delete({ where: { email } });

    res.status(200).json({ message: `Candidate with email ${email} deleted successfully` });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Failed to delete candidate" });
  }
};


// ===========================
// UPDATE Candidate
// ===========================
export const updateCandidate = async (req, res) => {
  try {
    const { id,
      firstName,
      lastName,
      email,
      phone,
      experience_years,
      position_applied,
    } = req.body;

    console.log("candidate data received", id, firstName,
      lastName,
      email,
      phone,
      experience_years,
      position_applied,)
    // Find existing candidate
    const candidate = await prisma.candidate.findUnique({ where: { candidate_id: id } });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    let resume_url = candidate.resume_url;

    // If a new file is uploaded, replace the old resume
    if (req.file) {
      // Delete old resume
      if (candidate.resume_url) {
        const oldResumePath = path.join(process.cwd(), candidate.resume_url);
        if (fs.existsSync(oldResumePath)) fs.unlinkSync(oldResumePath);
      }
      resume_url = `/uploads/resumes/${req.file.filename}`;
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { candidate_id: id },
      data: {
        name: nameFromPDF || firstName || '',
        lastName,
        email,
        phone,
        experience_years: parseFloat(experience_years),
        position_applied,
        resume_url,
      },
    });

    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate BE:", error);
    res.status(500).json({ message: "Failed to update candidate" });
  }
};

//UPDATE CANDIDATES BY EMAIL//

export const updateCandidateByEmail = async (req, res) => {
  try {
    const { email, name, phone, location, experience_years, position_applied } = req.body;


    console.log("location", location)
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find candidate by email
    const candidate = await prisma.candidate.findFirst({ where: { email } });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    let resume_url = candidate.resume_url;

    // Handle new resume file
    if (req.file) {
      if (candidate.resume_url) {
        const oldResumePath = path.join(process.cwd(), candidate.resume_url);
        if (fs.existsSync(oldResumePath)) fs.unlinkSync(oldResumePath);
      }
      resume_url = `/uploads/resumes/${req.file.filename}`;
    }

    console.log('Updating candidate:', candidate.email, {
      name: candidate.name,
      location: candidate.location,
      experience_years: candidate.experience,
      position_applied: candidate.position,
    });


    const updatedCandidate = await prisma.candidate.update({
      where: { candidate_id: candidate.candidate_id },
      data: {
        name: name ?? candidate.name,
        //  lastName: lastName ?? candidate.lastName,
        phone: phone ?? candidate.phone,
        //  location: location ?? candidate.location,
        location: location?.trim() ? location : candidate.location,

        experience_years: experience_years ? parseFloat(experience_years) : candidate.experience_years,
        position_applied: position_applied ?? candidate.position_applied,
        resume_url,
        //resume_url_redacted // Not sure where this variable came from, removed to prevent error
      },
    });

    res.status(200).json({ message: "Candidate updated successfully", candidate: updatedCandidate });

  } catch (error) {
    console.error("Error updating candidate by email:", error);
    res.status(500).json({ message: "Failed to update candidate", error });
  }
};


//BULK UPLOAD

export const bulkUploadFiles = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });


  console.log("File received in BE:", req.file);
  console.log("req.body:", req.body);

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No file uploaded or buffer missing' });
  }



  const fileBuffer = req.file.buffer;
  let data = [];

  // ================= CSV =================
  if (req.file.originalname.endsWith('.csv')) {
    const results = [];
    const readable = new stream.Readable();
    readable.push(fileBuffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        console.log("CSV raw data:", results);

        const formattedData = results.map((d, index) => {
          const fullName = d['Name'] || ''; // adjust header if needed
          const [firstName, ...rest] = fullName.trim().split(' ');
          const lastName = rest.join(' ');

          const candidate = {
            firstName: firstName || '',
            lastName: lastName || '',
            //   email: d['Email'] || '',
            //     phone: d['Phone'] || '',
            //      experience_years: parseFloat(d['Experience Years']) || 0,
            position_applied: d['Position'] || '',
            location: d['Location'] || ''
          };

          console.log(`Formatted candidate [${index}]:`, candidate);
          return candidate;
        });

        try {
          await prisma.candidate.createMany({ data: formattedData });
          res.json({ message: 'Candidates uploaded successfully!' });
        } catch (err) {
          console.error("Error saving candidates:", err);
          res.status(500).json({ message: 'Error saving candidates' });
        }
      });

    // ================= XLSX =================
  } else if (req.file.originalname.endsWith('.xlsx')) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("XLSX raw data:", data);

    const formattedData = data.map((d, index) => {
      const fullName = d['Name'] || ''; // adjust header if needed
      const [firstName, ...rest] = fullName.trim().split(' ');
      const lastName = rest.join(' ');

      const candidate = {
        firstName: firstName || '',
        lastName: lastName || '',
        // email: d['Email'] || '',
        //phone: d['Phone'] || '',
        //experience_years: parseFloat(d['Experience Years']) || 0,
        position_applied: d['Position'] || '',
        location: d['Location'] || ''
      };

      console.log(`Formatted candidate [${index}]:`, candidate);
      return candidate;
    });

    try {
      if (!formattedData.length) {
        return res.status(400).json({ message: "No valid candidates found in file" });
      }
      await prisma.candidate.createMany({ data: formattedData });
      res.json({ message: 'Candidates uploaded successfully!' });
    } catch (err) {
      console.error("Error saving candidates:", err);
      res.status(500).json({ message: 'Error saving candidates' });
    }

  } else {
    res.status(400).json({ message: 'Unsupported file type' });
  }
};

export const getCandidateStatusHistory = async (req, res) => {
  try {
    console.log("getting all the candidates status")
    const history = await prisma.candidateStatusHistory.findMany({
      include: {
        candidate: {
          select: {
            name: true,
            //  lastName: true,
          },
        },
        changedByUser: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        changed_at: 'desc',
      },
    })
    console.log("history", history)

    // Format data for frontend
    const formatted = history.map((h) => ({
      candidateId: h.candidate_id,
      // candidateName: h.candidate
      //  ? `${h.candidate.firstName || ''} ${h.candidate.lastName || ''}`.trim() || 'N/A'
      // : 'N/A',
      candidateName: h.candidate?.name || 'N/A',
      oldStatus: h.oldStatus,
      newStatus: h.newStatus,
      changedBy: h.changedByUser
        ? `${h.changedByUser.full_name} (${h.changedByUser.email})`
        : 'System',
      changedAt: h.changed_at,
    }))
    console.log("formatted data", formatted)

    res.status(200).json({ success: true, data: formatted })
  } catch (error) {
    console.error('Error fetching candidate status history in BE:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch candidate status history in BE' })
  }
}


// Multer setup (store temporarily in /uploads)



// ===========================
// BULK UPLOAD CANDIDATE CVS BY FILENAME
// ===========================
export const bulkUploadCandidateCVs = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = [];
    const emailFileMap = {}; // track files per email in this batch

    // First, organize files by email
    for (const file of files) {
      const originalName = file.originalname.toLowerCase();
      const isOriginal = originalName.includes("original");
      const isRedacted = originalName.includes("redacted");

      if (!isOriginal && !isRedacted) {
        console.log(`⚠️ Skipping ${originalName} — missing 'original' or 'redacted' keyword`);
        continue;
      }

      const filePath = path.join(__dirname, "../uploads/resumes", file.filename);
      const { email: emailFromPDF, phone: phoneFromPDF, location: locationFromPDF, name: nameFromPDF } =
        await extractCandidateDataFromPDF(filePath);

      if (!emailFromPDF) {
        console.log(`⚠️ Could not extract email from ${originalName}, skipping`);
        continue;
      }

      // Initialize map for this email
      if (!emailFileMap[emailFromPDF]) {
        emailFileMap[emailFromPDF] = {
          email: emailFromPDF,
          phone: phoneFromPDF,
          location: locationFromPDF,
          name: nameFromPDF,
          // lastName: null,
          resume_url: null,
          resume_url_redacted: null,
        };

        /*   if (nameFromPDF) {
             emailFileMap[emailFromPDF].name = nameFromPDF.trim()
             // emailFileMap[emailFromPDF].lastName = null
           }*/

      }

      console.log("data extracted", emailFileMap)

      // Assign file URLs
      const fileUrl = `/uploads/resumes/${file.filename}`;
      if (isOriginal) emailFileMap[emailFromPDF].resume_url = fileUrl;
      if (isRedacted) emailFileMap[emailFromPDF].resume_url_redacted = fileUrl;
    }

    // Now create candidates in DB
    for (const email in emailFileMap) {
      const existing = await prisma.candidate.findFirst({ where: { email } });

      if (existing) {
        console.log(`❌ Candidate with email ${email} already exists`);
        results.push({ email, status: "duplicate" });
        continue;
      }

      await prisma.candidate.create({ data: emailFileMap[email] });
      console.log(`🆕 Created candidate: ${email}`);
      results.push({ email, status: "created" });
    }

    res.json({
      message: "Bulk CV upload completed successfully.",
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Error during bulk upload:", error);
    res.status(500).json({ message: "Error during bulk upload", error: error.message });
  }
};



// Helper to match candidate with filters
function matchesFilters(filters, candidate) {
  if (!filters) return true; // no filters = match all
  if (filters.role && filters.role.toLowerCase() !== candidate.role.toLowerCase()) return false;
  if (filters.experience && filters.experience !== candidate.experience) return false;
  return true;
}

// Save a new search
// ---------------------------
export const saveSearch = async (req, res) => {
  try {
    const { userId, query, filters, notifyFrequency } = req.body;


    console.log("Incoming Data:", { userId, query, filters, notifyFrequency });

    console.log("userId", userId, "query", query, "filters", filters, "notify frequency", notifyFrequency)
    const savedSearch = await prisma.savedSearch.create({
      data: {
        user_id: userId,
        query,
        filters: filters || [],
        notify_frequency: notifyFrequency,
      },
    });
    console.log("sending data frm BE", saveSearch)
    res.json({ success: true, savedSearch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};



export const getAllSavedSearches = async (req, res) => {
  try {
    const searches = await prisma.savedSearch.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            full_name: true,
          },
        }
      }
    });
    // console.log("data sending from BE", searches)
    res.status(200).json(searches);
  } catch (error) {
    console.error("Error fetching searches:", error);
    res.status(500).json({ message: "Failed to fetch searches" });
  }
}

export const deleteSearch = async (req, res) => {
  try {
    const { savedsearch_id } = req.body;
    console.log("search to be deleted", savedsearch_id)

    const search = await prisma.savedSearch.findUnique({ where: { savedsearch_id } });
    if (!search) return res.status(404).json({ message: "search not found" });


    // Delete from database
    await prisma.savedSearch.delete({ where: { savedsearch_id } });

    res.status(200).json({ message: "Saved Search deleted successfully" });
  } catch (error) {
    console.error("Error deleting search BE:", error);
    res.status(500).json({ message: "Failed to delete saved search" });
  }
}

export const savedSearchUpdate = async (req, res) => {
  try {
    const { id,
      query,
      frequency,
    } = req.body;

    console.log("search data received", id, query, frequency)
    // Find existing candidate
    const search = await prisma.savedSearch.findUnique({ where: { savedsearch_id: id } });
    if (!search) return res.status(404).json({ message: "Search not found" });


    const updatedSeach = await prisma.savedSearch.update({
      where: { savedsearch_id: id },
      data: {
        query: query,
        notify_frequency: frequency,
      },
    });

    res.status(200).json(updatedSeach);
  } catch (error) {
    console.error("Error updating search BE:", error);
    res.status(500).json({ message: "Failed to update search" });
  }
}