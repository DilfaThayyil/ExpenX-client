import { Navigate, Outlet } from "react-router-dom";
import Store from "@/store/store";

const AdvisorProtectedRoute = () => {
  const user = Store((state) => state.user);

  if (!user) {
    return <Navigate to="/advisor/login" replace />;
  }

  if (user.role !== "advisor") {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default AdvisorProtectedRoute;
