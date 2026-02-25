import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    difficulty: "Easy",
    category: "",
    companies: "",
    leetcodeUrl: "",
    isPremium: false,
  });

  const [examples, setExamples] = useState([]);
  const [constraints, setConstraints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, questionRes] = await Promise.all([
          api.get("/admin/category"),
          api.get(`/admin/question/detail/${id}`),
        ]);

        setCategories(catsRes.data);
        const q = questionRes.data;

        setFormData({
          title: q.title,
          problemStatement: q.problemStatement,
          difficulty: q.difficulty,
          category: q.category,
          companies: q.companies.join(", "),
          leetcodeUrl: q.leetcodeUrl || "",
          isPremium: q.isPremium || false,
        });

        // Populate examples and constraints
        setExamples(q.examples || [{ input: "", output: "", explanation: "" }]);
        setConstraints(q.constraints || [""]);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load question data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Example handlers
  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }]);
  };

  const removeExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  // Constraint handlers
  const handleConstraintChange = (index, value) => {
    const newConstraints = [...constraints];
    newConstraints[index] = value;
    setConstraints(newConstraints);
  };

  const addConstraint = () => {
    setConstraints([...constraints, ""]);
  };

  const removeConstraint = (index) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        companies: formData.companies.split(",").map((s) => s.trim()),
        examples: examples.filter((ex) => ex.input || ex.output), // Filter empty
        constraints: constraints.filter((c) => c.trim() !== ""),
      };
      await api.put(`/admin/question/${id}`, payload);
      alert("Question Updated!");
      navigate(-1); // Go back
    } catch (error) {
      console.error(error);
      alert("Failed to update question");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Question</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Problem Statement
              </label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          {/* Examples Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Examples</h3>
              <button
                type="button"
                onClick={addExample}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium hover:bg-blue-100 flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Example
              </button>
            </div>

            <div className="space-y-4">
              {examples.map((ex, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Input
                      </label>
                      <input
                        value={ex.input}
                        onChange={(e) =>
                          handleExampleChange(index, "input", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm font-mono focus:border-blue-500 outline-none"
                        placeholder="nums = [2,7,11,15], target = 9"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Output
                      </label>
                      <input
                        value={ex.output}
                        onChange={(e) =>
                          handleExampleChange(index, "output", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm font-mono focus:border-blue-500 outline-none"
                        placeholder="[0,1]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Explanation
                      </label>
                      <input
                        value={ex.explanation}
                        onChange={(e) =>
                          handleExampleChange(
                            index,
                            "explanation",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:border-blue-500 outline-none"
                        placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Constraints
              </h3>
              <button
                type="button"
                onClick={addConstraint}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium hover:bg-blue-100 flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Constraint
              </button>
            </div>
            <div className="space-y-3">
              {constraints.map((c, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={c}
                    onChange={(e) =>
                      handleConstraintChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm font-mono focus:border-blue-500 outline-none"
                    placeholder="2 <= nums.length <= 10^4"
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className="text-gray-400 hover:text-red-500 px-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Info */}
          <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LeetCode URL
              </label>
              <input
                name="leetcodeUrl"
                type="url"
                value={formData.leetcodeUrl}
                onChange={handleChange}
                placeholder="https://leetcode.com/ problems/..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Companies (comma separated)
              </label>
              <input
                name="companies"
                value={formData.companies}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Google, Amazon"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPremium"
              id="isPremium"
              checked={formData.isPremium}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPremium" className="ml-2 text-sm text-gray-900">
              Premium Question
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuestion;
