import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Cookie } from "lucide-react";

const PolicyLayout = ({ children, title, icon: Icon, lastUpdated }) => {
  const location = useLocation();

  const tabs = [
    { name: "Privacy Policy", path: "/privacy-policy", icon: Shield },
    { name: "Terms of Service", path: "/terms-of-service", icon: FileText },
    { name: "Cookie Policy", path: "/cookie-policy", icon: Cookie },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-64 w-full absolute top-0 left-0 z-0">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Top Navigation */}
          <div className="mb-8 flex items-center justify-between text-white/90">
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="hidden sm:block text-sm opacity-75">
              Legal Center
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Mobile/Tablet Tab Select */}
            <div className="md:hidden border-b border-gray-200 p-4 bg-gray-50/50">
              <label htmlFor="tab-select" className="sr-only">
                Select a policy
              </label>
              <select
                id="tab-select"
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={location.pathname}
                onChange={(e) => (window.location.href = e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.path} value={tab.path}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row min-h-[600px]">
              {/* Sidebar Navigation (Desktop) */}
              <div className="hidden md:block w-72 bg-gray-50/50 border-r border-gray-200 p-6 flex-shrink-0">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                  Legal Documents
                </h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    const TabIcon = tab.icon;
                    return (
                      <Link
                        key={tab.path}
                        to={tab.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                            : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                        }`}
                      >
                        <TabIcon
                          size={18}
                          className={`transition-colors ${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        <span className="font-medium text-sm">{tab.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Need help? Contact support.
                  </p>
                  <a
                    href="mailto:support@crack4success.com"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 mt-2 inline-block hover:underline"
                  >
                    support@crack4success.com
                  </a>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-5 md:p-12 lg:p-14">
                <div className="max-w-3xl mx-auto">
                  <header className="mb-8 md:mb-10 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        Official Policy
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                      {title}
                    </h1>
                    {lastUpdated && (
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Last updated:</span>
                        <span className="font-medium text-gray-700">
                          {lastUpdated}
                        </span>
                      </p>
                    )}
                  </header>

                  <div className="prose prose-blue prose-sm sm:prose-base md:prose-lg max-w-none text-gray-600">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;
