import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import {
  FaPlus,
  FaFolder,
  FaFileAlt,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const JobDashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalQuestions: 0,
    premiumUsers: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Category
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/job/admin/stats");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      setFormData({ name: "", slug: "" });
      setIsEditing(null);
      fetchCategories();
      fetchData(); // Update stats
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const startEdit = (cat) => {
    setIsEditing(cat._id);
    setFormData({ name: cat.name, slug: cat.slug });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/job/category/${id}`);
      fetchCategories();
      fetchData();
    } catch (error) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Prep Admin</h1>
            <p className="text-gray-600">Manage Interview Questions</p>
          </div>
          <Link
            to="/admin/job/questions"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Manage Questions
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCategories}
              </p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaFolder size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalQuestions}
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <FaFileAlt size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Premium Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.premiumUsers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FaUsers size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>
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
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {isEditing ? "Update Category" : "Add Category"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: "", slug: "" });
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition mt-2"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Category List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Existing Categories</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td className="px-6 py-4">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
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
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;
