import { DetailPageSkeleton } from "../../components/SkeletonLoader";
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AuthContext from "../../context/AuthContext";
import useFreeLimit from "../../hooks/useFreeLimit"; // Added import

import {
  FaArrowLeft,
  FaLock,
  FaCrown,
  FaBuilding,
  FaRegClock,
  FaShareAlt,
  FaBookmark,
  FaEye,
  FaCheckCircle,
  FaLightbulb,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const JobQuestionDetail = ({ basePath = "/job-preparation" }) => {
  const { questionId } = useParams();
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Derive keys for limit logic
  const departmentKey = basePath.includes("mechanical")
    ? "Mechanical"
    : basePath.includes("ee")
      ? "ECE"
      : "CSE";
  const storageKey = `job_${departmentKey}`;
  const isPremium = user?.premiumAccess?.[departmentKey] || false;

  const { canAccess, recordAttempt } = useFreeLimit(storageKey, isPremium);

  useEffect(() => {
    fetchQuestion();
    setIsRevealed(false); // Reset reveal state on new question
  }, [questionId]);

  const fetchQuestion = async () => {
    // Client-side limit check
    if (!canAccess(questionId)) {
      setShowPremiumModal(true);
      setLoading(false); // Stop loading locally
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/job/question/${questionId}`);
      setQuestion(data);
      recordAttempt(questionId); // Record successful access
      refreshUser(); // Sync usage limits from backend
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setShowPremiumModal(true);
      } else if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Error loading question");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showPremiumModal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
            <FaLock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Premium Content
          </h2>
          <p className="text-slate-500 mb-6">
            Upgrade to access unlimited premium questions.
          </p>
          <div className="space-y-3">
            <button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <FaCrown size={14} /> Unlock Now
            </button>
            <Link
              to={basePath}
              className="block w-full text-slate-500 font-medium py-2 hover:text-slate-800 transition-colors"
            >
              Maybe Later
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <DetailPageSkeleton />;

  if (error)
    return (
      <div className="min-h-screen bg-white pt-32 text-center">
        <div className="inline-block p-3 rounded-full bg-red-50 text-red-500 mb-4">
          <FaCheckCircle className="rotate-45" size={24} />
        </div>
        <p className="text-slate-600 mb-6 font-medium">{error}</p>
        <button
          onClick={() => navigate(basePath)}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Back to Questions
        </button>
      </div>
    );

  // Calculate dynamic read time (approx 200 words per minute)
  const calculateReadTime = (text) => {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const readTime = question ? calculateReadTime(question.description) : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <FaArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <FaBookmark size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <FaShareAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Stats & Info */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaLightbulb /> Question Info
              </h3>
              <div className="space-y-4">
                {question.categoryId && (
                  <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="text-slate-500 font-medium">Category</span>
                    <span className="font-bold text-slate-800 text-right">
                      {question.categoryId.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-medium">
                    Last Updated
                  </span>
                  <span className="font-bold text-slate-800 text-right">
                    {new Date(question.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Difficulty</span>
                    <span
                      className={`font-bold ${question.difficulty === "Easy" ? "text-emerald-600" : question.difficulty === "Medium" ? "text-amber-600" : "text-rose-600"}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {["Easy", "Medium", "Hard"].map((diff, i) => (
                      <div
                        key={diff}
                        className={`h-1.5 flex-1 rounded-full ${
                          question.difficulty === "Easy" && i === 0
                            ? "bg-emerald-500"
                            : question.difficulty === "Medium" && i <= 1
                              ? "bg-amber-500"
                              : question.difficulty === "Hard"
                                ? "bg-rose-500"
                                : "bg-slate-100"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Center */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {question.difficulty && (
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${
                      question.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : question.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <FaRegClock size={11} /> {readTime} min read
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-6">
                {question.title}
              </h1>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600 prose-img:rounded-lg">
                <ReactMarkdown>
                  {question.description?.replace(/\\n/g, "\n")}
                </ReactMarkdown>
              </div>

              {/* LeetCode Link (Optional) */}
              {question.leetcodeUrl && (
                <div className="mt-8">
                  <a
                    href={question.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#282828] hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1"
                  >
                    Solve the Problem
                    <FaChevronRight size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Answer Section */}
            <div className="mb-12">
              {!isRevealed ? (
                <button
                  onClick={() => setIsRevealed(true)}
                  className="w-full bg-white border-2 border-indigo-50 hover:border-indigo-100 hover:bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all group shadow-sm"
                >
                  <span className="font-semibold underline cursor-pointer text-slate-700">
                    Show Solution
                  </span>
                </button>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" />
                      Optimal Solution
                    </h3>
                    <button
                      onClick={() => setIsRevealed(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="p-8">
                    <div className="prose prose-slate max-w-none text-slate-700 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                      <ReactMarkdown>
                        {question.answer?.replace(/\\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Companies & Promo */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Companies Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaBuilding /> Asked In
              </h3>
              {question.askedIn ? (
                <div className="flex flex-wrap gap-2">
                  {question.askedIn.split(",").map((company, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {company.trim().slice(0, 2)}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {company.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No specific company data available.
                </p>
              )}
            </div>

            {/* Promo Card */}
            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 text-amber-400 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  <FaCrown />
                </div>
                <h3 className="font-bold text-lg mb-1">Go Pro Today</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Unlock 500+ premium interview questions & detailed video
                  solutions.
                </p>
                <button className="text-xs font-bold uppercase tracking-wide bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-12 space-y-16">
          {/* Related Questions (Company) - Carousel */}
          {question.companyQuestions &&
            question.companyQuestions.length > 0 && (
              <div className="relative group/carousel">
                <div className="flex justify-between items-end mb-6 px-1">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-indigo-600 rounded-sm"></span>
                    Questions asked in {question.askedIn?.split(",")[0]}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        document
                          .getElementById("company-carousel")
                          .scrollBy({ left: -350, behavior: "smooth" })
                      }
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() =>
                        document
                          .getElementById("company-carousel")
                          .scrollBy({ left: 350, behavior: "smooth" })
                      }
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                <div
                  id="company-carousel"
                  className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide flex gap-5 snap-x scroll-smooth"
                >
                  {question.companyQuestions.map((q) => (
                    <Link
                      to={`${basePath}/question/${q._id}`}
                      key={q._id}
                      className="min-w-[320px] md:min-w-[360px] bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all snap-start flex flex-col justify-between group h-48"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                              q.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : q.difficulty === "Medium"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          {q.userViews && q.userViews > 10 && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <FaEye /> {q.userViews}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {q.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wide mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        Solve Challenge <FaChevronRight size={10} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* More in Category - Grid */}
          {question.categoryQuestions &&
            question.categoryQuestions.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-slate-900 rounded-sm"></span>
                    More in {question.categoryId.name}
                  </h3>
                  <Link
                    to={`${basePath}/${question.categoryId._id}`}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    View All Questions <FaChevronRight size={12} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {question.categoryQuestions.map((q) => (
                    <Link
                      to={`${basePath}/question/${q._id}`}
                      key={q._id}
                      className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex items-start gap-4 group hover:bg-slate-50/50"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 text-base mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span
                            className={`font-medium px-2 py-0.5 rounded ${
                              q.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-600"
                                : q.difficulty === "Medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          {q.askedIn && (
                            <span className="flex items-center gap-1 truncate text-slate-400">
                              <FaBuilding size={10} /> {q.askedIn}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-300 group-hover:text-indigo-400 self-center">
                        <FaChevronRight size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default JobQuestionDetail;
