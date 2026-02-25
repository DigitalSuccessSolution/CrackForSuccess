import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaLayerGroup,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Updated icons for a more modern feel
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaChartPie /> },
    { name: "Categories", path: "/admin/categories", icon: <FaLayerGroup /> },
    { name: "Questions", path: "/admin/questions", icon: <FaClipboardList /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans">
      {/* Mobile Header / Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 flex items-center justify-between px-4 transition-all duration-300">
        <div className="flex items-center gap-2">
          <span className="bg-gray-900 text-white p-1.5 rounded-lg">
            <FaLayerGroup size={16} />
          </span>
          <span className="font-semibold text-lg text-gray-800 tracking-tight">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0f172a] text-white transform transition-transform duration-300 ease-out z-40 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } flex flex-col border-r border-gray-800/50`}
      >
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-gray-800 text-white shadow-lg shadow-black/40 border border-gray-700"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse"></div>
                )}
                <span
                  className={`mr-3.5 transition-colors duration-200 ${isActive ? "text-indigo-200" : "text-gray-500 group-hover:text-indigo-400"}`}
                >
                  {item.icon}
                </span>
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-800/60 bg-gray-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/20"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gray-100/50 -z-10 pointer-events-none"></div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
