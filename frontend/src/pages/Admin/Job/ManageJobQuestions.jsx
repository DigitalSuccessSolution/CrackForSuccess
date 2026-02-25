import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const ManageJobQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/job/category");
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/job/question/list/${selectedCategory}`);
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
      await api.delete(`/job/question/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      alert("Error deleting question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/job" className="text-gray-500 hover:text-gray-700">
              <FaArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Job Questions</h1>
          </div>
          <Link
            to="/admin/job/add-question"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaPlus /> Add Question
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
          <span className="text-gray-700 font-medium">Filter by Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} ({cat.department || "CSE"})
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : questions.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Asked In
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {q.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          q.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : q.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{q.askedIn}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/job/edit-question/${q._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No questions found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobQuestions;
