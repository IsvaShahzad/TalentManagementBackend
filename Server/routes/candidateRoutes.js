import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
  createCandidate,
  getAllCandidates,
  deleteCandidate,
  updateCandidate,
  bulkUploadFiles,
  getCandidateStatusHistory,
  deleteCandidateByEmail,
  updateCandidateByEmail,
  bulkUploadCandidateCVs,
  saveSearch,
  getAllSavedSearches,
  deleteSearch,
  savedSearchUpdate
} from '../controllers/candidateController.js';

const router = express.Router();

// ===========================
// Multer configuration
// ===========================

// For single CV upload
// const uploadSingle = multer({ dest: 'uploads/' });

const storageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('uploads', 'resumes');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});


const uploadSingle = multer({ storage: storageSingle });

// For Excel upload (reads in memory, no file saved)
const storage = multer.memoryStorage();
const uploadExcel = multer({ storage });

// For bulk CV upload (multiple files)
const storageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('uploads', 'resumes');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf'; // keep .pdf
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const uploadMultiple = multer({ storage: storageMultiple });
// ===========================
// Candidate Routes
// ===========================

// Single candidate
router.post('/createCandidate', uploadSingle.single('resume'), createCandidate);
router.get('/getAllCandidates', getAllCandidates);
router.delete('/deleteCandidateByID', deleteCandidate);
router.put('/candidateUpdate', updateCandidate);
router.delete('/deleteCandidateByEmail', deleteCandidateByEmail);
router.put('/candidateUpdateByEmail', updateCandidateByEmail);

// Bulk Excel upload (for adding multiple candidates)
router.post('/bulk-upload', uploadExcel.single('file'), bulkUploadFiles);

// Bulk CV upload (redacted/original via naming convention)
router.post('/bulk-upload-cvs', uploadMultiple.array('files'), bulkUploadCandidateCVs);

// Candidate status history
router.get('/candidateStatusHistory', getCandidateStatusHistory);

//saving search to db
router.post('/saved-search', saveSearch)

router.get('/getAllSearches', getAllSavedSearches)
router.delete('/deleteSearch', deleteSearch)
router.put('/searchUpdate', savedSearchUpdate)

export { router as candidateRoute };
