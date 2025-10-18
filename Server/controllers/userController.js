import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import { validate as isUuid } from "uuid";
import crypto from "crypto";


/* ===========================
   CREATE USER
=========================== */
export const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await prisma.user.create({ data: req.body });
  res.status(201).json({
    message: "User registered successfully",
    user,
  });
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

  res.status(200).json(user);
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

  if (!user) return res.status(404).json({ message: "User not found" });
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
export const updateUser = asyncHandler(async (req, res) => {
  const { full_name, email, role } = req.body;
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { user_id: id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: id },
    data: {
      full_name: full_name ?? user.full_name,
      email: email ?? user.email,
      role: role ?? user.role,
    },
  });

  res.status(200).json({
    message: "User updated successfully",
    updatedUser,
  });
});


/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a token just for sending the email (not saving in DB)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Create reset link
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

  // For now, log it
  console.log("Reset Link:", resetLink);

  // TODO: Send actual email here using nodemailer or any email service

  res.status(200).json({ message: "Verification link sent! Check console for now." });
});

/* ===========================
   DELETE USER
=========================== */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { user_id: id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await prisma.user.delete({ where: { user_id: id } });
  res.status(200).json({ message: "User deleted successfully" });
});

/* ===========================
   GET ALL USERS
=========================== */
export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("📥 Fetching all users...");
  const users = await prisma.user.findMany();

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  res.status(200).json({
    message: "All users fetched successfully",
    count: users.length,
    users,
  });
});


/* ===========================
   RESET PASSWORD
=========================== */
export const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

  console.log("Reset Link:", resetLink);

  res.status(200).json({
    message: "Reset link generated! Check console for now.",
    resetLink,
  });
});


