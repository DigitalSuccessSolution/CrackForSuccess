import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import AdminLayout from "../../components/Admin/AdminLayout";

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Mode: "job" or "maang"
  const [activeTab, setActiveTab] = useState("job");

  // Filters
  const [selectedDept, setSelectedDept] = useState("Mechanical"); // For Job Prep
  const [selectedSection, setSelectedSection] = useState("CSE"); // For MAANG
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [selectedDept, selectedSection, activeTab]);

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    } else if (categories.length > 0) {
      // Auto select first category if none selected
      setSelectedCategory(categories[0]._id);
    } else {
      setQuestions([]);
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      let endpoint = "";
      if (activeTab === "job") {
        endpoint = `/job/category?department=${selectedDept}`;
      } else {
        // MAANG categories might not filter by query param in the same way,
        // but let's assume filtering in frontend if backend returns all,
        // OR backend supports filtering.
        // Based on CategoryManager: /admin/category returns all.
        endpoint = "/admin/category";
      }

      const { data } = await api.get(endpoint);

      let filteredData = data;
      if (activeTab === "maang") {
        filteredData = data.filter((c) => c.section === selectedSection);
      }

      setCategories(filteredData);
      if (data.length > 0) {
        setSelectedCategory(data[0]._id);
      } else {
        setSelectedCategory("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      let endpoint = "";
      if (activeTab === "job") {
        endpoint = `/job/question/list/${selectedCategory}`;
      } else {
        endpoint = `/admin/question/${selectedCategory}`;
      }

      const { data } = await api.get(endpoint);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const endpoint =
        activeTab === "job" ? `/job/question/${id}` : `/admin/question/${id}`;
      await api.delete(endpoint);
      // Remove from local state
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      alert("Error deleting question");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Question Manager
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Manage your question bank and content.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveTab("job")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "job"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Job Prep
            </button>
            <button
              onClick={() => setActiveTab("maang")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "maang"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              MAANG
            </button>
          </div>

          <Link
            to={`/admin/add-question?type=${activeTab}`}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3.5 rounded-xl text-center font-semibold shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaPlus size={14} /> Add New Question
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FaFilter className="text-indigo-500" /> Filters
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {activeTab === "job" ? "Department" : "Section"}
                </label>
                {activeTab === "job" ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3 transition-all outline-none cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="ECE">EE</option>
                  </select>
                ) : (
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3 transition-all outline-none cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">EE</option>
                    <option value="ML">ML</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border-2 p-3 transition-all outline-none cursor-pointer disabled:opacity-50"
                  disabled={categories.length === 0}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-500 mt-2 font-medium">
                    No categories found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-slate-500 font-medium">
                  Loading questions...
                </p>
              </div>
            ) : questions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Asked In
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {questions.map((q) => (
                      <tr
                        key={q._id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-700 max-w-xs truncate group-hover:text-black transition-colors">
                          {q.title}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              q.difficulty === "Easy"
                                ? "bg-emerald-100 text-emerald-700"
                                : q.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${q.status === "Draft" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"}`}
                          >
                            {q.status || "Published"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-500 text-sm font-medium truncate max-w-[150px]">
                          {q.askedIn || (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/edit-question/${q._id}?type=${activeTab}`,
                              )
                            }
                            className="p-2 text-indigo-100 bg-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-200"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(q._id)}
                            className="p-2 text-rose-100 bg-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-200"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <FaSearch size={24} />
                </div>
                <p className="font-medium text-lg text-slate-600 mb-1">
                  No questions found
                </p>
                <p className="text-sm">
                  {categories.length === 0
                    ? "Select a department with categories first."
                    : "No questions in this category yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuestionManager;
