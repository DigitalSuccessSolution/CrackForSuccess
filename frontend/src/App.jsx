import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Admin Imports
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CategoryManager from "./components/Admin/CategoryManager";
import QuestionManager from "./components/Admin/QuestionManager";
import NewAddQuestion from "./pages/Admin/NewAddQuestion";
import RequireAdmin from "./components/RequireAdmin";

import CategoryList from "./pages/CategoryList";
import QuestionList from "./pages/QuestionList";
import QuestionDetail from "./pages/QuestionDetail";
import ManageUsers from "./pages/Admin/ManageUsers";

import JobPrepLanding from "./pages/JobPrep/JobPrepLanding";
import JobQuestionList from "./pages/JobPrep/JobQuestionList";
import JobQuestionDetail from "./pages/JobPrep/JobQuestionDetail";

import DynamicSection from "./pages/DynamicSection";
import BackButton from "./components/ui/BackButton";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
          <Navbar />
          {/* <BackButton /> */}
          <div className="grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Dynamic Sections */}
              <Route
                path="/mechanical"
                element={<DynamicSection department="Mechanical" />}
              />
              <Route path="/ee" element={<DynamicSection department="ECE" />} />

              {/* EE Question Detail */}
              <Route
                path="/ee/question/:questionId"
                element={<JobQuestionDetail basePath="/ee" />}
              />
              {/* Dynamic Section Routes */}
              <Route path="/:section/maang" element={<CategoryList />} />
              <Route
                path="/:section/maang/:categoryId"
                element={<QuestionList />}
              />
              <Route
                path="/:section/question/:questionId"
                element={<QuestionDetail />}
              />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/categories" element={<CategoryManager />} />
                <Route path="/admin/questions" element={<QuestionManager />} />
                <Route
                  path="/admin/add-question"
                  element={<NewAddQuestion />}
                />
                <Route
                  path="/admin/edit-question/:id"
                  element={<NewAddQuestion />}
                />
                <Route path="/admin/users" element={<ManageUsers />} />

                {/* Legacy/Redirects or Keep if needed for specialized pages */}
                {/* <Route path="/admin/job/questions" element={<QuestionManager />} /> */}
              </Route>
              {/* Job Prep User Routes */}
              {/* Job Prep User Routes - CSE (Default) */}
              <Route
                path="/job-preparation"
                element={<JobPrepLanding department="CSE" />}
              />
              <Route
                path="/job-preparation/:categoryId"
                element={<JobQuestionList basePath="/job-preparation" />}
              />
              <Route
                path="/job-preparation/question/:questionId"
                element={<JobQuestionDetail basePath="/job-preparation" />}
              />

              {/* Job Prep User Routes - Mechanical */}
              <Route
                path="/mechanical-job-preparation"
                element={
                  <JobPrepLanding
                    department="Mechanical"
                    basePath="/mechanical-job-preparation"
                  />
                }
              />
              <Route
                path="/mechanical-job-preparation/:categoryId"
                element={
                  <JobQuestionList basePath="/mechanical-job-preparation" />
                }
              />
              <Route
                path="/mechanical-job-preparation/question/:questionId"
                element={
                  <JobQuestionDetail basePath="/mechanical-job-preparation" />
                }
              />

              {/* Job Prep User Routes - EE */}
              <Route
                path="/ee-job-preparation"
                element={
                  <JobPrepLanding
                    department="EE"
                    basePath="/ee-job-preparation"
                  />
                }
              />
              <Route
                path="/ee-job-preparation/:categoryId"
                element={<JobQuestionList basePath="/ee-job-preparation" />}
              />
              <Route
                path="/ee-job-preparation/question/:questionId"
                element={<JobQuestionDetail basePath="/ee-job-preparation" />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
