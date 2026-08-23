import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks.ts";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (!token && !user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
