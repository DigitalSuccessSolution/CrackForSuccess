import { motion, AnimatePresence } from "framer-motion";
import { FaSignInAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSignInAlt className="text-blue-600 text-3xl" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600 mb-8">
                You need to log in to access and solve questions.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="block w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transform transition-all hover:-translate-y-0.5"
                >
                  Login Now
                </button>
                <button
                  onClick={onClose}
                  className="block w-full py-3 px-4 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
