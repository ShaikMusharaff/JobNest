// ResumeUpload.jsx
import axios from "axios";
import { useState } from "react";

function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleUpload = async () => {
    const text = await resume.text();
    const res = await axios.post("/api/recommendation/recommend", { resumeText: text });
    setJobs(res.data);
  };

  return (
    <div className="p-6">
      <input type="file" onChange={(e) => setResume(e.target.files[0])} />
      <button onClick={handleUpload} className="btn-primary">Get Recommendations</button>

      <div className="mt-4">
        {jobs.map((job, i) => (
          <div key={i} className="border p-3 rounded">
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>Match Score: {job.matchScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ResumeUpload;
