import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample banners - replace with your actual marketing assets
const banners = [
  {
    id: 1,
    title: "Cracking the Coding Interview",
    subtitle: "Master the top 100 questions asked in MAANG",
    color: "from-blue-600 to-indigo-700",
    image: "/b1.png", // Fallback to color if image fails or for overlay
  },
  {
    id: 2,
    title: "System Design Primer",
    subtitle: "Learn how to scale applications to millions of users",
    color: "from-purple-600 to-indigo-600",
    image: "/b2.png",
  },
  {
    id: 3,
    title: "Behavioral Interviews",
    subtitle: "Ace the HR round with confidence",
    color: "from-emerald-600 to-teal-600",
    image: "/b3.png",
  },
];

const AutoBannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm group mb-12">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background - using gradient for consistent professional look if image missing/loading */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${banner.color}`}
          ></div>

          {/* Optional: Real Image Overlay with Multiply/Overlay blend mode */}
          {/* <img src={banner.image} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" /> */}

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">
            <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-2 md:mb-4 tracking-tight leading-tight">
              {banner.title}
            </h2>
            <p className="text-sm md:text-xl text-blue-50 font-medium max-w-xl">
              {banner.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <FaChevronLeft size={14} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <FaChevronRight size={14} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoBannerSlider;
