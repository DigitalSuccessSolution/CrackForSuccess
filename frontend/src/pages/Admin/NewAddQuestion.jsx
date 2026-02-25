import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../components/Admin/AdminLayout";
import CompanyPicker from "../../components/Admin/CompanyPicker";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const NewAddQuestion = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "job"; // "job" or "maang"

  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // State for Dynamic Switching
  const [activeTab, setActiveTab] = useState(initialType);
  const [selectedStream, setSelectedStream] = useState("CSE"); // Renamed from selectedDept for clarity

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    answer: "",
    difficulty: "Medium",
    askedIn: "",
    categoryId: "",
    status: "Published",
    tags: "",
    leetcodeUrl: "",
  });
  // Companies array (with logos)
  const [companies, setCompanies] = useState([]);

  // Fetch data on mount if editing
  useEffect(() => {
    if (isEditMode) {
      fetchQuestionDetails();
    }
  }, [id]);

  // Fetch categories when tab or stream changes
  useEffect(() => {
    fetchCategories();
  }, [activeTab, selectedStream]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selection or default stream if needed?
    // CSE and ECE exist in both. Mechanical only in Job. ML only in MAANG.
    if (
      tab === "maang" &&
      (selectedStream === "Mechanical" || selectedStream === "Civil")
    ) {
      setSelectedStream("CSE");
    }
    if (tab === "job" && selectedStream === "ML") {
      setSelectedStream("CSE");
    }
    setFormData((prev) => ({ ...prev, categoryId: "" })); // Reset category
  };

  const fetchCategories = async () => {
    try {
      let endpoint = "";
      if (activeTab === "job") {
        endpoint = `/job/category?department=${selectedStream}`;
      } else {
        // Maang categories
        endpoint = "/admin/category";
      }

      const { data } = await api.get(endpoint);

      let filteredData = data;
      if (activeTab === "maang") {
        filteredData = data.filter((c) => c.section === selectedStream);
      }

      setCategories(filteredData);
      if (!isEditMode && filteredData.length > 0) {
        // Auto select first if no category selected
        // But be careful not to overwrite if user is in middle of editing?
        // Logic: if categoryId is empty OR categoryId is not in the new list (invalid), select first.
        const currentValid = filteredData.find(
          (c) => c._id === formData.categoryId,
        );
        if (!currentValid) {
          setFormData((prev) => ({ ...prev, categoryId: filteredData[0]._id }));
        }
      } else if (filteredData.length === 0) {
        setFormData((prev) => ({ ...prev, categoryId: "" }));
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      // setCategories([]);
    }
  };

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);

      let data = null;
      let detectedType = initialType;

      // 1. Try fetching based on current/initial type
      try {
        const endpoint =
          initialType === "job"
            ? `/job/question/${id}`
            : `/admin/question/detail/${id}`;
        const res = await api.get(endpoint);
        data = res.data;
      } catch (error) {
        // 2. If 404, try the OTHER endpoint
        if (error.response && error.response.status === 404) {
          try {
            const alternateEndpoint =
              initialType === "job"
                ? `/admin/question/detail/${id}`
                : `/job/question/${id}`;
            const res = await api.get(alternateEndpoint);
            data = res.data;
            detectedType = initialType === "job" ? "maang" : "job";
            console.log("Found question in alternate type:", detectedType);
          } catch (innerError) {
            console.error("Question not found in either type", innerError);
            throw innerError; // Rethrow to hit main catch
          }
        } else {
          throw error;
        }
      }

      // Update active tab if we detected a different type
      if (detectedType !== activeTab) {
        setActiveTab(detectedType);
      }

      // 3. Fetch categories for the DETECTED type
      const catEndpoint =
        detectedType === "job" ? "/job/category" : "/admin/category";
      const categoriesResponse = await api.get(catEndpoint);
      const allCategories = categoriesResponse.data;

      // 4. Find where this question belongs to set Stream/Department
      const questionCategory = allCategories.find(
        (c) => c._id === (data.categoryId || data.category),
      );

      if (questionCategory) {
        const dept =
          detectedType === "job"
            ? questionCategory.department
            : questionCategory.section;
        setSelectedStream(dept);

        // Filter categories for the dropdown immediately so it shows correct option
        let filteredCats = allCategories;
        if (detectedType === "maang") {
          filteredCats = allCategories.filter((c) => c.section === dept);
        } else {
          // For job, backend usually handles filtering by param, but here we fetched all?
          // Wait, /job/category accepts department param.
          // If we called it without param, it returns all?
          // Let's check backend... getJobCategories uses query param. If missing, it returns all active.
          // So we should filter client side or re-fetch.
          // To be safe, let's just set the full list or filter relevant ones
          if (dept)
            filteredCats = allCategories.filter((c) => c.department === dept);
        }
        setCategories(filteredCats);
      } else {
        // If category not found (maybe deleted?), show all or just set list
        setCategories(allCategories);
      }

      setFormData({
        title: data.title,
        description: data.description || data.problemStatement || "",
        answer: data.answer || "",
        difficulty: data.difficulty,
        askedIn: data.askedIn || "",
        categoryId: data.categoryId || data.category,
        status: data.status || "Published",
        tags: data.tags
          ? Array.isArray(data.tags)
            ? data.tags.join(", ")
            : data.tags
          : "",
        leetcodeUrl: data.leetcodeUrl || "",
      });
      // Load existing companies
      if (data.companies && Array.isArray(data.companies)) {
        // New format: [{name, logoUrl}]
        if (
          data.companies.length > 0 &&
          typeof data.companies[0] === "object"
        ) {
          setCompanies(
            data.companies.map((c) => ({
              name: c.name || "",
              logoUrl: c.logoUrl || "",
            })),
          );
        } else {
          // Old format: ["TCS", "Infosys"] — backward compat
          setCompanies(data.companies.map((c) => ({ name: c, logoUrl: "" })));
        }
      } else if (data.askedIn) {
        setCompanies(
          data.askedIn
            .split(",")
            .map((c) => ({ name: c.trim(), logoUrl: "" }))
            .filter((c) => c.name),
        );
      }
    } catch (error) {
      console.error("Error fetching question", error);
      alert("Error loading question details. Please check the ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      companies, // [{name, logoUrl}]
      askedIn: companies.map((c) => c.name).join(", "), // backward compat string
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (activeTab === "maang") {
      payload.problemStatement = formData.description;
      payload.category = formData.categoryId;
    }

    try {
      if (isEditMode) {
        const endpoint =
          activeTab === "job" ? `/job/question/${id}` : `/admin/question/${id}`;
        await api.put(endpoint, payload);
        alert("Question updated successfully!");
      } else {
        const endpoint =
          activeTab === "job" ? "/job/question" : "/admin/question";
        await api.post(endpoint, payload);
        alert("Question added successfully!");
        setFormData({
          title: "",
          description: "",
          answer: "",
          difficulty: "Medium",
          askedIn: "",
          categoryId: categories.length > 0 ? categories[0]._id : "",
          status: "Published",
          tags: "",
          leetcodeUrl: "",
        });
        setCompanies([]);
      }
      // Navigate to list, preserving type
      navigate(`/admin/questions?type=${activeTab}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error saving question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/admin/questions?type=${activeTab}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all"
          >
            <FaArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Question" : "Add New Question"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Select the section and category to manage your question bank.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-8"
        >
          {/* Mode Switcher */}
          <div className="bg-gray-50 p-1 rounded-xl inline-flex mb-2 border border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange("job")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "job"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Job Based Prep
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("maang")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "maang"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              MAANG Preparation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stream Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {activeTab === "job" ? "Department" : "Section"}
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
                disabled={loading}
              >
                {/* Dynamic Options based on Mode */}
                {activeTab === "job" ? (
                  <>
                    <option value="CSE">CSE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="ECE">EE</option>
                  </>
                ) : (
                  <>
                    <option value="CSE">CSE</option>
                    <option value="ECE">EE</option>
                    <option value="ML">ML</option>
                  </>
                )}
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
                disabled={loading || categories.length === 0}
              >
                {categories.length === 0 && (
                  <option value="">No categories found</option>
                )}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Title
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
              placeholder="e.g. Explain the Second Law of Thermodynamics"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Companies / Asked In */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Companies (Optional)
              </label>
              <CompanyPicker value={companies} onChange={setCompanies} />
              <p className="text-xs text-gray-400 mt-1.5">
                Search from popular companies or type any name to add custom.
              </p>
            </div>

            {/* LeetCode / External Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                External Link / LeetCode URL (
                {activeTab === "maang" ? "Recommended" : "Optional"})
              </label>
              <input
                type="url"
                value={formData.leetcodeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, leetcodeUrl: e.target.value })
                }
                className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
                placeholder="https://leetcode.com/problems/..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 transition-all outline-none"
              placeholder="e.g. thermodynamics, heat-transfer, cycles"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Problem Statement / Description (Markdown supported)
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 font-mono text-sm transition-all outline-none resize-none"
              placeholder="Detailed description of the problem..."
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Answer / Solution (Markdown supported)
            </label>
            <textarea
              required
              rows={8}
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="w-full bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 border p-3 font-mono text-sm transition-all outline-none resize-none"
              placeholder="Detailed answer..."
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 font-semibold transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <FaSave /> {loading ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewAddQuestion;
