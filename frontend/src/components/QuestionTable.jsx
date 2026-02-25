import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaEdit, FaTrash, FaLock } from "react-icons/fa";
import { TableSkeleton } from "./SkeletonLoader";
import { findCompany } from "../lib/companyLogos";

/* ─── helpers ─────────────────────────────────────────────── */

/** Normalise companies from question object (handles both formats + askedIn) */
const getCompanies = (q) => {
  if (q.companies && q.companies.length > 0) return q.companies;
  if (q.askedIn) {
    return q.askedIn
      .split(",")
      .map((n) => ({ name: n.trim(), logoUrl: "" }))
      .filter((c) => c.name);
  }
  return [];
};

/* ─── CompanyTag ───────────────────────────────────────────── */
/**
 * Shows company logo using a 3-step fallback chain:
 * 1. Admin-uploaded URL (from DB)
 * 2. Clearbit:  https://logo.clearbit.com/{domain}
 * 3. Google:    https://www.google.com/s2/favicons?sz=64&domain={domain}
 * 4. Letter badge (last resort — always visible)
 */
const CompanyTag = ({ c, size = "sm" }) => {
  const name = typeof c === "object" ? c.name : c;
  const adminUrl = typeof c === "object" ? c.logoUrl : "";

  const match = findCompany(name);
  const domain = match?.domain ?? null;

  const sources = [
    adminUrl || null,
    domain ? `https://logo.clearbit.com/${domain}` : null,
    domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null,
  ].filter(Boolean);

  const [idx, setIdx] = useState(0);

  const imgClass = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const current = sources[idx];

  if (current) {
    return (
      <img
        key={current}
        src={current}
        alt={name}
        title={name}
        className={`${imgClass} object-contain rounded`}
        onError={() => setIdx((prev) => prev + 1)}
      />
    );
  }

  /* all sources exhausted → letter badge */
  return (
    <span
      title={name}
      className={`${imgClass} bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0`}
    >
      {name?.[0]?.toUpperCase()}
    </span>
  );
};

/* ─── QuestionTable ────────────────────────────────────────── */
const QuestionTable = ({
  questions,
  loading,
  attemptedQuestions,
  isPremium,
  user,
  handleQuestionAttempt,
  handleLockClick,
  handleDeleteQuestion,
}) => {
  if (loading) return <TableSkeleton rows={8} />;

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
        No questions found for this category.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3 p-3 bg-gray-50/50">
        {questions.map((q) => {
          const hasAttempted = attemptedQuestions.includes(q._id);
          const isLocked =
            !isPremium && attemptedQuestions.length >= 3 && !hasAttempted;

          return (
            <div
              key={q._id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 transition-all duration-200 ${
                isLocked
                  ? "opacity-75 bg-gray-50"
                  : "hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center bg-white ${
                    hasAttempted
                      ? "border-green-500 text-green-500"
                      : "border-gray-300 text-transparent"
                  }`}
                >
                  <FaCheckCircle size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-gray-900 text-sm leading-snug ${
                      isLocked ? "blur-[1px] select-none text-gray-500" : ""
                    }`}
                  >
                    {q.title}
                  </h3>
                </div>
              </div>

              {/* Company Logos */}
              <div
                className={`flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-3 ${
                  isLocked ? "opacity-40 blur-[0.5px]" : ""
                }`}
              >
                {getCompanies(q).map((c, i) => (
                  <CompanyTag key={i} c={c} size="sm" />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                    q.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : q.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  } ${isLocked ? "opacity-50" : ""}`}
                >
                  {q.difficulty}
                </span>

                <div className="flex items-center gap-2">
                  {user?.role === "admin" ? (
                    <>
                      <Link
                        to={`/admin/edit-question/${q._id}`}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        <FaTrash size={14} />
                      </button>
                    </>
                  ) : isLocked ? (
                    <button
                      onClick={handleLockClick}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-black transition-colors"
                    >
                      <FaLock className="mr-1.5" size={10} /> Unlock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuestionAttempt(q._id)}
                      className="inline-flex items-center px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Solve It
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Problem</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Companies</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => {
              const hasAttempted = attemptedQuestions.includes(q._id);
              const isLocked =
                !isPremium && attemptedQuestions.length >= 3 && !hasAttempted;
              const cos = getCompanies(q);

              return (
                <tr
                  key={q._id}
                  className={`group transition-colors duration-200 ${
                    isLocked ? "bg-gray-50/50" : "hover:bg-blue-50/30"
                  }`}
                >
                  {/* Status */}
                  <td className="px-6 py-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        hasAttempted
                          ? "border-green-500 text-green-500"
                          : "border-gray-300 text-transparent"
                      }`}
                    >
                      <FaCheckCircle size={10} />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4">
                    <div
                      className={`font-semibold text-gray-900 ${
                        isLocked ? "blur-[2px] select-none text-gray-400" : ""
                      }`}
                    >
                      {q.title}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        q.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : q.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      } ${isLocked ? "opacity-50 blur-[1px]" : ""}`}
                    >
                      {q.difficulty}
                    </span>
                  </td>

                  {/* Companies */}
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 flex-wrap ${
                        isLocked ? "opacity-50 blur-[1px]" : ""
                      }`}
                    >
                      {cos.slice(0, 5).map((c, i) => (
                        <CompanyTag key={i} c={c} size="md" />
                      ))}
                      {cos.length > 5 && (
                        <span className="text-xs text-gray-400 self-center">
                          +{cos.length - 5}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    {user?.role === "admin" ? (
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/edit-question/${q._id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Question"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Question"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    ) : isLocked ? (
                      <button
                        onClick={handleLockClick}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <FaLock className="mr-2" size={12} /> Unlock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuestionAttempt(q._id)}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                      >
                        Solve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
