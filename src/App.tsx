import { Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterPage from './components/user/RegisterForm';
import LandingPage from './pages/user/LandingPage';
import LoginPage from './components/user/LoginForm';
import ResetPassword from './components/user/ResetPassword';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdvisorLogin from './components/advisor/LoginForm';
import AdvisorRegister from './components/advisor/RegisterForm';
import AdvisorLanding from './pages/advisor/LandingPage';
import AdminLogin from './components/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardPage from './pages/user/home';
import DashboardAd from './pages/advisor/home'
import WithoutNavbar from './layout/withoutNav';
import WithNavbar from './layout/withNav';


const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <Routes>
        {/* Routes without Navbar */}
        <Route element={<WithoutNavbar />}>
          <Route path="/home" element={<DashboardPage />} />
          <Route path='/advisor/home' element={<DashboardAd/>}/>
        </Route>

        {/* Routes with Navbar */}
        <Route element={<WithNavbar />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/advisor/register" element={<AdvisorRegister />} />
          <Route path="/advisor/login" element={<AdvisorLogin />} />
          <Route path="/advisor" element={<AdvisorLanding />} />
          <Route path="/advisor/resetPassword" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
