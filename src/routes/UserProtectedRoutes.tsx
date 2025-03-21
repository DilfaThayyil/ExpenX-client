import { Navigate, Outlet } from "react-router-dom";
import Store from "@/store/store";

const UserProtectedRoute = () => {
  const user = Store((state) => state.user);

  if (!user) {
    return <Navigate to="/not-found" replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
export default UserProtectedRoute;
