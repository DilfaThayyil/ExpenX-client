import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserRoutes from "./routes/userRoutes";
import AdvisorRoutes from "./routes/advisorRoutes";
import AdminRoutes from "./routes/adminRoutes";
import { NotFound } from "@/pages/404/404";
import {NotificationProvider} from '@/context/NotificationContext'

const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <NotificationProvider> {/* Wrap the entire Routes in NotificationProvider */}
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/advisor/*" element={<AdvisorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificationProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
