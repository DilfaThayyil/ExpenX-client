import { Navigate, Outlet } from "react-router-dom";
import useAdminStore from "@/store/adminStore";

const AdminProtectedRoute = () => {
  const adminEmail = useAdminStore((state) => state.adminEmail);

  if (!adminEmail) {
    return <Navigate to="/admin/login" replace />; 
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
