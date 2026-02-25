import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const JobPrepSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    department: "CSE",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/job/category");
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
      if (isEditing) {
        await api.put(`/job/category/${isEditing}`, formData);
        alert("Category Updated");
      } else {
        await api.post("/job/category", formData);
        alert("Category Created");
      }
      setFormData({ name: "", slug: "", department: "CSE" });
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
      slug: cat.slug,
      department: cat.department || "CSE",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/job/category/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Error deleting category");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Job Based Preparation Management
        </h2>
        <Link
          to="/admin/job/questions"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
        >
          <FaPlus size={14} /> Manage Questions
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold mb-4">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                placeholder="e.g. Web Development"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                placeholder="e.g. web-dev"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="CSE">CSE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="ECE">EE</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setFormData({ name: "", slug: "", department: "CSE" });
                }}
                className="w-full bg-gray-200 mt-2 py-2 rounded-lg hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Dept
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        cat.department === "Mechanical"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {cat.department || "CSE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobPrepSection;
