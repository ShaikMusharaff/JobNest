import express from "express";
import {login,updateProfile,register,logout} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { multiUpload } from "../middleware/multer.js";
const router=express.Router();
router.route("/register").post(multiUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);
export default router;