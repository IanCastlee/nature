import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useAuthStore();

  // Not logged in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Role-based check (e.g. admin only)
  if (requiredRole && user?.acc_type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
