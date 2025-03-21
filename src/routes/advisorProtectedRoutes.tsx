import { Navigate, Outlet } from "react-router-dom";
import Store from "@/store/store";

const AdvisorProtectedRoute = () => {
  const user = Store((state) => state.user);

  if (!user) {
    return <Navigate to="/not-found" replace />;
  }

  if (user.role !== "advisor") {
    return <Navigate to="/advisor/login" replace />;
  }

  return <Outlet />;
};

export default AdvisorProtectedRoute;
