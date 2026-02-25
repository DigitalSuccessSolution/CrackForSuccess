import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on home page and admin login
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup"
  ) {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-6 left-6 z-50 p-3 bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all duration-200 group"
      aria-label="Go Back"
    >
      <FaArrowLeft
        size={20}
        className="text-gray-600 group-hover:text-blue-600 transition-colors"
      />
    </button>
  );
};

export default BackButton;
