import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  // ===========================
  // Load Logged-in User
  // ===========================

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");

        setUser(res.data);
      } catch (error) {
        console.error(error);

        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ===========================
  // Signup
  // ===========================

  const signup = async (userData) => {
    try {
      const res = await api.post("/auth/signup", userData);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          "Signup Failed",
      };
    }
  };

  // ===========================
  // Login
  // ===========================

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = res.data.access_token;

      localStorage.setItem("token", accessToken);

      setToken(accessToken);

      const userRes = await api.get("/auth/me");

      setUser(userRes.data);

      navigate("/dashboard");

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          "Invalid Credentials",
      };
    }
  };

  // ===========================
  // Logout
  // ===========================

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;