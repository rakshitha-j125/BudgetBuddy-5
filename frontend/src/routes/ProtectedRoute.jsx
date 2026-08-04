import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // Wait until authentication check completes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Checking Authentication...
          </p>
        </div>
      </div>
    );
  }

  // No token -> Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;