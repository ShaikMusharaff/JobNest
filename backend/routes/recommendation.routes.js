import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

const router = express.Router();

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.get("/recommend-jobs/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Extract skills
    const skillsArray =
      user?.profile?.skills && Array.isArray(user.profile.skills)
        ? user.profile.skills
        : Array.isArray(user.skills)
        ? user.skills
        : [];

    const skills = skillsArray.join(", ");

    if (skillsArray.length === 0) {
      return res.status(400).json({
        message: "User has no skills set. Please add skills before generating recommendations.",
      });
    }

    // ✅ Get all jobs
    const jobs = await Job.find({});
    if (jobs.length === 0)
      return res.status(404).json({ message: "No jobs found" });

    // ✅ Create job list for AI
    const jobList = jobs
      .map(
        (job, i) =>
          `${i + 1}. ${job.title} — Required: ${job.requirements.join(", ")}`
      )
      .join("\n");

    // ✅ Build AI prompt
    const prompt = `
You are an AI that recommends jobs to users based on their skills and bio.

User bio: ${user?.profile?.bio || "No bio provided"}
User skills: ${skills}

Available jobs:
${jobList}

Recommend the 5 most relevant jobs and return a valid JSON array like:
[
  { "title": "Job Title", "match_reason": "Why this job fits" }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // 🧹 Clean Gemini output
    let cleaned = text
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let recommendations;
    try {
      recommendations = JSON.parse(cleaned);
    } catch (err) {
      recommendations = [
        { raw_output: text, cleaned_output: cleaned, error: "Invalid JSON" },
      ];
    }

    // 🧠 Match AI recommendations with real Job IDs
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      const jobMap = new Map(
        jobs.map((job) => [job.title.toLowerCase().trim(), job])
      );

      recommendations = recommendations.map((rec) => {
        const matchedJob = jobMap.get(rec.title?.toLowerCase().trim());
        return {
          ...rec,
          jobId: matchedJob ? matchedJob._id : null,
        };
      });
    }

    res.json({ user: user.fullname, recommendations });
  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
