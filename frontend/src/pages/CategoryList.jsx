import { useState, useEffect, useContext } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import BannerSlider from "../components/BannerSlider";
import QuestionTable from "../components/QuestionTable";
import PremiumModal from "../components/PremiumModal";
import LoginModal from "../components/LoginModal";
import { TabsSkeleton, StatsSkeleton } from "../components/SkeletonLoader";
import {
  FaLayerGroup,
  FaCheckCircle,
  FaSpinner,
  FaLock,
  FaUnlock,
  FaBolt,
  FaArrowLeft,
  FaCircle,
  FaDotCircle,
  FaAllergies,
  FaCrown,
  FaStar,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { LayoutGroup, motion } from "framer-motion";
import { ChartPie } from "lucide-react";

const CategoryList = () => {
  const { user, setUser } = useContext(AuthContext); // Added setUser for instant update
  const navigate = useNavigate();
  const { section = "cse" } = useParams(); // Default to cse if not present (unlikely with route)
  const [searchParams, setSearchParams] = useSearchParams();

  // Mapping URL section (lowercase) to DB Section Key (PascalCase usually)
  const getDbSectionKey = (urlSection) => {
    const map = {
      cse: "CSE",
      ee: "ECE",
      mechanical: "Mechanical",
    };
    return map[urlSection.toLowerCase()] || "CSE";
  };

  const dbSectionKey = getDbSectionKey(section);

  // State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "all",
    name: "All Topics",
  });
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalQuestions: 0,
    remaining: 0,
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Derived state from user context for THIS section
  const usageKey = "cse_maang"; // CategoryList displays Coding Questions (MAANG)
  const solvedQuestions = user?.usage?.[usageKey] || [];
  const isPremium = user?.isPremiumUser || false;

  // Calculate free limit usage
  // If premium, strictly speaking 3/3 doesn't matter, but good to show infinite or checkmark
  const freeLimitUsed = solvedQuestions.length;
  const freeLimitMax = 3;

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/admin/category");
        setCategories(data);

        const catIdFromUrl = searchParams.get("cat");
        if (catIdFromUrl && catIdFromUrl !== "all") {
          const found = data.find((c) => c._id === catIdFromUrl);
          if (found) setSelectedCategory(found);
          else setSelectedCategory({ _id: "all", name: "All Topics" });
        } else {
          setSelectedCategory({ _id: "all", name: "All Topics" });
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Questions AND Stats when Selected Category Changes or User Changes
  useEffect(() => {
    if (!selectedCategory) return;

    // Update URL
    setSearchParams({ cat: selectedCategory._id });

    const fetchData = async () => {
      setLoadingQuestions(true);
      setLoadingStats(true);
      try {
        // A. Fetch Questions
        const endpoint =
          selectedCategory._id === "all"
            ? "/admin/question/all"
            : `/admin/question/${selectedCategory._id}`;

        const questionsRes = await api.get(endpoint);
        setQuestions(questionsRes.data);

        // B. Fetch Stats (Only if user logged in)
        if (user) {
          const statsEndpoint = `/track/stats?categoryId=${selectedCategory._id}&section=${dbSectionKey}`;
          const statsRes = await api.get(statsEndpoint);
          setStats(statsRes.data);
        } else {
          // Reset stats if user logs out
          setStats({ totalSolved: 0, totalQuestions: 0, remaining: 0 });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingQuestions(false);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, [selectedCategory, user, dbSectionKey]); // Refetch if user logs in or section changes

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleQuestionAttempt = async (questionId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // If already solved, just go
    if (solvedQuestions.includes(questionId) || isPremium) {
      navigate(`/${section}/question/${questionId}`);
      return;
    }

    try {
      // Attempt to "unlock/start" the question with CORRECT section
      const { data } = await api.post("/track/solve", {
        section: dbSectionKey,
        questionId,
      });

      // INSTANTLY Update User Context with new usage data
      setUser(data);

      navigate(`/${section}/question/${questionId}`);
    } catch (error) {
      if (error.response?.status === 403) {
        setShowPremiumModal(true);
      } else {
        console.error("Error attempting question:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/question/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete question");
    }
  };

  const handleLockClick = () => {
    if (!user) setShowLoginModal(true);
    else setShowPremiumModal(true);
  };

  // Filter & Sort Logic
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
      <div className="max-w-7xl mx-auto mb-3 md:mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" size={12} />
          Back to Home
        </Link>
      </div>

      {/* 1. Banner Slider */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <BannerSlider />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Left Sidebar - Categories */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          {/* USER STATS / FREE LIMIT CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6">
            <h3 className="hidden md:flex text-lg font-bold text-gray-900 mb-3 md:mb-4 items-center gap-2">
              <ChartPie
                className={isPremium ? "text-yellow-500" : "text-gray-400"}
              />
              {dbSectionKey} Status
            </h3>

            {!user ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500 mb-2">
                  Login to track your progress
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg"
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
                className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-2 border-amber-300 p-5 rounded-2xl relative overflow-hidden mt-4"
              >
                {/* Decorative background element - Crown */}
                <div className="absolute -top-4 -right-4 text-amber-500/10 transform rotate-12">
                  <FaCrown size={120} />
                </div>

                {/* Animated Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
                      <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-sm">
                        <FaBolt size={14} />
                      </div>
                      FREE LIMIT
                    </div>
                    <div className="bg-white/80 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-800 shadow-xs">
                      {Math.min(freeLimitUsed, freeLimitMax)} / {freeLimitMax}{" "}
                      Left
                    </div>
                  </div>

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

                  {freeLimitUsed >= freeLimitMax ? (
                    <div className="bg-red-100/80 border border-red-200 rounded-lg p-2 mb-4 flex items-start gap-2">
                      <FaLock className="text-red-500 mt-0.5" size={12} />
                      <p className="text-xs text-red-700 font-bold leading-tight">
                        Limit reached. Upgrade to continue practicing without
                        interruptions.
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-6 sticky top-24 z-10 overflow-hidden">
            <div className="hidden md:flex items-center justify-between mb-2 md:mb-4">
              <h2 className="text-lg font-bold text-gray-900">Topics</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {categories.length}
              </span>
            </div>

            {loadingCategories ? (
              <TabsSkeleton />
            ) : (
              <div className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-1 md:pb-0 no-scrollbar snap-x snap-mandatory">
                <button
                  onClick={() =>
                    handleCategoryClick({ _id: "all", name: "All Topics" })
                  }
                  className={`flex-shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 md:gap-3 whitespace-nowrap ${
                    selectedCategory._id === "all"
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent md:border-none ring-1 ring-gray-100 md:ring-0"
                  }`}
                >
                  <div
                    className={`hidden md:block p-2 rounded-lg ${
                      selectedCategory._id === "all"
                        ? " text-blue-600"
                        : " text-gray-400 group-hover:bg-white group-hover:text-gray-600"
                    }`}
                  ></div>
                  All Topics
                </button>

                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex-shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 md:gap-3 group whitespace-nowrap ${
                      selectedCategory._id === category._id
                        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent md:border-none ring-1 ring-gray-100 md:ring-0"
                    }`}
                  >
                    <div
                      className={`hidden md:block p-2 rounded-lg transition-colors ${
                        selectedCategory._id === category._id
                          ? " text-blue-600"
                          : " text-gray-400 group-hover:bg-white group-hover:text-gray-600"
                      }`}
                    >
                      {/* Dynamic Icon could be here */}
                      {/* <FaLayerGroup /> */}
                      {/* <FaDotCircle/> */}
                    </div>
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Questions */}
        <div className="w-full lg:w-3/4">
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              {dbSectionKey} / {selectedCategory?.name} Questions
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Master {selectedCategory?.name} with our curated list of problems.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 no-scrollbar snap-x snap-mandatory pb-1 md:pb-0">
            {loadingStats ? (
              <StatsSkeleton count={3} />
            ) : (
              <>
                <div className="bg-white p-2 md:p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0 snap-center">
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
                <div className="bg-white p-2 md:p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0 snap-center">
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
                <div className="bg-white p-2 md:p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center md:items-center md:justify-between text-center md:text-left min-w-[100px] md:min-w-0 snap-center">
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

          {/* Search & Filter Bar */}
          <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 mb-4 md:mb-6 flex flex-row gap-4 items-center justify-between shadow-sm">
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
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <QuestionTable
            questions={filteredQuestions}
            loading={loadingQuestions}
            attemptedQuestions={solvedQuestions}
            isPremium={isPremium}
            user={user}
            handleQuestionAttempt={handleQuestionAttempt}
            handleLockClick={handleLockClick}
            handleDeleteQuestion={handleDeleteQuestion}
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

export default CategoryList;
