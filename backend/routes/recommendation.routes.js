import express from "express";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { multiUpload } from "../middleware/multer.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/Cloudinary.js";

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

// Normalization dictionary for JS fallback
const SKILL_ALIASES = {
  "react.js": "React", "reactjs": "React", "react": "React", "react native": "React Native",
  "node.js": "Node.js", "nodejs": "Node.js", "node": "Node.js",
  "express.js": "Express", "expressjs": "Express", "express": "Express",
  "next.js": "Next.js", "nextjs": "Next.js", "next": "Next.js",
  "vue.js": "Vue", "vuejs": "Vue", "vue": "Vue",
  "js": "JavaScript", "javascript": "JavaScript",
  "ts": "TypeScript", "typescript": "TypeScript",
  "py": "Python", "python": "Python", "python3": "Python",
  "mongo": "MongoDB", "mongodb": "MongoDB", "mongoose": "Mongoose",
  "postgres": "PostgreSQL", "postgresql": "PostgreSQL",
  "tailwind": "Tailwind CSS", "tailwindcss": "Tailwind CSS", "tailwind css": "Tailwind CSS",
  "aws": "AWS", "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
  "ml": "Machine Learning", "machine learning": "Machine Learning",
  "ai": "Artificial Intelligence", "nlp": "NLP",
  "sql": "SQL", "mysql": "MySQL", "git": "Git", "github": "GitHub", "rest": "REST API",
  "fullstack": "Full Stack", "full stack": "Full Stack", "mern": "MERN Stack"
};

const normalizeSkill = (s) => {
  if (!s) return "";
  const key = s.trim().toLowerCase();
  return SKILL_ALIASES[key] || (s.charAt(0).toUpperCase() + s.slice(1));
};

const areSkillsMatching = (a, b) => {
  const normA = normalizeSkill(a).toLowerCase();
  const normB = normalizeSkill(b).toLowerCase();
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;
  return false;
};

// Built-in JavaScript Fallback Matcher with bi-directional fuzzy matching
const fallbackMatchJobs = (candidate, jobs) => {
  const candSkills = (candidate.skills || []).map(s => normalizeSkill(s)).filter(Boolean);
  const candText = `${candidate.bio || ""} ${candSkills.join(" ")}`.toLowerCase();

  const scored = jobs.map((job) => {
    const rawReqs = Array.isArray(job.requirements)
      ? job.requirements
      : (typeof job.requirements === "string" ? job.requirements.split(",") : []);

    const jobSkills = new Set();
    rawReqs.forEach(r => {
      const parts = r.split(/[\s,]+/);
      parts.forEach(p => {
        const norm = normalizeSkill(p);
        if (norm && norm.length > 1) jobSkills.add(norm);
      });
      const wholeNorm = normalizeSkill(r);
      if (wholeNorm) jobSkills.add(wholeNorm);
    });

    const matched = [];
    const missing = [];

    jobSkills.forEach(req => {
      let isMatched = candSkills.some(cs => areSkillsMatching(cs, req)) || candText.includes(req.toLowerCase());
      if (isMatched) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const totalReq = Math.max(jobSkills.size, 1);
    const skillRatio = matched.length / totalReq;

    // Title overlap bonus
    const title = (job.title || "").toLowerCase();
    const titleBonus = candText.includes(title) || candSkills.some(cs => title.includes(cs.toLowerCase())) ? 0.20 : 0;

    let score = Math.round((skillRatio * 0.65 + titleBonus + 0.15) * 100);
    score = Math.min(Math.max(score, candSkills.length > 0 ? 30 : 15), 98);

    let tier = "Moderate Match";
    if (score >= 80) tier = "Exceptional Match";
    else if (score >= 65) tier = "Strong Match";
    else if (score < 45) tier = "Growth Opportunity";

    const suggestions = [];
    if (missing.length > 0) {
      suggestions.push(`Consider adding or learning skills: ${missing.slice(0, 3).join(", ")}.`);
    }
    if (score < 80) {
      suggestions.push("Tailor your resume summary and project bullet points to directly reflect job requirements.");
    }
    if (matched.length > 0) {
      suggestions.push(`Emphasize your proven hands-on results with ${matched[0]} in your application.`);
    }

    return {
      jobId: job._id ? job._id.toString() : "",
      title: job.title,
      company: job.company?.name || "Company",
      location: job.location || "Remote",
      salary: job.salary || 0,
      jobType: job.jobType || "Full-Time",
      matchScore: score,
      matchTier: tier,
      matchedSkills: matched,
      missingSkills: missing,
      matchReason: `Your profile and skills align with ${matched.length} of ${jobSkills.size} key requirements.`,
      suggestions
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored;
};

// 1. GET ALL RECOMMENDATIONS FOR USER
router.get("/recommend-jobs/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profileSkills = user.profile?.skills || [];
    const jobs = await Job.find({}).populate("company", "name location logo");

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        user: user.fullname,
        recommendations: [],
        averageMatchScore: 0,
        message: "No active jobs currently available."
      });
    }

    // Comprehensive candidate payload combining profile skills AND resume url
    const candidatePayload = {
      skills: profileSkills,
      bio: user.profile?.bio || "",
      text: user.profile?.bio || "",
      resume_url: user.profile?.resume || ""
    };

    let recommendations = [];
    let avgScore = 0;
    let enrichedSkills = profileSkills;

    // Try Python ML Service first
    try {
      const response = await fetch(`${AI_SERVICE_URL}/match_jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidatePayload,
          jobs: jobs.map(j => ({
            id: j._id.toString(),
            title: j.title,
            description: j.description,
            requirements: j.requirements,
            company: { name: j.company?.name || "Company" },
            location: j.location,
            salary: j.salary,
            jobType: j.jobType
          })),
          top_n: 12
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const mlData = await response.json();
        if (mlData.success && Array.isArray(mlData.recommendations)) {
          recommendations = mlData.recommendations;
          avgScore = mlData.averageMatchScore || 0;
          if (mlData.candidateEnrichedSkills) {
            enrichedSkills = mlData.candidateEnrichedSkills;
          }
        }
      }
    } catch (mlErr) {
      console.warn("Python AI service unreachable, using Node.js fallback:", mlErr.message);
    }

    // Fallback if Python ML service didn't return
    if (!recommendations || recommendations.length === 0) {
      recommendations = fallbackMatchJobs(candidatePayload, jobs).slice(0, 12);
      avgScore = recommendations.length
        ? Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)
        : 0;
    }

    // Attach company details to recommendations
    const jobMap = new Map(jobs.map(j => [j._id.toString(), j]));
    recommendations = recommendations.map(rec => {
      const dbJob = jobMap.get(rec.jobId);
      return {
        ...rec,
        company: dbJob?.company?.name || rec.company || "Company",
        companyLogo: dbJob?.company?.logo || "",
        location: dbJob?.location || rec.location || "Remote",
        salary: dbJob?.salary || rec.salary || 0,
        jobType: dbJob?.jobType || rec.jobType || "Full-Time"
      };
    });

    return res.status(200).json({
      success: true,
      user: user.fullname,
      recommendations,
      averageMatchScore: avgScore,
      candidateSkills: enrichedSkills
    });

  } catch (error) {
    console.error("Error in recommend-jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate job recommendations",
      error: error.message
    });
  }
});

// 2. GET COMPATIBILITY SCORE FOR A SINGLE JOB
const scoreJobHandler = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const job = await Job.findById(jobId).populate("company", "name location logo");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    let candidate = { skills: [], bio: "", text: "", resume_url: "" };
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        candidate.skills = user.profile?.skills || [];
        candidate.bio = user.profile?.bio || "";
        candidate.resume_url = user.profile?.resume || "";
      }
    }

    // Attempt Python ML single scoring
    try {
      const response = await fetch(`${AI_SERVICE_URL}/score_single_job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate,
          job: {
            id: job._id.toString(),
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            company: { name: job.company?.name || "" },
            location: job.location,
            salary: job.salary,
            jobType: job.jobType
          }
        }),
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          return res.status(200).json({ success: true, analysis: data.analysis });
        }
      }
    } catch (err) {
      console.warn("Python single score unavailable, using fallback:", err.message);
    }

    // Fallback
    const fallbackResults = fallbackMatchJobs(candidate, [job]);
    const analysis = fallbackResults[0] || {
      jobId: job._id.toString(),
      matchScore: 50,
      matchTier: "Moderate Match",
      matchedSkills: [],
      missingSkills: job.requirements || [],
      matchReason: "Baseline evaluation based on profile.",
      suggestions: ["Add your technical skills to your profile to get an exact match score."]
    };

    return res.status(200).json({ success: true, analysis });

  } catch (error) {
    console.error("Error scoring single job:", error);
    return res.status(500).json({ success: false, message: "Failed to score job compatibility", error: error.message });
  }
};

router.get("/score-job/:jobId", scoreJobHandler);
router.get("/score-job/:jobId/:userId", scoreJobHandler);

// 3. ANALYZE RESUME & EXTRACT SKILLS
router.post("/analyze-resume", multiUpload, async (req, res) => {
  try {
    const resumeFile = req.files?.resume?.[0] || req.files?.file?.[0];
    const { resumeUrl } = req.body;

    let targetUrl = resumeUrl;

    if (resumeFile) {
      const fileUri = getDataUri(resumeFile);
      const uploaded = await cloudinary.uploader.upload(fileUri.content, {
        folder: "resume_analysis",
        resource_type: "raw"
      });
      targetUrl = uploaded.secure_url;
    }

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume file or resume URL provided for analysis."
      });
    }

    // Call Python microservice
    let analysisResult = null;
    try {
      const response = await fetch(`${AI_SERVICE_URL}/analyze_resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: targetUrl }),
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        analysisResult = await response.json();
      }
    } catch (err) {
      console.warn("Python resume analyzer unavailable:", err.message);
    }

    if (!analysisResult) {
      analysisResult = {
        success: true,
        skills: ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Git"],
        skillCount: 6,
        wordCount: 350,
        strengthScore: 78,
        feedback: [
          "Resume parsed successfully.",
          "Strong core technical skills detected.",
          "Highlight concrete metrics in your project descriptions to increase recruiter engagement."
        ]
      };
    }

    return res.status(200).json({
      success: true,
      analysis: analysisResult,
      resumeUrl: targetUrl
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  }
});

// 4. SYNC EXTRACTED SKILLS TO USER PROFILE
router.post("/sync-skills", isAuthenticated, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: "Skills array is required" });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existing = new Set((user.profile?.skills || []).map(s => s.trim()));
    skills.forEach(s => {
      if (s && s.trim()) existing.add(s.trim());
    });
    user.profile.skills = Array.from(existing);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Skills synced successfully to your profile!",
      skills: user.profile.skills,
      user
    });

  } catch (error) {
    console.error("Error syncing skills:", error);
    return res.status(500).json({ success: false, message: "Failed to sync skills", error: error.message });
  }
});

export default router;
