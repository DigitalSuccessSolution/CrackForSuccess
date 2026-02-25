import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Expose checkUser as refreshUser and make it reusable
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await api.get("/auth/me");
        setUser(data);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user); // Should contain role etc.
    return true;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // window.location.href = '/login'; // Or use navigate if inside provider
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, refreshUser, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
