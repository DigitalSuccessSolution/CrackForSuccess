import { CodingProblemSkeleton } from "../components/SkeletonLoader";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import useFreeLimit from "../hooks/useFreeLimit"; // Added import
import PremiumModal from "../components/PremiumModal"; // Added import

import {
  FaCheckCircle,
  FaExternalLinkAlt,
  FaTags,
  FaBuilding,
  FaLightbulb,
  FaChevronLeft,
  FaChevronRight,
  FaRandom,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaLock, // Added lock icon
} from "react-icons/fa";

const QuestionDetail = () => {
  const { section = "cse", questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false); // Added state

  // Enforce Limit for the current section
  const { canAccess, recordAttempt, limitReached, isPremium } = useFreeLimit(
    section,
    section.toUpperCase(),
  );

  // Navigation State
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isListOpen, setIsListOpen] = useState(false);
  const listRef = useRef(null);

  // 1. Fetch Question Detail
  useEffect(() => {
    const fetchQuestion = async () => {
      // Enforce access check immediately
      if (!loading && !canAccess(questionId)) {
        setShowPremiumModal(true);
        // Optional: redirect after some time or just blur content?
        // For now we will show modal and maybe restrict content visibility
        // But let's let it load so we can show the "Locked" state if we want,
        // OR just block.
        // If I return here, loading stays true forever.
      }

      try {
        const { data } = await api.get(`/admin/question/detail/${questionId}`);
        setQuestion(data);

        if (
          user &&
          user.sections?.[section.toUpperCase()]?.solvedQuestions?.includes(
            questionId,
          )
        ) {
          setIsSolved(true);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId, user]);

  // Effect to check access when not loading
  useEffect(() => {
    if (!loading && question) {
      if (!canAccess(questionId)) {
        setShowPremiumModal(true);
      } else {
        // Record attempt if accessed successfully
        recordAttempt(questionId);
      }
    }
  }, [loading, questionId, question]);

  // 2. Fetch Question List for Navigation (Once)
  useEffect(() => {
    const fetchList = async () => {
      if (!question || questionList.length > 0) return;
      try {
        const { data } = await api.get(`/admin/question/${question.category}`);
        setQuestionList(data);
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };
    fetchList();
  }, [question, questionList.length]);

  // 3. Update Index when list or questionId changes, and close drawer
  useEffect(() => {
    if (questionList.length > 0) {
      const idx = questionList.findIndex((q) => q._id === questionId);
      setCurrentIndex(idx);
      // Don't auto-close list on first load, only on navigation?
      // Better UX: Close list when navigating TO a question from the list
    }
  }, [questionList, questionId]);

  // Click outside to close drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setIsListOpen(false);
      }
    }
    if (isListOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isListOpen]);

  const handleMarkSolved = async () => {
    try {
      await api.post("/track/solve", {
        section: section.toUpperCase(),
        questionId,
      });
      setIsSolved(true);
    } catch (error) {
      console.error("Marking solved failed", error);
    }
  };

  const goToNext = () => {
    if (currentIndex !== -1 && currentIndex < questionList.length - 1) {
      navigate(`/${section}/question/${questionList[currentIndex + 1]._id}`);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      navigate(`/${section}/question/${questionList[currentIndex - 1]._id}`);
    }
  };

  const goToRandom = () => {
    if (questionList.length > 0) {
      const randIdx = Math.floor(Math.random() * questionList.length);
      navigate(`/${section}/question/${questionList[randIdx]._id}`);
    }
  };

  if (loading) return <CodingProblemSkeleton />;

  if (!question)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Problem not found.
      </div>
    );

  const difficultyColor =
    question.difficulty === "Easy"
      ? "text-green-600 bg-green-50 border-green-100"
      : question.difficulty === "Medium"
        ? "text-yellow-600 bg-yellow-50 border-yellow-100"
        : "text-red-600 bg-red-50 border-red-100";

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800">
      {/* Global Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <Link
            to={`/${section}/maang`}
            // In a real app, this should be dynamic based on where they came from,
            // but for now hardcoding to CSE MAANG is the safest fallback or using navigate(-1)
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 mr-2 transition-colors"
            title="Back"
          >
            <FaArrowLeft />
          </Link>

          {/* Nav Group */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1 gap-1 border border-gray-100">
            <button
              onClick={goToPrev}
              disabled={currentIndex <= 0}
              className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${currentIndex <= 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600"}`}
              title="Previous Question"
            >
              <FaChevronLeft size={12} />
            </button>

            <button
              onClick={() => setIsListOpen(!isListOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white hover:shadow-sm text-sm font-medium text-gray-700 transition-all select-none"
            >
              <FaBars size={12} className="text-gray-500" />
              Problem List
            </button>

            <button
              onClick={goToNext}
              disabled={
                currentIndex === -1 || currentIndex >= questionList.length - 1
              }
              className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${currentIndex === -1 || currentIndex >= questionList.length - 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600"}`}
              title="Next Question"
            >
              <FaChevronRight size={12} />
            </button>

            <div className="w-px h-4 bg-gray-200 mx-1"></div>

            <button
              onClick={goToRandom}
              className="p-2 rounded hover:bg-white hover:shadow-sm text-gray-600 transition-all"
              title="Random Question"
            >
              <FaRandom size={12} />
            </button>
          </div>
        </div>

        {/* User Info / Right Side (Optional) */}
        <div className="flex items-center gap-4">
          {/* Can add user profile icon or home link here if needed */}
          <Link
            to="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Dashboard
          </Link>
        </div>

        {/* Problem List Drawer/Dropdown */}
        {isListOpen && (
          <div
            ref={listRef}
            className="absolute top-16 left-4 w-[90vw] md:w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Question List</h3>
              <button
                onClick={() => setIsListOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
              {questionList.map((q, idx) => {
                const isCurrent = q._id === questionId;
                const isQSolved = user?.sections?.[
                  section.toUpperCase()
                ]?.solvedQuestions?.includes(q._id); // Re-check solved status for list items

                return (
                  <div
                    key={q._id}
                    onClick={() => {
                      navigate(`/${section}/question/${q._id}`);
                      setIsListOpen(false);
                    }}
                    className={`
                                    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1
                                    ${isCurrent ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"}
                                `}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {isQSolved ? (
                        <FaCheckCircle
                          className="text-green-500 shrink-0"
                          size={14}
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0"></div>
                      )}
                      <span
                        className={`text-sm truncate ${isCurrent ? "font-semibold text-blue-700" : "text-gray-700"}`}
                      >
                        {idx + 1}. {q.title}
                      </span>
                    </div>
                    <span
                      className={`
                                    text-[10px] px-2 py-0.5 rounded-full font-medium
                                    ${q.difficulty === "Easy" ? "bg-green-100 text-green-700" : q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}
                                `}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Split View */}
      <div className="flex flex-1 flex-col md:flex-row overflow-y-auto md:overflow-hidden p-2 md:p-4 gap-4 max-w-[1920px] mx-auto w-full">
        {/* Left Panel - Problem Content */}
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden relative shrink-0 md:shrink">
          {/* No Tabs - Direct Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {currentIndex !== -1 ? `${currentIndex + 1}. ` : ""}{" "}
              {question.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${difficultyColor}`}
              >
                {question.difficulty}
              </span>

              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100 border border-gray-200 transition-colors">
                <FaTags size={10} /> Topics
              </span>

              {question.companies && question.companies.length > 0 && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100 border border-gray-200 group relative transition-colors">
                  <FaBuilding size={10} /> Companies
                  <span className="absolute left-0 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {question.companies.join(", ")}
                  </span>
                </span>
              )}
            </div>

            <div className="prose max-w-none prose-slate prose-p:text-sm prose-p:leading-6">
              {/* Description Text */}
              <div className="text-gray-800 mb-8 whitespace-pre-line leading-7 text-base">
                {question.problemStatement}
              </div>

              {/* Examples */}
              {question.examples && question.examples.length > 0 && (
                <div className="mb-8 space-y-6">
                  {question.examples.map((ex, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-bold text-gray-900 mb-3">
                        Example {i + 1}:
                      </h3>
                      <div className="pl-4 border-l-[3px] border-gray-300 bg-gray-50/50 py-3 pr-3 rounded-r-lg">
                        <div className="flex gap-3 mb-1">
                          <span className="font-bold text-gray-700 shrink-0 w-20 text-xs uppercase tracking-wide">
                            Input:
                          </span>
                          <span className="text-gray-800 font-mono text-sm break-all bg-white px-1.5 rounded border border-gray-200 inline-block">
                            {ex.input}
                          </span>
                        </div>
                        <div className="flex gap-3 mb-1">
                          <span className="font-bold text-gray-700 shrink-0 w-20 text-xs uppercase tracking-wide">
                            Output:
                          </span>
                          <span className="text-gray-800 font-mono text-sm break-all bg-white px-1.5 rounded border border-gray-200 inline-block">
                            {ex.output}
                          </span>
                        </div>
                        {ex.explanation && (
                          <div className="flex gap-3">
                            <span className="font-bold text-gray-700 shrink-0 w-20 text-xs uppercase tracking-wide">
                              Explain:
                            </span>
                            <span className="text-gray-600 text-sm break-words flex-1">
                              {ex.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {question.constraints && question.constraints.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Constraints:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 marker:text-gray-400">
                    {question.constraints.map((c, i) => (
                      <li key={i} className="pl-1">
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs border border-gray-200">
                          {c}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="flex w-full md:w-2/5 lg:w-1/3 flex-col bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden shrink-0 md:shrink">
          {/* Code Editor Header Placeholder */}
          <div className="flex items-center gap-1 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-mono font-bold uppercase tracking-wide">
            <span>Code Solution</span>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-gray-50/30">
            <div className="max-w-sm w-full space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <FaExternalLinkAlt
                  size={24}
                  className="mx-auto text-blue-500 mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Solve on the Problem.
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Open the environment to run and test your code against all
                  test cases.
                </p>

                <a
                  href={question.leetcodeUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#282828] hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 mb-4"
                >
                  Go to Question
                </a>

                <div className="relative my-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-xs text-gray-400 uppercase tracking-wider">
                      Then
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleMarkSolved}
                  disabled={isSolved}
                  className={`
                                w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center border-2
                                ${
                                  isSolved
                                    ? "bg-green-50 text-green-700 border-green-200 cursor-default"
                                    : "bg-white border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600"
                                }
                            `}
                >
                  {isSolved ? (
                    <>
                      {" "}
                      <FaCheckCircle className="mr-2" /> Solved{" "}
                    </>
                  ) : (
                    "Mark as Solved"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal for Limit Reached */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => {
          setShowPremiumModal(false);
          navigate(`/${section}/maang`); // Redirect back to list on close if they were blocked
        }}
      />
    </div>
  );
};

export default QuestionDetail;
