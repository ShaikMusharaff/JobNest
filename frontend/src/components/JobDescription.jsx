import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Briefcase, MapPin, CalendarDays, DollarSign, Users } from "lucide-react";
import Navbar from "./shared/Navbar";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
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
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto mt-16 px-6 bg-gray-50 min-h-screen">
      {/* ==== UPPER SECTION ==== */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B21B6] via-[#6D28D9] to-[#7C3AED]" />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              {singleJob?.title || "Job Title"}
            </h1>
            <p className="text-gray-200 mt-2 text-xl font-medium tracking-wide">
              {singleJob?.company?.name || "Company Name"}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <Badge className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-md backdrop-blur-md">
                {singleJob?.position || 1} Positions
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-100 border border-emerald-300/30 px-3 py-1 rounded-md backdrop-blur-md">
                {singleJob?.jobType || "Full-Time"}
              </Badge>
              <Badge className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-md backdrop-blur-md">
                ₹ {singleJob?.salary || "N/A"} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
              isApplied
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-white text-[#6D28D9] hover:bg-[#f3e8ff] hover:scale-105"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        {/* Decorative bottom gradient bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#10B981] via-[#7C3AED] to-[#6D28D9]" />
      </div>

      {/* ==== JOB DETAILS ==== */}
      <div className="bg-white shadow-lg rounded-3xl p-10 border border-gray-100 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-[#7C3AED]" />
          Job Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-gray-700 text-[1.05rem] leading-relaxed">
          <p className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Role:</span>
            <span className="pl-2">{singleJob?.title || "Not specified"}</span>
          </p>

          <p className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Location:</span>
            <span className="pl-2">{singleJob?.location || "N/A"}</span>
          </p>

          <p className="flex items-start gap-3 col-span-1 md:col-span-2">
            <span className="font-semibold flex-shrink-0">Description:</span>
            <span className="pl-2 text-gray-600">
              {singleJob?.description || "No description provided"}
            </span>
          </p>

          <p className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Experience:</span>
            <span className="pl-2">{singleJob?.experience || "N/A"} yrs</span>
          </p>

          <p className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Salary:</span>
            <span className="pl-2">₹ {singleJob?.salary || "N/A"} LPA</span>
          </p>

          <p className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Applicants:</span>
            <span className="pl-2">{singleJob?.applications?.length || 0}</span>
          </p>

          <p className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-semibold">Posted Date:</span>
            <span className="pl-2">
              {singleJob?.createdAt?.split("T")[0] || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  </>);
};

export default JobDescription;
