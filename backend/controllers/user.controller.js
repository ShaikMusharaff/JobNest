import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/Cloudinary.js";


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // ✅ Handle both files safely
    const profilePhotoFile = req.files?.profilePhoto?.[0] || null;
    const resumeFile = req.files?.resume?.[0] || req.files?.file?.[0] || null;

    let profilePhotoUrl = "";
    let resumeUrl = "";

    // ✅ Upload profile photo if present
    if (profilePhotoFile) {
      const fileUri = getDataUri(profilePhotoFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    // ✅ Upload resume if present
    if (resumeFile) {
      const resumeUri = getDataUri(resumeFile);
      const uploadRes = await cloudinary.uploader.upload(resumeUri.content, {
        folder: "resumes",
        resource_type: "raw", // ⚡ ensures PDF uploads work
      });
      resumeUrl = uploadRes.secure_url;
    }

    // ✅ Auto-extract skills from resume during registration if available
    let autoExtractedSkills = [];
    if (resumeUrl) {
      try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5001";
        const response = await fetch(`${aiServiceUrl}/analyze_resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_url: resumeUrl }),
          signal: AbortSignal.timeout(4000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.skills)) {
            autoExtractedSkills = data.skills;
          }
        }
      } catch (err) {
        console.warn("Auto-skill extraction on register skipped (AI service offline or timed out):", err.message);
      }
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
        resume: resumeUrl,
        resumeOriginalName: resumeFile ? resumeFile.originalname : "",
        skills: autoExtractedSkills
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Parse skills safely
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = skills.split(",").map((s) => s.trim());
      }
    }

    // ✅ Update basic fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray.length) user.profile.skills = skillsArray;

   // ✅ Upload resume if provided
const resumeFile = req.files?.resume?.[0];
if (resumeFile) {
  console.log("Resume received:", resumeFile.originalname);

  const fileUri = getDataUri(resumeFile);

  // ⚡ FIX: Upload as RAW type (so PDFs and DOCX files work)
  const uploaded = await cloudinary.uploader.upload(fileUri.content, {
    folder: "resumes",
    resource_type: "raw", // ✅ Important for non-image files
  });

  // ✅ Store secure URL & file name in the user's profile
  user.profile.resume = uploaded.secure_url;
  user.profile.resumeOriginalName = resumeFile.originalname;
} else {
  console.log("No resume uploaded");
}

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed.",
    });
  }
};
