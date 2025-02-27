import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserRoutes from "./routes/userRoutes";
import AdvisorRoutes from "./routes/advisorRoutes";
import AdminRoutes from "./routes/adminRoutes";
import { NotFound } from "@/pages/404/404"; 

const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/advisor/*" element={<AdvisorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
