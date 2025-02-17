import { Routes, Route } from 'react-router-dom';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/user/LandingPage';
import RegisterPage from './components/user/RegisterForm';
import LoginPage from './components/user/LoginForm';
import ResetPassword from './components/user/ResetPassword';
import DashboardPage from './pages/user/home';
import Expenses from './pages/user/Expenses';
import Groups from './pages/user/Groups';
import Profile from './pages/user/Profile';
import AdvisorLogin from './components/advisor/LoginForm';
import AdvisorRegister from './components/advisor/RegisterForm';
import AdvisorLanding from './pages/advisor/LandingPage';
import DashboardAd from './pages/advisor/home'
import ProfileAd from './pages/advisor/Profile';
import SlotManage from './pages/advisor/SlotManage';
import AdminLogin from './components/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users'
import Advisors from '@/pages/admin/Advisors'
import AdminProfile from '@/pages/admin/Profile'
import Clients from './pages/advisor/Clients';
import SlotBooking from './pages/user/slotBooking';
import VideoCall from './components/advisor/appointments/videoCall';
// import ChatWindow from './components/chat/chat'
import Categories from './pages/admin/Category';

const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<DashboardPage />} />
          <Route path='/expenses' element={<Expenses/>}/>
          <Route path='/groups' element={<Groups/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/slotBooking" element={<SlotBooking/>}/>
          
          <Route path="/advisor" element={<AdvisorLanding />} />
          <Route path="/advisor/register" element={<AdvisorRegister />} />
          <Route path="/advisor/login" element={<AdvisorLogin />} />
          <Route path='/advisor/home' element={<DashboardAd/>}/>
          <Route path='advisor/profile' element={<ProfileAd/>}/>
          <Route path="/advisor/resetPassword" element={<ResetPassword />} />
          <Route path='/advisor/slotManage' element={<SlotManage/>}/>
          <Route path='/advisor/clients' element={<Clients/>}/>
          <Route path='/videoCall' element={<VideoCall/>}/>
          {/* <Route path='/chat' element={<ChatWindow/>}/> */}

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/admin/users' element={<Users/>}/>
          <Route path='/admin/advisors' element={<Advisors/>}/>
          <Route path='/admin/categories' element={<Categories/>}/>
          <Route path='/admin/profile' element={<AdminProfile/>}/>
          
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
