import { Routes, Route } from 'react-router-dom';
import AdminLogin from '@/components/admin/Login';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users';
import Advisors from '@/pages/admin/Advisors';
import AdminProfile from '@/pages/admin/Profile';
import Categories from '@/pages/admin/Category';
import { NotFound } from '@/pages/NotFound/404';
import AdminProtectedRoute from './AdminProtectedRoutes'

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="login" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
                <Route path="" element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="advisors" element={<Advisors />} />
                <Route path="categories" element={<Categories />} />
                <Route path="profile" element={<AdminProfile />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
