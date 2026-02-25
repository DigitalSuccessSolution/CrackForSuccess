import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaEdit, FaTrash, FaLayerGroup, FaPlus } from "react-icons/fa";
import AdminLayout from "../../components/Admin/AdminLayout";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mode: "job" (Job Prep) or "maang" (Standard/MAANG)
  const [activeTab, setActiveTab] = useState("job");

  // Form State
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    department: "CSE", // Used for Job Prep
    section: "CSE", // Used for MAANG
  });

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "job" ? "/job/category" : "/admin/category";
      const { data } = await api.get(endpoint);
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === "job" ? "/job/category" : "/admin/category";

      // Filter payload based on mode
      const payload = {
        name: formData.name,
        slug: formData.slug,
      };

      if (activeTab === "job") {
        payload.department = formData.department;
      } else {
        payload.section = formData.section;
      }

      if (isEditing) {
        await api.put(`${endpoint}/${isEditing}`, payload);
        alert("Category Updated");
      } else {
        await api.post(endpoint, payload);
        alert("Category Created");
      }
      setFormData({ name: "", slug: "", department: "CSE", section: "CSE" });
      setIsEditing(null);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const startEdit = (cat) => {
    setIsEditing(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug || "",
      department: cat.department || "CSE",
      section: cat.section || "CSE",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const endpoint =
        activeTab === "job" ? "/job/category" : "/admin/category";
      await api.delete(`${endpoint}/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Error deleting category");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Category Manager
          </h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Organize content into structured departments.
          </p>
        </div>

        {/* Tab Switcher */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section - Takes 4 columns */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                {isEditing ? <FaEdit /> : <FaPlus />}
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Category" : "Create New"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  {activeTab === "job" ? "Department" : "Section"}
                </label>
                <div className="relative">
                  {activeTab === "job" ? (
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3.5 transition-all outline-none appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="CSE">CSE</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="ECE">EE</option>
                    </select>
                  ) : (
                    <select
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3.5 transition-all outline-none appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">EE</option>
                      <option value="ML">ML</option>
                    </select>
                  )}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <FaLayerGroup />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border-slate-200 text-slate-800 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3.5 transition-all outline-none placeholder:font-normal"
                  placeholder="e.g. Data Structures"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Slug{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full bg-slate-50 border-slate-200 text-slate-800 font-medium rounded-xl shadow-sm focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 border-2 p-3.5 transition-all outline-none placeholder:font-normal"
                  placeholder="e.g. data-structures"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-4 rounded-xl shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading
                    ? "Processing..."
                    : isEditing
                      ? "Update Category"
                      : "Create Category"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(null);
                      setIsEditing(null);
                      setFormData({
                        name: "",
                        slug: "",
                        department: "CSE",
                        section: "CSE",
                      });
                    }}
                    className="px-6 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section - Takes 8 columns */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-[60px] group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                          activeTab === "job"
                            ? cat.department === "Mechanical"
                              ? "bg-orange-100 text-orange-600"
                              : cat.department === "ECE"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-blue-100 text-blue-600"
                            : cat.section === "ML"
                              ? "bg-purple-100 text-purple-600"
                              : cat.section === "ECE"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {activeTab === "job"
                          ? cat.department || "CSE"
                          : cat.section || "CSE"}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-sm text-slate-400 font-mono bg-slate-50 inline-block px-1.5 rounded">
                      /{cat.slug}
                    </p>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="flex justify-center mb-4 text-slate-300">
                    <FaLayerGroup size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-600">
                    No Categories Found
                  </h3>
                  <p className="text-slate-400">
                    Get started by adding a new category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryManager;
