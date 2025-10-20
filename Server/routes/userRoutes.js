import express from 'express';
import {
    createUser,
    getUser,
    getUserRole,
    getUsersByRole,
    getUserByEmail,
    getPassword,
    getAllUsers,
    forgotPassword,
    updatePassword,
    updateUserByEmail,
    deleteUserByEmail,
    deleteRecruiter
} from '../controllers/userController.js';

const router = express.Router();

// ✅ Routes
router.post("/register", createUser);
router.get("/getUser/:id", getUser);
router.get("/getAll", getAllUsers); // 👈 NEW
router.delete("/userDeleteByEmail", deleteUserByEmail);
router.post("/fetchUser", getUserByEmail);
router.post("/fetchPasswd", getPassword);
router.post("/getRole", getUserRole);
router.post("/getUsersByRole", getUsersByRole);
router.put("/userUpdateByEmail", updateUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", updatePassword);




router.post('/reset-password', async (req) => {
    console.log('Reset password payload:', req.body);
    // continue logic here...
});


export { router as userRoute };