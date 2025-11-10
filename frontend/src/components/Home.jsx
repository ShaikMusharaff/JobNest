import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import JobRecommendations from "./JobRecommendations"; // 👈 add this import

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
       {/* 👇 Show AI recommendations only for candidates */}
      {user && user.role === "student" && (
        <JobRecommendations userId={user._id} />
      )}
      <LatestJobs />

     

      <Footer />
    </div>
  );
};

export default Home;
