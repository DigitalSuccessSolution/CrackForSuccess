import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaCheck, FaTimes, FaSearch, FaTrash } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Need a new endpoint to get all users.
      // I'll assume /api/admin/users generic endpoint exists or I need to create it.
      // Checking adminController.js, there isn't one.
      // I should add `getAllUsers` to adminController and route.
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (userId, currentStatus) => {
    try {
      // Need endpoint to toggle premium
      await api.put(`/admin/user/${userId}/premium`, {
        isPremium: !currentStatus,
      });
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isPremiumUser: !currentStatus } : u,
        ),
      );
    } catch (error) {
      alert("Failed to update user");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/user/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Questions Viewed
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {user.jobQuestionsViewed
                        ? user.jobQuestionsViewed.length
                        : 0}
                    </td>
                    <td className="px-6 py-4">
                      {user.isPremiumUser ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaCheck className="mr-1" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          togglePremium(user._id, user.isPremiumUser)
                        }
                        className={`text-xs font-medium px-3 py-1 rounded border transition-colors ${
                          user.isPremiumUser
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {user.isPremiumUser ? "Remove Premium" : "Make Premium"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="ml-2 text-xs font-medium px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-8 text-center text-gray-500">
              Loading users...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
