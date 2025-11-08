import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { 
  getCompany, 
  getCompanyById, 
  registerCompany, 
  updateCompany 
} from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// ✅ Include singleUpload for file handling
router.route("/register").post(isAuthenticated, singleUpload, registerCompany);

// ✅ Get all companies
router.route("/get").get(isAuthenticated, getCompany);

// ✅ Get single company
router.route("/get/:id").get(isAuthenticated, getCompanyById);

// ✅ Update company details + logo
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;
