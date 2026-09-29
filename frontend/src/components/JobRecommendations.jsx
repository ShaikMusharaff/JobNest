import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  DollarSign,
  Lightbulb,
  SlidersHorizontal,
  RefreshCw,
  Award,
  Zap,
  Target
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { RECOMMENDATION_API_END_POINT } from "@/utils/constant";

const JobRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTier, setFilterTier] = useState("all");
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${RECOMMENDATION_API_END_POINT}/recommend-jobs/${userId}`
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setRecommendations(data.recommendations || []);
        setAverageScore(data.averageMatchScore || 0);
        setCandidateSkills(data.candidateSkills || []);
      } else {
        setError(data.message || "Failed to load ML recommendations.");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Unable to connect to recommendation service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  const toggleSuggestions = (id) => {
    setExpandedSuggestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter recommendations by score tier
  const filteredJobs = recommendations.filter((job) => {
    if (filterTier === "high") return job.matchScore >= 75;
    if (filterTier === "moderate") return job.matchScore >= 50 && job.matchScore < 75;
    return true;
  });

  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        progress: "bg-gradient-to-r from-emerald-500 to-teal-400",
        pill: "bg-emerald-500 text-white",
        glow: "shadow-emerald-500/10",
        label: "Top Pick"
      };
    }
    if (score >= 65) {
      return {
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        progress: "bg-gradient-to-r from-blue-500 to-indigo-500",
        pill: "bg-blue-600 text-white",
        glow: "shadow-blue-500/10",
        label: "Strong Fit"
      };
    }
    if (score >= 45) {
      return {
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        progress: "bg-gradient-to-r from-amber-500 to-orange-400",
        pill: "bg-amber-500 text-white",
        glow: "shadow-amber-500/10",
        label: "Good Fit"
      };
    }
    return {
      badge: "bg-purple-500/10 text-purple-600 border-purple-500/30",
      progress: "bg-gradient-to-r from-purple-500 to-pink-500",
      pill: "bg-purple-600 text-white",
      glow: "shadow-purple-500/10",
      label: "Growth"
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-12 px-4">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center justify-center py-10 text-center relative z-10">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-400/20 border-t-indigo-400 animate-spin" />
              <Sparkles className="w-7 h-7 text-yellow-300 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white mb-2">
              Evaluating Market Compatibility...
            </h3>
            <p className="text-indigo-200 text-sm max-w-lg leading-relaxed">
              Synthesizing your profile skills and resume content across all open postings via TF-IDF Vectorization and fuzzy skill matching.
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4">
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-red-900 mb-1">Recommendation Service Notice</h4>
          <p className="text-red-700 text-sm max-w-md mx-auto mb-4">{error}</p>
          <Button
            onClick={fetchRecommendations}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-6 shadow-md"
          >
            Retry Matching Engine
          </Button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto my-12 px-4">
        <div className="bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 border border-indigo-100 rounded-3xl p-10 text-center shadow-sm">
          <Target className="w-12 h-12 text-[#6A38C2] mx-auto mb-3" />
          <h3 className="text-2xl font-black text-gray-900">
            No Matching Job Openings Found
          </h3>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            Upload your resume or add more technical skills to your candidate profile to unlock personalized compatibility matches.
          </p>
          <Button
            onClick={() => navigate("/profile")}
            className="mt-6 bg-gradient-to-r from-[#6A38C2] to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl font-bold px-8"
          >
            Update Profile & Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#31104B] p-8 md:p-12 shadow-2xl mb-10 text-white border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold mb-4 border border-white/15">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart AI Matching Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Curated Opportunities <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Matched to Your Skills & Resume
              </span>
            </h2>
            <p className="text-indigo-200/90 mt-3 text-sm md:text-base max-w-2xl leading-relaxed">
              Our ML model continuously scans your registered profile skills and resume text to calculate precise compatibility scores.
            </p>

            {/* Quick Skills Strip */}
            {candidateSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-5">
                <span className="text-xs text-indigo-300 font-semibold">Evaluated on:</span>
                {candidateSkills.slice(0, 6).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-indigo-100 border border-white/15 backdrop-blur-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
                {candidateSkills.length > 6 && (
                  <span className="text-xs text-indigo-300 font-semibold">
                    +{candidateSkills.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Fit Statistics Card */}
          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-xl min-w-[280px]">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6A38C2] to-pink-500 flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-[11px] text-indigo-200 uppercase tracking-wider font-bold">
                Overall Profile Fit
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {averageScore}%
              </div>
              <div className="text-xs text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Across {recommendations.length} Openings</span>
              </div>
            </div>
            <Button
              onClick={fetchRecommendations}
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10 ml-auto"
              title="Re-run matching"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Ambient Decorative Glows */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Filter:
          </span>
          <button
            onClick={() => setFilterTier("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTier === "all"
                ? "bg-[#6A38C2] text-white shadow-md shadow-purple-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterTier("high")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTier === "high"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            High Compatibility (≥75%)
          </button>
          <button
            onClick={() => setFilterTier("moderate")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTier === "moderate"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Good Matches (50–74%)
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Displaying {filteredJobs.length} position{filteredJobs.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const isExpanded = expandedSuggestions[job.jobId];
          const hasMissingSkills = job.missingSkills && job.missingSkills.length > 0;
          const theme = getScoreTheme(job.matchScore);

          return (
            <div
              key={job.jobId}
              className={`group bg-white rounded-3xl border border-gray-200/80 hover:border-indigo-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${theme.glow}`}
            >
              {/* Sleek Top Progress Indicator Bar */}
              <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full ${theme.progress} transition-all duration-500`}
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Company Header & Score Gauge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {job.company || "Company"}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{job.location || "India"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div
                      className={`px-3 py-1.5 rounded-2xl border text-xs font-black flex items-center gap-1.5 shadow-sm ${theme.badge}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{job.matchScore}%</span>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h3 className="font-extrabold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Meta Chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.salary > 0 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 rounded-lg">
                        ₹ {job.salary} LPA
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 rounded-lg">
                      {job.jobType || "Full-Time"}
                    </Badge>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${theme.pill}`}>
                      {job.matchTier}
                    </span>
                  </div>

                  {/* Match Reason Quote */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-4 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-indigo-900">Why it fits: </span>
                    {job.matchReason}
                  </div>

                  {/* Matched Skills */}
                  {job.matchedSkills && job.matchedSkills.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matched Skills ({job.matchedSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchedSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] px-2.5 py-0.5 rounded-md font-semibold"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {job.matchedSkills.length > 4 && (
                          <span className="text-[10px] text-emerald-700 font-bold self-center">
                            +{job.matchedSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {hasMissingSkills && (
                    <div className="mb-4">
                      <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Missing Skills ({job.missingSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.missingSkills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-0.5 rounded-md font-semibold"
                          >
                            + {skill}
                          </span>
                        ))}
                        {job.missingSkills.length > 3 && (
                          <span className="text-[10px] text-amber-700 font-bold self-center">
                            +{job.missingSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expandable Suggestions Accordion */}
                  {job.suggestions && job.suggestions.length > 0 && (
                    <div className="mt-2 mb-2">
                      <button
                        onClick={() => toggleSuggestions(job.jobId)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isExpanded ? "Hide Application Strategy" : "View Application Tips"}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-xs text-indigo-950 space-y-1.5 animate-in fade-in duration-200">
                          {job.suggestions.map((sug, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-indigo-600 font-bold">•</span>
                              <span className="leading-snug">{sug}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Button
                  onClick={() => navigate(`/description/${job.jobId}`)}
                  className="w-full mt-4 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-[#6A38C2] hover:to-indigo-600 text-white rounded-2xl py-3 text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobRecommendations;
