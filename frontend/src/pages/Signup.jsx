import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[550px]"
      >
        {/* Left Side - Image & Branding */}
        <div className="hidden md:flex w-1/2 relative bg-gray-900 overflow-hidden items-end">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="relative z-10 p-10 text-white">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Start Your Journey
            </h1>
            <p className="text-gray-200 text-sm leading-relaxed">
              "The only way to do great work is to love what you do."
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create Account
            </h2>
            <p className="text-xs text-gray-500">
              Join our community of learners today
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 text-red-600 p-2 rounded-lg mb-4 text-xs border border-red-100 flex items-center"
            >
              <span className="mr-2">⚠️</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-200 text-sm"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-200 text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-200 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Signing Up...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
