import React from "react";
import { CheckCircle2, Send, Users, ShieldCheck } from "lucide-react";

// Feature List Data
const features = [
  {
    title: "Expert Mentorship",
    description:
      "Learn directly from industry veterans and tech leaders who guide you at every step of your journey.",
    icon: <Users className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Industry-Relevant Skills",
    description:
      "Our curriculum is constantly updated to match the latest trends and demands of the tech world.",
    icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Guaranteed Support",
    description:
      "We stand by you with placement assistance, resume reviews, and interview prep until you land your job.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
  },
];

const AboutSection = () => {
  return (
    <section className="py-10 md:py-24 px-6 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Side: Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-[10px] md:text-xs tracking-wider uppercase mb-0 md:mb-4">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                About Crack4Success
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                Crack4Success bridges the gap between learning and hiring. We
                empower job seekers across CS, Mechanical, and Electrical fields
                with real interview questions from top companies. Our platform
                offers a smart, focused path from preparation to placement.
              </p>
            </div>

            {/* Vision and Mission */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    To be the most trusted global interview prep platform,
                    giving every student the tools and confidence to achieve
                    their dream career.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    To transform interview prep with relevant, company-specific
                    content that helps learners save time, build confidence, and
                    secure their future faster.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Simple Image */}
          <div className="relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />

            <div className="relative rounded-2xl overflow-hidden ">
              <img
                src="/about.png"
                alt="Team collaborating"
                className="w-full h-auto object-cover "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
