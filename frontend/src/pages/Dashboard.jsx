import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  FaCode,
  FaBriefcase,
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalSolved: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: "/maang.png",
      alt: "MAANG Preparation",
    },
    {
      id: 2,
      image: "/job-based.png",
      alt: "Coding Excellence",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/track/stats");
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Banner Slider */}
        <div className="w-full h-32 md:h-90 rounded-2xl overflow-hidden mb-8 shadow-sm border border-zinc-200 relative group">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient for better text readability if needed later, kept subtle here */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent"></div> */}
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Identity & Status (The "Sidebar") */}
          <div className="lg:col-span-4 space-y-2 md:space-y-8">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-3 md:p-6 border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-4 mb-1 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">
                    {user?.name}
                  </h2>
                  <p className="text-zinc-500 text-xs md:text-sm font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-1 md:pt-6">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-500">
                    Solved Questions
                  </span>
                  <span className="text-2xl font-bold">
                    {stats.totalSolved}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2 mt-2">
                  <div className="bg-blue-900 h-2 rounded-full w-[15%]"></div>
                </div>
              </div>
            </div>

            {/* Helper / Quote */}
            <div className="hidden lg:block p-6 rounded-2xl bg-zinc-100 border border-zinc-200/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Daily Focus
              </h3>
              <p className="text-zinc-600 italic text-sm leading-relaxed">
                "First, solve the problem. Then, write the code."
              </p>
              <p className="text-zinc-400 text-xs mt-2 font-medium non-italic">
                — John Johnson
              </p>
            </div>
          </div>

          {/* Right Column: Work Area */}
          <div className="lg:col-span-8">
            <div className="mb-4 md:mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                Active Tracks
              </h1>
              <p className="text-zinc-500">
                Select a path to continue your preparation.
              </p>
            </div>

            <div className="space-y-4">
              {/* MAANG Track Card - Horizontal Layout */}
              <Link to="/cse/maang" className="group block">
                <div className="bg-white rounded-xl border border-zinc-200 p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 hover:border-zinc-400 hover:shadow-md transition-all duration-200">
                  <div className="w-40 h-12 flex-shrink-0 flex items-center justify-center ">
                    <img
                      className="w-full h-full object-cover"
                      src="https://miro.medium.com/v2/resize:fit:1200/1*2Yt3-zcGKc6MYuXCxgCL0A.jpeg"
                      alt=""
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-0 md:mb-1">
                      <h3 className="text-base md:text-lg font-bold group-hover:text-blue-600 transition-colors">
                        MAANG Preparation
                      </h3>
                      <FaArrowRight className="text-zinc-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-xl">
                      Master Data Structures & Algorithms. The standard path for
                      top-tier tech interviews.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Job Prep Track Card - Horizontal Layout */}
              <Link to="/job-preparation" className="group block">
                <div className="bg-white rounded-xl border border-zinc-200 p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 hover:border-zinc-400 hover:shadow-md transition-all duration-200">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl border border-emerald-100">
                    <FaBriefcase />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-0 md:mb-1">
                      <h3 className="text-base md:text-lg font-bold group-hover:text-emerald-600 transition-colors">
                        Role-Based Prep
                      </h3>
                      <FaArrowRight className="text-zinc-300 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-xl">
                      Targeted preparation for specific roles (Frontend,
                      Backend, DevOps).
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
