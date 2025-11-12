import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/recommendation/recommend-jobs/${userId}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data.recommendations)) {
          const unique = Array.from(
            new Map(data.recommendations.map((j) => [j.title, j])).values()
          );
          setRecommendations(unique);
        } else {
          setError(data.message || "Failed to load AI recommendations");
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRecommendations();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading AI recommendations...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-6 font-medium">
        {error}
      </p>
    );

  if (recommendations.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No AI recommendations available yet.
      </p>
    );

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-white to-gray-50 py-6 px-6">
      {/* ✨ Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          🔮 AI Recommended Jobs
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Based on your skills.
        </p>
      </div>

      {/* 💼 Compact Job Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {recommendations.map((job, index) => (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col justify-between h-[210px]"
          >
            {/* Job Info */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 capitalize">
                {job.title}
              </h3>

              {job.company && (
                <p className="text-indigo-600 font-medium mb-1 text-sm">
                  {job.company}
                </p>
              )}

              {job.match_percent && (
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium mb-2">
                  ✅ {job.match_percent}% Match
                </span>
              )}

              <p className="text-gray-600 text-sm line-clamp-3">
                {job.match_reason}
              </p>
            </div>

            {/* Apply Button */}
            {job.jobId && (
              <button
                onClick={() => navigate(`/description/${job.jobId}`)}
                className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                View Details / Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
