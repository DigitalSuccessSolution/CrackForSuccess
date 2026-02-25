import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Code, Cpu, Settings } from "lucide-react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToCourses = () => {
    const section = document.getElementById("explore-courses");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 pb-12 flex flex-col justify-start relative overflow-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 lg:pt-0">
        {" "}
        {/* added pt-20 for mobile spacing if needed, lg:pt-0 allows top align */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {" "}
          {/* Removed items-center from grid */}
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-start text-left z-10 lg:self-center lg:py-20" /* Added relative and self-center */
          >
            {/* Decorative Gradient Blur Removed from here */}
            <h1 className="text-5xl md:text-7xl mt-10 md:mt-20 font-bold text-[#091E42] leading-[1.1] mb-3 md:mb-5  tracking-tight">
              Crack Today. Get Hired Tomorrow.
            </h1>

            <p className="text-base text-slate-500 mb-10 max-w-lg leading-relaxed">
              AI is changing the job market — we train you with real interview
              questions and in-demand skills across{" "}
              <b>CSE, Mechanical, Electrical,</b> and more so you stay ahead and
              get hired with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-8">
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500%] h-[500%] bg-gradient-to-tr from-blue-200/50 via-sky-200/50 to-cyan-200/50 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
                <button
                  onClick={scrollToCourses}
                  className="px-9 py-4 bg-[#FF7426] hover:bg-[#e05d15] text-white font-semibold rounded-full shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 flex items-center gap-2 relative z-10"
                >
                  Get Job Ready
                  <div className="bg-white/20 rounded-full p-1 ml-1">
                    <ArrowRight size={16} />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
          {/* Right Content - Image (Made Taller/Larger) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end h-full min-h-[500px] lg:min-h-[600px] items-start " /* Changed items-center to items-start. Added pt adjustment */
          >
            {/* Decorative blob behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

            <img
              src="/hero.png"
              alt="Learning Platform"
              className="relative z-10 w-full max-w-xl lg:max-w-2xl  object-contain  "
            />
          </motion.div>
        </div>
        {/* Course Cards Section (Restored) */}
        <motion.div
          id="explore-courses"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <CourseCard
            title="CSE"
            description="Computer Science Engineering. Master algorithms, software development, and AI."
            icon={<Code size={24} />}
            accentColor="yellow"
            buttonText="Start Coding"
            link="/dashboard"
          />
          <CourseCard
            title="Mechanical"
            description="Mechanical Engineering. Design, analyze, and manufacture mechanical systems."
            icon={<Settings size={24} />}
            accentColor="purple"
            buttonText="Build Machines"
            link="/mechanical"
          />
          <CourseCard
            title="Electrical"
            description="Electrical & Communication. Dive into circuits, signals, and embedded systems."
            icon={<Cpu size={24} />}
            accentColor="cyan"
            buttonText="Explore Circuits"
            link="/ee"
          />
        </motion.div>
      </div>
    </section>
  );
};

const CourseCard = ({
  title,
  description,
  icon,
  accentColor,
  buttonText,
  link,
}) => {
  const navigate = useNavigate();

  const colorMap = {
    blue: {
      border: "from-blue-600",
      glow: "from-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      btnHover: "hover:border-blue-600/50",
    },
    purple: {
      border: "from-purple-600",
      glow: "from-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      btnHover: "hover:border-purple-600/50",
    },
    emerald: {
      border: "from-orange-600",
      glow: "from-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      btnHover: "hover:border-orange-600/50",
    },
    yellow: {
      border: "from-yellow-500", // Yellow-600 looks brownish, sticking to 500 for border but darker text
      glow: "from-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
      btnHover: "hover:border-yellow-600/50",
    },
    cyan: {
      border: "from-cyan-600",
      glow: "from-cyan-200",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
      btnHover: "hover:border-cyan-600/50",
    },
  };

  const theme = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="relative group rounded-2xl md:rounded-3xl p-[1px] overflow-hidden">
      {/* The Top-Left Border Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.border} via-gray-100 to-gray-300 opacity-100 transition-opacity duration-300`}
      />

      {/* Inner Card Content */}
      <div className="relative h-full w-full rounded-2xl md:rounded-[23px] bg-white p-6 md:p-8 overflow-hidden flex flex-col justify-between shadow-xl">
        {/* Top-Left Glow Spot */}
        <div
          className={`absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-gradient-to-br ${theme.glow} to-transparent blur-[20px] opacity-100 pointer-events-none group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`relative z-10 mb-4 p-3 w-fit rounded-2xl ${theme.iconBg} ${theme.iconColor} border border-${theme.border}`}
          >
            {icon}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed text-sm font-medium">
            {description}
          </p>
        </div>
        <button
          onClick={() => link && navigate(link)}
          className={`relative z-10 w-fit flex items-center gap-2 px-4 py-2 bg-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-300 ${theme.btnHover} hover:bg-gray-100 transition-all duration-300 group/btn cursor-pointer shadow-sm`}
        >
          {buttonText}
          <ArrowRight
            size={14}
            className="group-hover/btn:translate-x-1  transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
