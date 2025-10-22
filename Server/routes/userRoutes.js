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
    deleteRecruiter,
    getLoginActivities,
    recordLogout,
    getLogoutActivities,
    recordLogin,
    loginPostUser

} from '../controllers/userController.js';


const router = express.Router();

// ===========================
// User routes
// ===========================
router.post("/register", createUser);
router.get("/getUser/:id", getUser);
router.get("/getAll", getAllUsers);
router.delete("/userDeleteByEmail", deleteUserByEmail);
router.post("/fetchUser", getUserByEmail);
router.post("/fetchPasswd", getPassword);
router.post("/getRole", getUserRole);
router.post("/getUsersByRole", getUsersByRole);
router.put("/userUpdateByEmail", updateUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", updatePassword);


// ===========================
// LoginActivity routes
// ===========================
router.post("/login", recordLogin);          // record login
router.post("/logout", recordLogout);        // record logout

router.get("/login/all", getLoginActivities);   // fetch login activities
router.get("/logout/all", getLogoutActivities); // fetch logout activities
router.post("/loginPost", loginPostUser);


export { router as userRoute };
