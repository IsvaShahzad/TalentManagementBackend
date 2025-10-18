import express from 'express';
import { 
  createUser, 
  getUser, 
  getUserRole, 
  getUsersByRole, 
  deleteUser, 
  updateUser, 
  getUserByEmail, 
  getPassword, 
  getAllUsers, 
} from '../controllers/userController.js';

const router = express.Router();

// ✅ Routes
router.post("/register", createUser);
router.get("/getUser/:id", getUser);
router.get("/getAllUsers", getAllUsers); // 👈 NEW
router.post("/fetchUser", getUserByEmail);
router.post("/fetchPasswd", getPassword);
router.post("/getRole", getUserRole);
router.post("/getUsersByRole", getUsersByRole);
router.put("/userUpdate/:id", updateUser);
router.delete("/userDelete/:id", deleteUser);

export { router as userRoute };
