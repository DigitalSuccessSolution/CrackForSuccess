import React from "react";
import { Star, StarHalf } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Harsh Chaudhary",
      role: "Full Stack Developer",
      company: "Google",
      image: "/students/t1.jpeg",
      review:
        "The structured learning path transformed my approach to coding. The placement team didn't just find me a job; they found me a career.",
      rating: 5,
    },
    {
      id: 2,
      name: "Mohit Sharma",
      role: "Data Analyst",
      company: "Capegemini",
      image: "/students/t2.avif",
      review:
        "Absolutely incredible experience. The community support and real-world projects are what set this platform apart from the rest.",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Anjali gupta",
      role: "Php Developer",
      company: "OYO",
      image: "/students/t3.avif",
      review:
        "From basics to advanced architectures, the depth of content is unmatched. I secured my role at Amazon within weeks of finishing.",
      rating: 4,
    },
    {
      id: 4,
      name: "Raghav Singh",
      role: "Product Manager",
      company: "Netflix",
      image: "/students/t4.jpeg",
      review:
        "The networking opportunities alone are worth it. Being surrounded by such talented individuals pushed me to my limits.",
      rating: 5,
    },
    {
      id: 5,
      name: "Aditi Verma",
      role: "Cloud Architect",
      company: "Microsoft",
      image: "/students/t5.avif",
      review:
        "A game-changer for my career transition. The cloud computing module was exceptionally detailed and practical.",
      rating: 3.5,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 text-black py-10 md:py-20 px-6 font-sans relative flex items-center overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-16 items-center">
          {/* LEFT CONTENT SECTION */}
          <div className="w-full lg:w-[35%] space-y-3 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className=" h-1 w-1 md:h-2 md:w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Student Success
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Hear from our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-pink-900">
                Global Alumni
              </span>
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Discover how our graduates transformed their careers and landed
              roles at top-tier tech giants across the globe. Their journey
              starts here, and yours could be next.
            </p>

            {/* <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/thumb/men/${i + 10}.jpg`}
                      className="w-10 h-10 rounded-full border-2 border-black"
                      alt="user"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Joined by <span className="text-black font-bold">10k+</span>{" "}
                  students
                </p>
              </div>
            </div> */}
          </div>

          {/* RIGHT SLIDER SECTION (Marquee - 2 Rows) */}
          <div className="w-full lg:w-[65%] overflow-hidden py-4 px-2 relative flex flex-col gap-6">
            {/* Fade gradients on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50/80 to-transparent z-10 pointer-events-none"></div>

            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                @keyframes marquee-reverse {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
                }
                .animate-marquee {
                  animation: marquee 40s linear infinite;
                }
                .animate-marquee-reverse {
                  animation: marquee-reverse 45s linear infinite;
                }
              `}
            </style>

            {/* Row 1 - Scrolling Left */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials, ...testimonials].map(
                (t, index) => (
                  <div
                    key={`row1-${t.id}-${index}`}
                    className="w-[260px] md:w-[320px] mx-3 flex-shrink-0"
                  >
                    <div className="group relative h-full p-4 md:p-5 rounded-[0.5rem] md:rounded-[1.5rem] bg-white border border-gray-200 shadow-lg flex flex-col justify-between hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1">
                      <div className="relative z-10">
                        {/* Star Rating */}
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            if (t.rating >= starValue) {
                              return (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-600 fill-yellow-500"
                                />
                              );
                            } else if (t.rating >= starValue - 0.5) {
                              return (
                                <div key={i} className="relative w-3 h-3">
                                  <Star className="absolute top-0 left-0 w-3 h-3 text-gray-300" />
                                  <StarHalf className="absolute top-0 left-0 w-3 h-3 text-yellow-600 fill-yellow-500" />
                                </div>
                              );
                            } else {
                              return (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-gray-300"
                                />
                              );
                            }
                          })}
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4 font-medium line-clamp-3">
                          "{t.review}"
                        </p>
                      </div>

                      {/* User Profile */}
                      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                        <div className="relative">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-gray-900 group-hover:text-blue-500 transition-colors">
                            {t.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-gray-500 truncate w-24 md:w-32">
                            {t.role} @ {t.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Row 2 - Scrolling Right (Reverse) */}
            <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials, ...testimonials].map(
                (t, index) => (
                  <div
                    key={`row2-${t.id}-${index}`}
                    className="w-[260px] md:w-[320px] mx-3 flex-shrink-0"
                  >
                    <div className="group relative h-full p-4 md:p-5 rounded-[0.5rem] md:rounded-[1.5rem] bg-white border border-gray-200 shadow-lg flex flex-col justify-between hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1">
                      <div className="relative z-10">
                        {/* Star Rating */}
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            if (t.rating >= starValue) {
                              return (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-600 fill-yellow-500"
                                />
                              );
                            } else if (t.rating >= starValue - 0.5) {
                              return (
                                <div key={i} className="relative w-3 h-3">
                                  <Star className="absolute top-0 left-0 w-3 h-3 text-gray-300" />
                                  <StarHalf className="absolute top-0 left-0 w-3 h-3 text-yellow-600 fill-yellow-500" />
                                </div>
                              );
                            } else {
                              return (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-gray-300"
                                />
                              );
                            }
                          })}
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4 font-medium line-clamp-3">
                          "{t.review}"
                        </p>
                      </div>

                      {/* User Profile */}
                      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                        <div className="relative">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-gray-900 group-hover:text-blue-500 transition-colors">
                            {t.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-gray-500 truncate w-24 md:w-32">
                            {t.role} @ {t.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Custom Progress/Pagination Bar - REMOVED */}
      </div>
    </div>
  );
};

export default Testimonials;
