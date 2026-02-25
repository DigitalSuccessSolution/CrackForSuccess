import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

const CategoryTabs = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/job/category");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="mb-8 relative group">
      {/* <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div> */}

      <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        <div className="flex space-x-3 w-max mx-auto md:mx-0">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/job-preparation/${cat._id}`}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                categoryId === cat._id
                  ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20 transform scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
