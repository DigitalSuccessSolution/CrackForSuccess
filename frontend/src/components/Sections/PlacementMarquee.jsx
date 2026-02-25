import React from "react";

const PlacementMarquee = () => {
  // Logo Data - Row 1
  // Logo Data - Row 1
  const row1Logos = [
    { name: "Microsoft", img: "/logo/microsoft.png" },
    { name: "Amazon", img: "/logo/amazon.png" },
    { name: "Meta", img: "/logo/meta.png" },
    { name: "Adobe", img: "/logo/adobe.png" },
    { name: "Salesforce", img: "/logo/salesforce.png" },
    { name: "Atlassian", img: "/logo/atlassian.png" },
  ];

  // Logo Data - Row 2
  const row2Logos = [
    { name: "Airbnb", img: "/logo/airbnb.png" },
    { name: "Flipkart", img: "/logo/flipkart.jpeg" },
    { name: "Oyo", img: "/logo/oyo.png" },
    { name: "Walmart", img: "/logo/walmart.png" },
    { name: "Zoho", img: "/logo/zoho.png" },
    { name: "Zomato", img: "/logo/zomato.png" },
  ];

  return (
    <div className=" bg-white text-black font-sans flex flex-col items-center justify-center overflow-hidden relative">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right {
          animation-play-state: paused;
        }

        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>

      {/* Ambient Background Blur Effects - Removed for global consistency */}
      {/* Decorative Top-Right Gradient Blur */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px]  rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
          
      {/* Content Section */}
      <section className="relative z-10 w-full max-w-7xl px-4 py-10 md:py-20 text-center">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-2 md:mb-6">
            Our Students{" "}
            <span className="bg-gradient-to-r from-blue-900 via-indigo-800 to-pink-900 bg-clip-text text-transparent">
              Placed In
            </span>
          </h2>
          <p className="text-gray-600 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
            Our graduates are building the future at the world's most innovative
            and influential companies.
          </p>
        </div>

        {/* Marquee Row 1 (Moving Left) */}
        <div className="marquee-container relative w-full overflow-hidden py-0 md:py-4 fade-edges">
          <div className="flex whitespace-nowrap animate-scroll-left w-max">
            {/* First group of logos */}
            <div className="flex items-center gap-2 md:gap-12 px-6">
              {row1Logos.map((logo, index) => (
                <LogoCard key={`row1-1-${index}`} data={logo} />
              ))}
            </div>
            {/* Duplicate group for seamless infinite loop */}
            <div className="flex items-center gap-6 md:gap-12 px-6">
              {row1Logos.map((logo, index) => (
                <LogoCard key={`row1-2-${index}`} data={logo} />
              ))}
            </div>
          </div>
        </div>

        {/* Marquee Row 2 (Moving Right) */}
        <div className="marquee-container relative w-full overflow-hidden py-0 md:py-4 mt-0 md:mt-8 fade-edges">
          <div className="flex whitespace-nowrap animate-scroll-right w-max">
            {/* First group of logos */}
            <div className="flex items-center gap-2 md:gap-12 px-6">
              {row2Logos.map((logo, index) => (
                <LogoCard key={`row2-1-${index}`} data={logo} />
              ))}
            </div>
            {/* Duplicate group for seamless infinite loop */}
            <div className="flex items-center gap-2 md:gap-12 px-6">
              {row2Logos.map((logo, index) => (
                <LogoCard key={`row2-2-${index}`} data={logo} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer Text */}
        <div className="mt-8 md:mt-24">
          <div className="inline-flex flex-col items-center">
            <span className="text-gray-500 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              And 200+ Global Partners
            </span>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-component for individual logo cards
const LogoCard = ({ data }) => {
  return (
    <div
      className="
      group relative flex items-center justify-center
      w-auto h-20 md:h-24 px-4
      transition-all duration-300 
      hover:-translate-y-1
      cursor-pointer
    "
    >
      <img
        src={data.img}
        alt={data.name}
        className="h-7 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

export default PlacementMarquee;
