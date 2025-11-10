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
          // 🧹 Remove duplicate titles
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
    return <p className="text-center mt-6">Loading AI recommendations...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (recommendations.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No AI recommendations available yet.
      </p>
    );

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-3xl font-extrabold mb-8 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="crystal-ball">
          🔮
        </span>
        AI Recommended Jobs For You
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {recommendations.map((job, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col justify-between h-full"
          >
            {/* Job Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
                {job.title}
              </h3>

              {job.match_percent && (
                <p className="text-green-600 font-medium mb-1">
                  {job.match_percent}% match
                </p>
              )}

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {job.match_reason}
              </p>
            </div>

            {/* ✅ Button fixed at bottom */}
            {job.jobId && (
              <button
                onClick={() => navigate(`/description/${job.jobId}`)}
                className="mt-auto w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
