import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FaUsers,
  FaChartPie,
  FaFolder,
  FaLayerGroup,
  FaQuestionCircle,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import AdminLayout from "../../components/Admin/AdminLayout";
import { CardSkeleton } from "../../components/SkeletonLoader";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalCategories: 0,
    premiumUsers: 0,
    sectionStats: { CSE: 0, Mechanical: 0, ECE: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/job/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <CardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">
          Overview of platform activity and content.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaLayerGroup />}
              label="Total Categories"
              value={stats.totalCategories}
              color="bg-indigo-500"
            />
            <StatCard
              icon={<FaQuestionCircle />}
              label="Total Questions"
              value={stats.totalQuestions}
              color="bg-blue-500"
            />
            <StatCard
              icon={<FaUsers />}
              label="Active Users"
              value={stats.activeUsers || 0}
              color="bg-emerald-500"
            />
            <StatCard
              icon={<FaChartLine />}
              label="Engagement"
              value={stats.engagement || "0%"}
              color="bg-amber-500"
            />
          </div>

          {/* Section Breakdown */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-black rounded-sm"></span>
              Content Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(stats.sectionStats).map(([dept, count]) => {
                const displayName = dept === "ECE" ? "EE" : dept;
                return (
                  <div
                    key={dept}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative"
                  >
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-slate-700 mb-1">
                        {displayName}
                      </h3>
                      <p className="text-3xl font-bold text-slate-900 group-hover:text-black transition-colors">
                        {count}
                      </p>
                      <p className="text-sm text-slate-400 mt-2 font-medium">
                        Questions
                      </p>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-black rounded-sm"></span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ActionCard
                title="Add New Question"
                desc="Add to Question Bank"
                icon={<FaPlus />}
                to="/admin/add-question"
                accent="from-indigo-500 to-blue-500"
              />
              <ActionCard
                title="Manage Categories"
                desc="Edit or create departments"
                icon={<FaLayerGroup />}
                to="/admin/categories"
                accent="from-emerald-500 to-teal-500"
              />
              <ActionCard
                title="User Management"
                desc="View registered candidates"
                icon={<FaUsers />}
                to="/admin/users"
                accent="from-amber-500 to-orange-500"
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
    <div
      className={`${color} w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl shadow-md transform rotate-3`}
    >
      {icon}
    </div>
    <div>
      <p className="text-slate-400 font-semibold text-sm uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ title, desc, icon, to, accent }) => (
  <Link
    to={to}
    className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
    ></div>
    <div className="relative z-10 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  </Link>
);

export default AdminDashboard;
