import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, RECOMMENDATION_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  DollarSign,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Building2,
  Check,
  Timer,
  XCircle,
  Clock
} from "lucide-react";
import Navbar from "./shared/Navbar";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [compatibility, setCompatibility] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // Real-time ticking countdown clock (updates every 1000ms)
  useEffect(() => {
    if (!singleJob?.deadline) {
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    const targetDate = new Date(singleJob.deadline);

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timerInterval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerInterval);
  }, [singleJob?.deadline]);

  const applyJobHandler = async () => {
    if (isExpired) {
      toast.error("The application deadline has passed for this job opening.");
      return;
    }
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Fetch ML Compatibility Score for this specific job
  useEffect(() => {
    const fetchCompatibility = async () => {
      if (!jobId) return;
      try {
        setLoadingScore(true);
        const endpoint = user?._id
          ? `${RECOMMENDATION_API_END_POINT}/score-job/${jobId}/${user._id}`
          : `${RECOMMENDATION_API_END_POINT}/score-job/${jobId}`;
        const res = await axios.get(endpoint);
        if (res.data.success) {
          setCompatibility(res.data.analysis);
        }
      } catch (err) {
        console.warn("Could not fetch job compatibility:", err);
      } finally {
        setLoadingScore(false);
      }
    };

    fetchCompatibility();
  }, [jobId, user?._id]);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-8 px-4 md:px-6">
        {/* ==== UPPER HERO BANNER ==== */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#3B0764] p-8 md:p-12 text-white border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold mb-4 border border-white/15">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Verified Career Opportunity</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {singleJob?.title || "Job Title"}
              </h1>
              <p className="text-indigo-200 mt-2 text-xl font-semibold tracking-wide flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-300" />
                <span>{singleJob?.company?.name || "Company Name"}</span>
              </p>

              <div className="flex flex-wrap gap-2.5 mt-6">
                <Badge className="bg-white/15 text-white border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold">
                  {singleJob?.position || 1} Open Position{singleJob?.position === 1 ? "" : "s"}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-300/30 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold">
                  {singleJob?.jobType || "Full-Time"}
                </Badge>
                <Badge className="bg-white/15 text-white border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold">
                  ₹ {singleJob?.salary || "N/A"} LPA
                </Badge>
                <Badge className="bg-white/15 text-white border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                  {singleJob?.location || "Remote"}
                </Badge>
              </div>
            </div>

            <Button
              onClick={isApplied || isExpired ? null : applyJobHandler}
              disabled={isApplied || isExpired}
              className={`px-9 py-4 text-base font-extrabold rounded-2xl transition-all duration-300 shadow-2xl ${
                isApplied
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isExpired
                  ? "bg-rose-500/80 text-white cursor-not-allowed border border-rose-400"
                  : "bg-gradient-to-r from-white to-indigo-50 text-[#3B0764] hover:bg-white hover:scale-105 active:scale-95 shadow-white/10 cursor-pointer"
              }`}
            >
              {isApplied
                ? "Already Applied"
                : isExpired
                ? "Applications Closed"
                : "Apply For Position"}
            </Button>
          </div>

          {/* Decorative Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ==== REAL-TIME LIVE ACTIVITY & RECRUITER INSIGHTS TICKER ==== */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {singleJob?.applications?.length ? `${singleJob.applications.length} Candidates Applied` : "Early Applicant Role"}
              </p>
              <p className="text-[11px] text-slate-400">High response rate expected</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Active Review Pipeline</p>
              <p className="text-[11px] text-slate-400">Recruiter screening candidates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6A38C2] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">AI Compatibility Ready</p>
              <p className="text-[11px] text-slate-400">Real-time skill matching active</p>
            </div>
          </div>
        </div>

        {/* ==== REAL-TIME LIVE DEADLINE COUNTDOWN / ALERT BANNER ==== */}
        {singleJob?.deadline && (
          <div className={`mb-8 p-6 rounded-3xl border shadow-lg transition-all ${
            isExpired 
              ? 'bg-rose-50/90 border-rose-200 text-rose-950' 
              : timeLeft?.days <= 2
              ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-amber-300 shadow-amber-500/5'
              : 'bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 border-indigo-200/80'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isExpired 
                    ? 'bg-rose-100 text-rose-600' 
                    : timeLeft?.days <= 2
                    ? 'bg-amber-100 text-amber-700 animate-pulse'
                    : 'bg-purple-100 text-[#6A38C2]'
                }`}>
                  {isExpired ? <XCircle className="w-6 h-6" /> : <Timer className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isExpired
                        ? 'bg-rose-200 text-rose-900'
                        : timeLeft?.days <= 2
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-purple-200 text-purple-950'
                    }`}>
                      {isExpired ? "Deadline Expired" : "Application Deadline"}
                    </span>
                    {!isExpired && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Live Countdown
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 mt-1">
                    {isExpired 
                      ? "Applications for this opening have closed." 
                      : `Deadline: ${new Date(singleJob.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                  </h4>
                </div>
              </div>

              {!isExpired && timeLeft && (
                <div className="flex items-center gap-2 sm:gap-3 self-center md:self-auto">
                  <div className="flex flex-col items-center bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/80 min-w-[55px]">
                    <span className="font-black text-xl text-slate-900 leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Days</span>
                  </div>
                  <span className="font-bold text-slate-400 text-lg leading-none">:</span>
                  <div className="flex flex-col items-center bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/80 min-w-[55px]">
                    <span className="font-black text-xl text-slate-900 leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Hours</span>
                  </div>
                  <span className="font-bold text-slate-400 text-lg leading-none">:</span>
                  <div className="flex flex-col items-center bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/80 min-w-[55px]">
                    <span className="font-black text-xl text-slate-900 leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Mins</span>
                  </div>
                  <span className="font-bold text-slate-400 text-lg leading-none">:</span>
                  <div className="flex flex-col items-center bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200/80 min-w-[55px]">
                    <span className="font-black text-xl text-[#6A38C2] leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Secs</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==== MACHINE LEARNING COMPATIBILITY SCORECARD ==== */}
        {user && user.role === "student" && (
          <div className="mb-10 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 border border-indigo-100 shadow-xl rounded-3xl p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-indigo-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-800 bg-indigo-100 px-3 py-0.5 rounded-full">
                      ML Candidate Fit
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      Profile Skills & Resume Analysis
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
                    Your Compatibility Scorecard
                  </h3>
                </div>
              </div>

              {/* Match Gauge */}
              {loadingScore ? (
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-600 font-bold">Computing fit...</span>
                </div>
              ) : compatibility ? (
                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-indigo-100 shadow-md">
                  <div className="text-right">
                    <div className="text-[11px] text-gray-400 uppercase font-black tracking-wider">
                      Overall Match
                    </div>
                    <div className="text-sm font-extrabold text-indigo-950">
                      {compatibility.matchTier}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-200 shadow-inner">
                    <span className="text-2xl font-black text-indigo-900">
                      {compatibility.matchScore}%
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Compatibility Breakdown Details */}
            {compatibility && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* 1. Matched Skills */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-black text-sm mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Skills You Have ({compatibility.matchedSkills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {compatibility.matchedSkills?.length > 0 ? (
                        compatibility.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-xl font-bold"
                          >
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No direct skill overlap detected.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-3 pt-2 border-t border-gray-50">
                    Recognized from your profile skills and uploaded resume.
                  </div>
                </div>

                {/* 2. Missing Skills */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-800 font-black text-sm mb-3">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Required Skills to Highlight ({compatibility.missingSkills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {compatibility.missingSkills?.length > 0 ? (
                        compatibility.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-xl font-bold"
                          >
                            + {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 block">
                          🎉 Full technical requirements match!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-3 pt-2 border-t border-gray-50">
                    Mention any related experience in these areas in your application.
                  </div>
                </div>

                {/* 3. Actionable Application Advice */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-900 font-black text-sm mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Application Strategy</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {compatibility.matchReason}
                    </p>
                    {compatibility.suggestions?.length > 0 && (
                      <div className="space-y-2 border-t border-gray-100 pt-2 text-[11px] text-gray-700">
                        {compatibility.suggestions.slice(0, 2).map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span className="leading-snug">{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==== DETAILED JOB OVERVIEW ==== */}
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 border border-gray-200/80">
          <h2 className="text-2xl font-black mb-6 text-gray-900 border-b pb-4 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-[#6A38C2]" />
            <span>Job Overview & Requirements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-gray-700 text-base leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Target Role</span>
                <span className="font-semibold text-gray-900">{singleJob?.title || "Not specified"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Location</span>
                <span className="font-semibold text-gray-900">{singleJob?.location || "N/A"}</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
              <span className="font-black text-gray-900 block mb-2 text-sm uppercase tracking-wider text-indigo-900">
                Detailed Job Description
              </span>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {singleJob?.description || "No description provided"}
              </p>
            </div>

            {singleJob?.requirements?.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <span className="font-black text-gray-900 block mb-3 text-sm uppercase tracking-wider text-indigo-900">
                  Required Competencies & Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {singleJob.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="bg-slate-100 text-slate-800 text-xs px-3.5 py-1.5 rounded-xl font-bold border border-slate-200 shadow-2xs"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Experience Needed</span>
                <span className="font-semibold text-gray-900">{singleJob?.experienceLevel || 0} years experience</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Compensation Package</span>
                <span className="font-semibold text-gray-900">₹ {singleJob?.salary || "N/A"} LPA</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Applicants</span>
                <span className="font-semibold text-gray-900">{singleJob?.applications?.length || 0} candidates applied</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Posting Date</span>
                <span className="font-semibold text-gray-900">{singleJob?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isExpired 
                  ? 'bg-rose-50 text-rose-600' 
                  : singleJob?.deadline 
                  ? 'bg-purple-50 text-[#6A38C2]' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs uppercase block text-gray-400">Application Deadline</span>
                <span className={`font-semibold ${isExpired ? 'text-rose-600 font-bold' : 'text-gray-900'}`}>
                  {singleJob?.deadline 
                    ? `${singleJob.deadline.split("T")[0]} ${isExpired ? '(Closed)' : ''}` 
                    : "Open Indefinitely"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
