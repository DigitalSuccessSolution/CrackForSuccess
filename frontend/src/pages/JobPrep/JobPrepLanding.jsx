import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCode,
  FaLaptopCode,
  FaDatabase,
  FaNetworkWired,
  FaBriefcase,
} from "react-icons/fa";
import AutoBannerSlider from "../../components/JobPrep/AutoBannerSlider";

const JobPrepLanding = ({
  department = "CSE",
  basePath = "/job-preparation",
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [department]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get(`/job/category?department=${department}`);
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("data")) return <FaDatabase size={24} />;
    if (n.includes("network")) return <FaNetworkWired size={24} />;
    if (n.includes("web") || n.includes("dev"))
      return <FaLaptopCode size={24} />;
    return <FaCode size={24} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" size={12} />
            Back to Home
          </Link>
        </div>

        {/* Auto Slider Banner Box */}
        {/* <div className="mb-12">
          <AutoBannerSlider />
        </div> */}

        <div className="flex items-center justify-between mb-8 px-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {department} Job Preparation
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a domain to start practicing
            </p>
          </div>
          {!loading && (
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
              {categories.length} Topics
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white h-48 rounded-2xl shadow-sm border border-gray-100 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="text-gray-400 mb-4 flex justify-center">
                  <FaBriefcase size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No categories found
                </h3>
                <p className="text-gray-500 mt-2">
                  Check back soon for new content.
                </p>
              </div>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`${basePath}/${cat._id}`}
                  className="group relative bg-white rounded-2xl p-3 md:p-6 shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 flex flex-col items-start h-full transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between w-full mb-2 md:mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      {getIcon(cat.name)}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <FaArrowRight
                        size={12}
                        className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-auto">
                    Master the essential concepts and interview questions for{" "}
                    {cat.name} roles.
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPrepLanding;
