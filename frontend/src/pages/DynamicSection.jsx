import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PremiumModal from "../components/PremiumModal";
import LoginModal from "../components/LoginModal";
import {
  FaArrowLeft,
  FaFilter,
  FaLock,
  FaSearch,
  FaBolt,
  FaCrown,
  FaCheckCircle,
  FaLayerGroup,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useFreeLimit from "../hooks/useFreeLimit";
import { Skeleton } from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import { ChartPie } from "lucide-react";
import QuestionTable from "../components/QuestionTable";

const DynamicSection = ({ department }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // Map internal department key to user-visible display name
  const displayDepartment = department === "ECE" ? "EE" : department;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalSolved: 0,
    remaining: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Use Custom Hook for Limit Logic
  const {
    isPremium,
    limitReached,
    attemptedQuestions,
    canAccess,
    recordAttempt,
  } = useFreeLimit(department, department);

  const freeLimitMax = 3;
  const freeLimitUsed = attemptedQuestions.length;

  useEffect(() => {
    fetchCategories();
  }, [department]);

  useEffect(() => {
    if (categories.length > 0) {
      if (!selectedCategory) {
        setSelectedCategory(categories[0]._id);
      }
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  // Fetch stats when category or user changes
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setStats({ totalQuestions: 0, totalSolved: 0, remaining: 0 });
        return;
      }
      setLoadingStats(true);
      try {
        const catParam = selectedCategory || "all";
        const { data } = await api.get(
          `/job/track/stats?categoryId=${catParam}&department=${department}`,
        );
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [selectedCategory, user, department]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/job/category?department=${department}`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const { data } = await api.get(`/job/question/list/${selectedCategory}`);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions", error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleQuestionClick = (qId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    let path = `/job-preparation/question/${qId}`;
    if (department === "ECE") {
      path = `/ee/question/${qId}`;
    } else if (department === "Mechanical") {
      path = `/mechanical-job-preparation/question/${qId}`;
    }

    if (recordAttempt(qId)) {
      navigate(path);
    } else {
      setShowPremiumModal(true);
    }
  };

  // Filter Logic
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

  const filteredQuestions = questions
    .filter((q) => {
      const matchesSearch = q.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "All" || q.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (difficultyFilter !== "All") return 0;
      return (
        (difficultyOrder[a.difficulty] || 4) -
        (difficultyOrder[b.difficulty] || 4)
      );
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-3 md:mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" size={12} />
          Back to Home
        </Link>
      </div>

      {/* Top Banner Image */}
      <div className="max-w-7xl mx-auto w-full h-28 md:h-80 rounded-2xl overflow-hidden mb-6 md:mb-8 relative">
        <img
          src={
            department === "Mechanical"
              ? "/me.png"
              : department === "ECE"
                ? "/ee.png"
                : department === "CSE"
                  ? "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
          }
          alt={`${department} Banner`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ====== MAIN LAYOUT: Sidebar + Content ====== */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* ===== LEFT SIDEBAR ===== */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          {/* FREE LIMIT / STATUS CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
            <h3 className="hidden md:flex text-lg font-bold text-gray-900 mb-3 md:mb-4 items-center gap-2">
              <ChartPie
                className={isPremium ? "text-yellow-500" : "text-gray-400"}
              />
              {displayDepartment} Status
            </h3>

            {!user ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-2">
                  Login to track your progress
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </div>
            ) : isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-700 font-bold mb-1">
                  <FaCheckCircle /> Premium Active
                </div>
                <p className="text-xs text-yellow-600">
                  Unlimited access enabled.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  boxShadow: [
                    "0px 0px 0px rgba(251, 191, 36, 0)",
                    "0px 0px 20px rgba(251, 191, 36, 0.3)",
                    "0px 0px 0px rgba(251, 191, 36, 0)",
                  ],
                }}
                transition={{
                  scale: { duration: 0.5 },
                  boxShadow: { duration: 2, repeat: Infinity },
                }}
                className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-2 border-amber-300 p-5 rounded-2xl relative overflow-hidden mt-2"
              >
                {/* Decorative Crown */}
                <div className="absolute -top-4 -right-4 text-amber-500/10 transform rotate-12">
                  <FaCrown size={120} />
                </div>
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
                      <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-sm">
                        <FaBolt size={14} />
                      </div>
                      FREE LIMIT
                    </div>
                    <div className="bg-white/80 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-800">
                      {Math.min(freeLimitUsed, freeLimitMax)} / {freeLimitMax}{" "}
                      Left
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold text-amber-800/70 mb-1.5">
                      <span>Daily Progress</span>
                      <span>
                        {Math.round(
                          Math.min((freeLimitUsed / freeLimitMax) * 100, 100),
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-3.5 p-[2px] shadow-inner border border-amber-200/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((freeLimitUsed / freeLimitMax) * 100, 100)}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full shadow-sm ${
                          freeLimitUsed >= freeLimitMax
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-amber-400 to-orange-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Status Message */}
                  {freeLimitUsed >= freeLimitMax ? (
                    <div className="bg-red-100/80 border border-red-200 rounded-lg p-2 mb-4 flex items-start gap-2">
                      <FaLock className="text-red-500 mt-0.5" size={12} />
                      <p className="text-xs text-red-700 font-bold leading-tight">
                        Limit reached. Upgrade to continue practicing.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-900/80 font-medium mb-4 text-center">
                      You have{" "}
                      <span className="font-bold text-amber-700">
                        {freeLimitMax - freeLimitUsed} free questions
                      </span>{" "}
                      remaining today.
                    </p>
                  )}

                  {/* Upgrade Button */}
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="group relative w-full overflow-hidden rounded-xl bg-gray-900 py-3 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <FaCrown
                        className="text-amber-400 animate-pulse"
                        size={16}
                      />
                      <span className="font-bold text-white tracking-wide">
                        UPGRADE NOW
                      </span>
                      <FaArrowLeft
                        className="rotate-180 text-amber-400 transition-transform group-hover:translate-x-1"
                        size={12}
                      />
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* TOPICS SIDEBAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-6 sticky top-24 z-10 overflow-hidden">
            <div className="hidden md:flex items-center justify-between mb-2 md:mb-4">
              <h2 className="text-lg font-bold text-gray-900">Topics</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {categories.length}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-1 md:pb-0 no-scrollbar snap-x snap-mandatory">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === cat._id
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-gray-100 md:ring-0"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}

                {categories.length === 0 && (
                  <p className="text-sm text-gray-400 px-4 py-2">
                    No topics found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT CONTENT ===== */}
        <div className="w-full lg:w-3/4">
          {/* Header */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {displayDepartment} Interview Questions
            </h1>
            <p className="text-sm text-gray-500">
              Practice the most frequently asked questions to crack your
              interview.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 mb-4 md:mb-6 flex flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <FaFilter className="text-gray-400" />
              <span className="text-sm text-gray-600 font-medium hidden md:block">
                Difficulty:
              </span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Stats Bar — Total / Solved / Left */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 no-scrollbar pb-1 md:pb-0">
            {loadingStats ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse min-w-[100px] md:min-w-0"
                  />
                ))}
              </>
            ) : (
              <>
                <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0">
                  <div>
                    <p className="text-[9px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">
                      Total
                    </p>
                    <p className="text-base md:text-xl font-bold text-gray-900 leading-tight">
                      {stats.totalQuestions}
                    </p>
                  </div>
                  <div className="hidden md:block p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FaLayerGroup />
                  </div>
                </div>
                <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0">
                  <div>
                    <p className="text-[9px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">
                      Solved
                    </p>
                    <p className="text-base md:text-xl font-bold text-green-600 leading-tight">
                      {stats.totalSolved}
                    </p>
                  </div>
                  <div className="hidden md:block p-3 bg-green-50 text-green-600 rounded-lg">
                    <FaCheckCircle />
                  </div>
                </div>
                <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0">
                  <div>
                    <p className="text-[9px] md:text-xs text-gray-500 uppercase font-bold tracking-wider">
                      Left
                    </p>
                    <p className="text-base md:text-xl font-bold text-orange-600 leading-tight">
                      {stats.remaining}
                    </p>
                  </div>
                  <div className="hidden md:block p-3 bg-orange-50 text-orange-600 rounded-lg">
                    <FaSpinner />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Questions Table — same format as CSE MAANG */}
          <QuestionTable
            questions={filteredQuestions}
            loading={questionsLoading}
            attemptedQuestions={attemptedQuestions}
            isPremium={isPremium}
            user={user}
            handleQuestionAttempt={handleQuestionClick}
            handleLockClick={() => setShowPremiumModal(true)}
            handleDeleteQuestion={() => {}}
          />
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default DynamicSection;
