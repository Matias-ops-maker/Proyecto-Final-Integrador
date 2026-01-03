import express from "express";
import { register, login, getProfile, updateProfile, changePassword, deleteAccount, refreshToken } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", verifyToken, refreshToken);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/account", verifyToken, deleteAccount);

export default router;

