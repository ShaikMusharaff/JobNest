import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  TrendingUp,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useDispatch, useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import axios from "axios";
import { RECOMMENDATION_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const isResume = Boolean(user?.profile?.resume);

  // Resume Matcher & Analyzer states
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [syncingSkills, setSyncingSkills] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleAnalyzeResume = async (fileOverride = null) => {
    const fileToUpload = fileOverride || uploadedResumeFile;
    if (!fileToUpload && !user?.profile?.resume) {
      toast.error("Please select a resume file or upload one in your profile first.");
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisStep(1);

      // Simulate step progression for responsive feedback
      const t1 = setTimeout(() => setAnalysisStep(2), 600);
      const t2 = setTimeout(() => setAnalysisStep(3), 1300);

      const formData = new FormData();

      if (fileToUpload) {
        formData.append("resume", fileToUpload);
      } else if (user?.profile?.resume) {
        formData.append("resumeUrl", user.profile.resume);
      }

      const res = await axios.post(
        `${RECOMMENDATION_API_END_POINT}/analyze-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      clearTimeout(t1);
      clearTimeout(t2);
      setAnalysisStep(4);

      if (res.data.success && res.data.analysis) {
        setAnalysisResult(res.data.analysis);
        toast.success("Resume analyzed successfully!");
      } else {
        toast.error("Could not parse resume.");
      }
    } catch (err) {
      console.error("Resume analysis error:", err);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const handleSyncSkills = async () => {
    if (!analysisResult?.skills || analysisResult.skills.length === 0) {
      toast.error("No skills to sync.");
      return;
    }

    try {
      setSyncingSkills(true);
      const res = await axios.post(
        `${RECOMMENDATION_API_END_POINT}/sync-skills`,
        { skills: analysisResult.skills },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Extracted skills successfully synced to your profile!");
      }
    } catch (err) {
      console.error("Sync skills error:", err);
      toast.error("Failed to sync skills.");
    } finally {
      setSyncingSkills(false);
    }
  };

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      <Navbar />

      {/* Main Profile Header Card */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow rounded-3xl my-8 p-8 md:p-10 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/50 via-purple-50/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-2 ring-indigo-100">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                  }
                  alt="profile"
                />
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl md:text-3xl text-gray-900 tracking-tight">
                  {user?.fullname}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  {user?.role || "Candidate"}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1 max-w-xl leading-relaxed">
                {user?.profile?.bio || "No professional summary added yet. Click 'Edit Profile' to add your bio."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-2xl text-gray-700 hover:text-indigo-600 border border-gray-200/80 hover:bg-indigo-50/50 font-bold text-xs px-5 py-2.5 shadow-sm"
            variant="outline"
          >
            <Pen className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-gray-100">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase">Email Address</div>
              <span className="font-semibold text-gray-800 text-sm">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-gray-100">
              <Contact className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase">Phone Contact</div>
              <span className="font-semibold text-gray-800 text-sm">{user?.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Registered Profile Skills Section */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-gray-900">Your Technical Skills</h2>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                {user?.profile?.skills?.length || 0}
              </span>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              + Add / Edit Skills
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <span
                  key={index}
                  className="bg-indigo-50/80 text-indigo-900 border border-indigo-200/70 text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  {item}
                </span>
              ))
            ) : (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl w-full">
                ⚠️ No skills registered yet. Enter skills in Edit Profile or use the Resume Analyzer below to automatically detect and sync them!
              </div>
            )}
          </div>
        </div>

        {/* Active Resume Row */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6A38C2] flex items-center justify-center border border-purple-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Attached Profile Resume</div>
              {isResume ? (
                <a
                  target="_blank"
                  href={user?.profile?.resume}
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>{user?.profile?.resumeOriginalName || "View Stored Document"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-gray-400">No resume document attached yet.</span>
              )}
            </div>
          </div>

          <Button
            onClick={() => handleAnalyzeResume()}
            disabled={analyzing || !isResume}
            className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm py-2.5 px-5"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Analyze Current Resume</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ==== RESUME MATCHER & ATS SCORE ANALYZER SECTION ==== */}
      <div className="max-w-5xl mx-auto my-10 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 border border-indigo-100/90 shadow-xl rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black mb-1">
                <Zap className="w-3 h-3 text-indigo-600" />
                AI Resume Intelligence
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Resume ATS & Career Fit Analyzer
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                Upload or test any resume (PDF/DOCX) to extract technical skills, evaluate keyword density, and sync with your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="my-8 p-8 rounded-3xl border-2 border-dashed border-indigo-200/90 bg-white/80 hover:bg-white transition-all flex flex-col items-center justify-center text-center shadow-inner">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <h4 className="font-extrabold text-base text-gray-900 mb-1">
            Test or Upload a Resume Document
          </h4>
          <p className="text-xs text-gray-500 max-w-md mb-5 leading-relaxed">
            Upload your latest resume (PDF or DOCX). Our NLP parser will instantly extract your skills, score your market readiness, and find matching jobs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <input
              type="file"
              id="resume-test-file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedResumeFile(file);
                  handleAnalyzeResume(file);
                }
              }}
            />
            <Button
              onClick={() => document.getElementById("resume-test-file").click()}
              disabled={analyzing}
              className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-[#6A38C2] hover:to-indigo-600 text-white font-extrabold text-xs px-6 py-2.5 shadow-md"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                  <span>Processing Document...</span>
                </>
              ) : (
                <span>Choose File (PDF/DOCX)</span>
              )}
            </Button>
            {uploadedResumeFile && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl truncate max-w-xs">
                📄 {uploadedResumeFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Real-time Analysis Progress Stepper */}
        {analyzing && (
          <div className="my-6 p-6 rounded-3xl bg-white border border-indigo-200/90 shadow-lg space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6A38C2] flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    AI Resume Engine Analyzing...
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {analysisStep <= 1 && "Step 1/4: Parsing document structure & extracting raw text..."}
                    {analysisStep === 2 && "Step 2/4: Scanning 200+ canonical technical skills & alias database..."}
                    {analysisStep === 3 && "Step 3/4: Computing multi-factor TF-IDF vector space & similarity..."}
                    {analysisStep >= 4 && "Step 4/4: Generating ATS score & market readiness suggestions..."}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-[#6A38C2] px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200">
                {analysisStep <= 1 ? "25%" : analysisStep === 2 ? "50%" : analysisStep === 3 ? "75%" : "100%"}
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6A38C2] via-indigo-600 to-violet-500 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: analysisStep <= 1 ? "25%" : analysisStep === 2 ? "50%" : analysisStep === 3 ? "75%" : "100%"
                }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Analysis Results */}
        {analysisResult && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            {/* 3 Metric Score Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    ATS Keyword Score
                  </div>
                  <div className="text-3xl font-black text-indigo-950 mt-1">
                    {analysisResult.strengthScore}<span className="text-sm text-gray-400 font-semibold">/100</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Extracted Skills
                  </div>
                  <div className="text-3xl font-black text-emerald-600 mt-1">
                    {analysisResult.skillCount || analysisResult.skills?.length || 0}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Resume Word Count
                  </div>
                  <div className="text-3xl font-black text-purple-600 mt-1">
                    {analysisResult.wordCount}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Extracted Skills Cloud + 1-Click Sync */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Skills Identified from Resume</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click "Sync Skills to Profile" to instantly add these to your candidate profile.
                  </p>
                </div>
                <Button
                  onClick={handleSyncSkills}
                  disabled={syncingSkills || !analysisResult.skills?.length}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-emerald-600/20 px-4 py-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{syncingSkills ? "Syncing..." : "Sync Skills to Profile"}</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {analysisResult.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-xl font-bold shadow-2xs"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Optimization Suggestions Checklist */}
            {analysisResult.feedback && analysisResult.feedback.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-6 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>ATS Resume Optimization Insights</span>
                </div>
                <div className="space-y-2.5">
                  {analysisResult.feedback.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-indigo-900">
                      <span className="text-indigo-600 font-black">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Recommendations CTA */}
            <div className="pt-2 text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:from-[#582da8] hover:to-indigo-700 text-white rounded-2xl px-8 py-3.5 text-xs font-extrabold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto">
                  <span>Explore Jobs Matching Your Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Applied jobs table */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200/80 shadow-sm p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900">
              Your Applied Jobs History
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Track real-time candidate review status from recruiters.
            </p>
          </div>
        </div>
        <AppliedJobTable />
      </div>

      {/* Update profile modal */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
