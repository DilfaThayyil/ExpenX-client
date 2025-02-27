import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/user/LandingPage';
import RegisterPage from '@/components/user/RegisterForm';
import LoginPage from '@/components/user/LoginForm';
import ResetPassword from '@/components/user/ResetPassword';
import DashboardPage from '@/pages/user/home';
import Expenses from '@/pages/user/Expenses';
import Groups from '@/pages/user/Groups';
import Profile from '@/pages/user/Profile';
import SlotBooking from '@/pages/user/slotBooking';
import { NotFound } from '@/pages/NotFound/404';
import UserProtectedRoute from './UserProtectedRoutes'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="" element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route element={<UserProtectedRoute/>}>
                <Route path="home" element={<DashboardPage />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="groups" element={<Groups />} />
                <Route path="profile" element={<Profile />} />
                <Route path="slotBooking" element={<SlotBooking />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
