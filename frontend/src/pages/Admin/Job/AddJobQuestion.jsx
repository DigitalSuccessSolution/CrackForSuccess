import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const AddJobQuestion = () => {
  const { id } = useParams(); // If id exists, it's edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Medium",
    askedIn: "",
    categoryId: "",
    description: "",
    answer: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchQuestionDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/job/category");
      setCategories(data);
      // Set default category if creating new
      if (!isEditMode && data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0]._id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/job/question/${id}`);
      setFormData({
        title: data.title,
        difficulty: data.difficulty,
        askedIn: data.askedIn,
        categoryId: data.categoryId,
        description: data.description,
        answer: data.answer,
      });
    } catch (error) {
      alert("Error fetching question details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/job/question/${id}`, formData);
        alert("Question updated successfully!");
      } else {
        await api.post("/job/question", formData);
        alert("Question added successfully!");
      }
      navigate("/admin/job/questions");
    } catch (error) {
      alert(error.response?.data?.message || "Error saving question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Question" : "Add New Question"}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} ({cat.department || "CSE"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Question Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asked In (Company/Role)
              </label>
              <input
                type="text"
                name="askedIn"
                value={formData.askedIn}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                placeholder="e.g. Google, Data Analyst Interview"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Answer (Markdown Supported)
              </label>
              <textarea
                name="answer"
                rows={8}
                value={formData.answer}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 font-mono text-sm"
                required
                placeholder="## Heading\n* Bullet point"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition"
              >
                <FaSave className="mr-2" />
                {loading ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobQuestion;
