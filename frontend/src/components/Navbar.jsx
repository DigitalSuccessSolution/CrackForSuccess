import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  // Enhanced Nav Structure
  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "CSE",
      path: "/dashboard",
      type: "dropdown", // Mark as dropdown
      subItems: [
        { name: "MAANG Preparation", path: "/cse/maang" },
        { name: "Job Based Prep", path: "/job-preparation" },
      ],
    },
    { name: "ME", path: "/mechanical" },
    { name: "EE", path: "/ee" },
    { name: "Placements", path: "/#placements" },
    { name: "About Us", path: "/#about" },
  ];

  // Mobile Dropdown State
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600";
    }
    return location.pathname.startsWith(path)
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";
  };

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
  };

  const isLandingPage = location.pathname === "/";

  return (
    <nav
      className={`${
        isLandingPage
          ? "absolute top-0 left-0 w-full bg-transparent"
          : "sticky top-0 bg-white shadow-md"
      } z-50 transition-all duration-300`}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="PlacementPlatform"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.type === "dropdown") {
                return (
                  <div key={link.name} className="relative group">
                    <button
                      className={`flex items-center gap-1 font-medium transition-colors duration-200 ${
                        location.pathname.includes(link.path) ||
                        location.pathname.includes("/cse") ||
                        location.pathname.includes("/job-preparation") // heuristic for active
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                      <svg
                        className="w-4 h-4 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Desktop Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                      <div className="p-2 space-y-1">
                        {link.subItems.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${isActive(link.path)} font-medium transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-6 pl-6 ">
                <div className="flex items-center gap-4">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === "/admin"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-bold text-gray-900 leading-none mb-0.5">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-800 lowercase">
                      {user.email}
                    </div>
                  </div>
                  <FaUserCircle size={32} className="text-gray-600" />
                </div>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-blue-950 text-white font-medium hover:bg-blue-900 transition-all transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          {navLinks.map((link) => {
            if (link.type === "dropdown") {
              return (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => toggleMobileDropdown(link.name)}
                    className="flex items-center justify-between w-full text-left font-medium px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    {link.name}
                    <svg
                      className={`w-4 h-4 transition-transform ${activeMobileDropdown === link.name ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {activeMobileDropdown === link.name && (
                    <div className="pl-6 space-y-2 border-l-2 border-gray-100 ml-4">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block text-base font-medium px-4 py-2 md:py-3 rounded-lg hover:bg-gray-50 ${isActive(link.path)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="border-t border-gray-100 pt-6 mt-4 space-y-4">
            {user ? (
              <div className="px-2">
                <div className="flex items-center gap-3 mb-6 p-2 rounded-lg bg-gray-50">
                  <FaUserCircle size={40} className="text-gray-400" />
                  <div>
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 font-medium lowercase tracking-wide">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block w-full text-center px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2.5 mt-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-md shadow-red-500/20 transition-all active:scale-[0.98]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-2">
                <Link
                  to="/login"
                  className="text-center w-full py-2.5 rounded-lg bg-blue-950 text-white font-medium hover:bg-blue-900 shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
