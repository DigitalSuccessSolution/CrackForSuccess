import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import {
  FaLock,
  FaCheckCircle,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
} from "react-icons/fa";
import PremiumModal from "../components/PremiumModal";
import LoginModal from "../components/LoginModal";
import useFreeLimit from "../hooks/useFreeLimit";
import { TableSkeleton } from "../components/SkeletonLoader";
import QuestionTable from "../components/QuestionTable";

const QuestionList = () => {
  const { section = "cse", categoryId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // Fetch category name ideally
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Use Custom Hook for Limit Logic
  // storageScope: section (e.g., 'cse')
  // authScope: section (defaults to correct casing in hook if string) OR we pass upper.
  const { attemptedQuestions, canAccess, recordAttempt, isPremium } =
    useFreeLimit(section, section ? section.toUpperCase() : "CSE");

  // Removed redundant local isPremium calculation

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch Questions
        console.log("Fetching questions for cat:", categoryId);
        const { data } = await api.get(`/admin/question/${categoryId}`);
        console.log("Questions fetched:", data);
        setQuestions(data);

        // Fetch Category Name (Optional, could pass state from previous page)
        // For now, let's just title it generic or try to find it
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  const handleLockClick = (e) => {
    e.preventDefault();
    setShowPremiumModal(true);
  };

  const handleQuestionAttempt = (questionId) => {
    if (recordAttempt(questionId)) {
      navigate(`/${section}/question/${questionId}`);
    } else {
      setShowPremiumModal(true);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await api.delete(`/admin/question/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete question");
    }
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
      if (difficultyFilter !== "All") return 0; // No need to sort if filtered by one difficulty
      return (
        (difficultyOrder[a.difficulty] || 4) -
        (difficultyOrder[b.difficulty] || 4)
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <TableSkeleton rows={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to={`/${section}/maang`}
              className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-block"
            >
              ← Back to Topics
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
            <p className="text-gray-600 mt-1">
              Practice problems for this topic
            </p>
          </div>

          {!isPremium && user && (
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Free Questions Used:{" "}
              </span>
              <span
                className={`text-sm font-bold ${attemptedQuestions.length >= 3 ? "text-red-600" : "text-blue-600"}`}
              >
                {attemptedQuestions.length}/3
              </span>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-2 md:p-4 rounded-xl border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
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
          loading={loading}
          attemptedQuestions={attemptedQuestions}
          isPremium={isPremium}
          user={user}
          handleQuestionAttempt={handleQuestionAttempt}
          handleLockClick={handleLockClick}
          handleDeleteQuestion={handleDeleteQuestion}
        />
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

export default QuestionList;
