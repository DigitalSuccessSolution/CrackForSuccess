import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample images - in a real app these would come from props or API
const images = ["/b1.png", "/b2.png", "/b3.png", "/b4.png", "/b5.png"];

const BannerSlider = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust as needed
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full mb-8 group">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <FaChevronRight />
      </button>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 py-0 md:py-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[250px] md:w-[320px] h-32 md:h-40 rounded-xl overflow-hidden   transition-all duration-300 transform hover:-translate-y-1 snap-start bg-gray-200"
          >
            <img
              src={img}
              alt={`Banner ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
