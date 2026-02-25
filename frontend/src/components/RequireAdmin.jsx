import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RequireAdmin = () => {
  // Or ({ children }) if wrapping directly
  const { user, loading } = useContext(AuthContext);

  // If still loading auth state, maybe show spinner or nothing
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // Check if user exists and is admin
  // Note: user.role might be "admin"
  if (user && user.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/admin/login" replace />;
};

export default RequireAdmin;
