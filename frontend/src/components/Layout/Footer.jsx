import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full relative pt-20 pb-10 px-6 border-t border-gray-200 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gray-50 pointer-events-none z-[-1]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <span>
              <img className="h-13 mb-2" src="/logo.png" alt="Crack4Success" />
            </span>
            <p className="text-gray-600 leading-relaxed text-sm">
              Empowering the next generation of tech leaders with industry-ready
              skills and world-class placement support.
            </p>
            <div className="flex items-center gap-4">
              {/* <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" /> */}
              <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/crack_4_success?igsh=MWlqanpqcmo1M2w0cQ%3D%3D&utm_source=qr" />
              <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/ann-psi-9b92403b0?utm_source=share_via&utm_content=profile&utm_medium=member_ios" />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Subjects</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <FooterLink to="/cse/maang">Computer Science (CSE)</FooterLink>
              <FooterLink to="/mechanical">Mechanical Engineering</FooterLink>
              <FooterLink to="/ee">Electrical (EE)</FooterLink>
            </ul>
          </div>

          {/* Job Preparation */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">
              Job Preparation
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <FooterLink to="/job-preparation">CSE Interview Prep</FooterLink>
              <FooterLink to="/mechanical-job-preparation">
                Mechanical Interview Prep
              </FooterLink>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="font-medium text-gray-900">Email:</span>
                <a
                  href="mailto:support@crack4success.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  crack4success@gmail.com
                </a>
              </li>
              {/* <li className="flex items-start gap-3">
                <span className="font-medium text-gray-900">Phone:</span>
                <span>+91 98765 43210</span>
              </li> */}
              <li className="flex items-start gap-3">
                <span className="font-medium text-gray-900">Address:</span>
                <span>India (Remote)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Crack4Success. All rights
            reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link
              to="/privacy-policy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookie-policy"
              className="hover:text-gray-900 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ children, to }) => (
  <li>
    <Link
      to={to || "#"}
      className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
    >
      <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </Link>
  </li>
);

export default Footer;
