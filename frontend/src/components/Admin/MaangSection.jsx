import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaPlus, FaEdit, FaTrash, FaLayerGroup } from "react-icons/fa";
import CategoryModal from "./CategoryModal";

const MaangSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/category");
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (formData) => {
    try {
      const { data } = await api.post("/admin/category", formData);
      setCategories([...categories, data]);
      setIsModalOpen(false);
      alert("MAANG Category Created Successfully!");
    } catch (error) {
      alert("Failed to create category");
    }
  };

  const handleUpdateCategory = async (formData) => {
    if (!editingCategory) return;
    try {
      const { data } = await api.put(
        `/admin/category/${editingCategory._id}`,
        formData,
      );
      setCategories(categories.map((c) => (c._id === data._id ? data : c)));
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      alert("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This will delete the category!")) return;
    try {
      await api.delete(`/admin/category/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading MAANG Data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          MAANG Companies Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <FaLayerGroup className="mr-2" /> New Category
          </button>
          <Link
            to="/admin/add-question"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaPlus className="mr-2" /> Add Question
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Section
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-600">{cat.order}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cat.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default MaangSection;
