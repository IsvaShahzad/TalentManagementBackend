import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import { validate as isUuid } from "uuid";
import crypto from "crypto";
import bcrypt from "bcryptjs";



/* ===========================
   CREATE USER
=========================== */
// export const createUser = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   const userExists = await prisma.user.findUnique({ where: { email } });
//   if (userExists) {
//     return res.status(409).json({ message: "User already exists" });
//   }

//   const user = await prisma.user.create({ data: req.body });
//   res.status(201).json({
//     message: "User registered successfully",
//     user,
//   });
// });


//CREATE USER

// export const createUser = asyncHandler(async (req, res) => {
//   const { email, role: requestedRole } = req.body;

//   // Check if user exists
//   const userExists = await prisma.user.findUnique({ where: { email } });
//   if (userExists) return res.status(409).json({ message: "User already exists" });

//   // Map role to Prisma enum
//   const validRoles = {
//     admin: "Admin",
//     recruiter: "Recruiter",
//     client: "Client",
//   };

//   const role = requestedRole
//     ? validRoles[requestedRole.toLowerCase()]
//     : "Recruiter"; // default

//   if (!role) {
//     return res.status(400).json({ message: "Invalid role provided" });
//   }

//   // Create user
//   const user = await prisma.user.create({
//     data: {
//       full_name: req.body.full_name,
//       email,
//       password_hash: req.body.password_hash,
//       role, // always valid enum
//     },
//   });

//   // If Client, create Client record
//   if (role === "Client") {
//     await prisma.client.create({ data: { userId: user.user_id } });
//   }

//   res.status(201).json({
//     message: `User registered successfully as ${role}`,
//     user,
//   });
// });


/*export const createUser = asyncHandler(async (req, res) => {
  const { full_name, email, password_hash, role, company = '' } = req.body;

  console.log("company", company)
  if (!full_name || !email || !password_hash || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await prisma.user.create({
    data: { full_name, email, password_hash, role },
  });
  /*
    if (role === 'Client' && company) {
      await prisma.client.create({
        data: { company, userId: newUser.user_id },
      });
    }*/
/*
if (role === 'Client') {
 if (!company) {
   return res.status(400).json({ message: "Company is required for Client users" });
 }
 await prisma.client.create({
   data: { company, userId: newUser.user_id },
 });
}

res.status(201).json({ message: "User created successfully", user: newUser });
});

*/
export const createUser = asyncHandler(async (req, res) => {
  try {
    const { full_name, email, password_hash, role, company } = req.body;

    // Validate required fields
    if (!full_name || !email || !password_hash || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: { full_name, email, password_hash, role },
    });

    // If role is Client
    if (role === "Client") {
      // If no company name provided, set it to null
      const companyValue = company && company.trim() !== "" ? company.trim() : null;

      // Create a client record if company exists, otherwise skip
      if (companyValue) {
        await prisma.client.create({
          data: {
            company: companyValue,
            userId: newUser.user_id,
          },
        });
      } else {
        console.warn(`Client user ${email} has no company provided — skipping client record.`);
      }
    }

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(" Error creating user: ", error);
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

/* ===========================
   GET USER BY ID
=========================== */
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid UUID" });
  }

  const user = await prisma.user.findUnique({
    where: { user_id: id },
  });

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  res.status(200).json(user);
});

/* ===========================
   GET USER BY EMAIL
=========================== */
export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  res.status(200).json({
    user:
    {
      email: user.email,
      role: user.role,
    }
  });
});

/* ===========================
   CHECK PASSWORD
=========================== */
export const getPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Direct string comparison
  if (user.password_hash !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.status(200).json({
    message: "Authentication successful",
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
});


//GET LOGGED IN USERS


// Record login
export const recordLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const loginActivity = await prisma.loginActivity.create({
    data: { userId: user.user_id, eventType: "login" },
  });
  res.status(201).json({ message: "Login recorded", loginActivity });
});

// Record logout
export const recordLogout = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const logoutActivity = await prisma.loginActivity.create({
    data: { userId: user.user_id, eventType: "logout" },
  });
  res.status(201).json({ message: "Logout recorded", logoutActivity });
});

// Fetch login activities
export const getLoginActivities = asyncHandler(async (req, res) => {
  const activities = await prisma.loginActivity.findMany({
    where: { eventType: "login" },
    include: { user: { select: { full_name: true, email: true, role: true } } },
    orderBy: { occurredAt: "desc" },
  });
  res.status(200).json(activities);
});

// Fetch logout activities
export const getLogoutActivities = asyncHandler(async (req, res) => {
  const activities = await prisma.loginActivity.findMany({
    where: { eventType: "logout" },
    include: { user: { select: { full_name: true, email: true, role: true } } },
    orderBy: { occurredAt: "desc" },
  });
  res.status(200).json(activities);
});



//POST LOGGED IN USERS


// POST /api/user/loginPost
export const loginPostUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  // Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Check password
  if (user.password_hash !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Record login activity (optional)
  await prisma.loginActivity.create({
    data: { userId: user.user_id, eventType: "login" },
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
});



/* ===========================
   GET USER ROLE
=========================== */
export const getUserRole = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ role: user.role });
});

/* ===========================
   GET USERS BY ROLE
=========================== */
export const getUsersByRole = asyncHandler(async (req, res) => {
  console.log("📥 Incoming request to get users by role");

  const { role } = req.body;

  if (!role) {
    return res
      .status(400)
      .json({ message: "Please provide a role (e.g., Admin, Recruiter, Client)" });
  }

  const validRoles = ["Admin", "Recruiter", "Client"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role provided. Must be Admin, Recruiter, or Client.",
    });
  }

  const users = await prisma.user.findMany({
    where: { role },
    select: {
      user_id: true,
      full_name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!users || users.length === 0) {
    return res.status(404).json({
      message: `No users found with the role '${role}'.`,
      users: [],
    });
  }

  console.log(`✅ Found ${users.length} ${role} users`);
  res.status(200).json({
    message: `Fetched ${users.length} user(s) with the role '${role}'.`,
    users,
  });
});

/* ===========================
   UPDATE USER
=========================== */
// export const updateUser = asyncHandler(async (req, res) => {
//   const { full_name, email, role } = req.body;
//   const { id } = req.params;

//   const user = await prisma.user.findUnique({ where: { user_id: id } });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const updatedUser = await prisma.user.update({
//     where: { user_id: id },
//     data: {
//       full_name: full_name ?? user.full_name,
//       email: email ?? user.email,
//       role: role ?? user.role,
//     },
//   });

//   res.status(200).json({
//     message: "User updated successfully",
//     updatedUser,
//   });
// });

/* ===========================
   UPDATE USER BY EMAIL
=========================== */

export const updateUserByEmail = asyncHandler(async (req, res) => {
  const { full_name, email, role, currentEmail, company } = req.body;
  console.log("company in contoller", company)
  if (!currentEmail) {
    return res.status(400).json({ message: "Current email is required" });
  }

  // Find the existing user
  const user = await prisma.user.findUnique({ where: { email: currentEmail } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Build the update data object
  const updateData = {
    full_name: full_name ?? user.full_name,
    email: email ?? user.email,
    role: role ?? user.role,
  };

  // Only add Client upsert if role is Client AND company is defined
  if (role === 'Client' && company) {
    updateData.Client = {
      upsert: {
        create: { company },
        update: { company },
      },
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: currentEmail },
      data: updateData,
      include: { Client: true },
    });

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});


/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("forgot password api");
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  console.log("user checked");
  if (!user) return res.status(404).json({ message: "User not found" });
  //check role
  if (user.role == "Admin" || user.role == "Recruiter") {
    console.log("admin user");
    return res.status(200).json({
      // message: "User is admin",
      role: user.role,
    });
  }
  return res.status(200).json({
    message: "Please contact your Admin for password reset. support@hrbs.com",
    role: user.role,
  })
  // Generate a token just for sending the email (not saving in DB)
  //const resetToken = crypto.randomBytes(32).toString("hex");

  // Create reset link
  //const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

  // For now, log it
  //console.log("Reset Link:", resetLink);

  // TODO: Send actual email here using nodemailer or any email service

  //res.status(200).json({ message: "Verification link sent! Check console for now." });
});

/* ===========================
   DELETE USER BY EMAIL
=========================== */
export const deleteUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  await prisma.user.delete({ where: { email } });
  res.status(200).json({ message: "User deleted successfully" });
});

/* ===========================
   GET ALL USERS
=========================== */
export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("📥 Fetching all users...");
  const users = await prisma.user.findMany(
    {
      include: {
        Client: true, // includes company, etc.
      },
    }
  );
  console.log(users)



  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }


  res.status(200).json({
    message: "All users fetched successfully",
    count: users.length,
    users,
  });
});

//DeleteRecruiter

export const deleteRecruiter = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role !== "Recruiter") return res.status(403).json({ message: "User is not a Recruiter" });

  await prisma.user.delete({ where: { email } });
  res.status(200).json({ message: "Recruiter deleted successfully" });
});


/* ===========================
   RESET PASSWORD
=========================== */
export const updatePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("getting reset data")
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  //const resetToken = crypto.randomBytes(32).toString("hex");

  // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

  //console.log("Reset Link:", resetLink);

  await prisma.user.update({
    where: { email: email },
    data: {
      password_hash: password,

    },
  });

  res.status(200).json({
    message: "Password Reset Successful.",
  });
});