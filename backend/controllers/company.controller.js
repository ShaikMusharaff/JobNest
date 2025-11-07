import { Company } from "../models/company.model.js";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    console.log("Body received from client:", req.body);

  try {
    // 🧩 Ensure body is parsed
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing.",
      });
    }

    // Extract from body
    const { name, description, website, location } = req.body;

    // Handle file (if uploaded)
    let logo = null;
    const file = req.file;
    if (file) {
      // Future: upload to cloudinary
      // const fileUri = getDataUri(file);
      // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      // logo = cloudResponse.secure_url;
      logo = file.path;
    }

    // Only include provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;
    if (logo) updateData.logo = logo;

    // Update the company in DB
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error in updateCompany:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};