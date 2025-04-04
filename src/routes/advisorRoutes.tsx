import { Routes, Route } from 'react-router-dom';
import AdvisorLogin from '@/components/advisor/LoginForm';
import AdvisorRegister from '@/components/advisor/RegisterForm';
import AdvisorLanding from '@/pages/advisor/LandingPage';
import DashboardAd from '@/pages/advisor/home';
import ProfileAd from '@/pages/advisor/Profile';
import SlotManage from '@/pages/advisor/SlotManage';
import ResetPassword from '@/components/user/ResetPassword';
import Clients from '@/pages/advisor/Clients';
import { NotFound } from '@/pages/404/404';
import AdvisorProtectedRoute from './advisorProtectedRoutes'
// import PublicRoute from './publicRoute'
import WithNavbar from '@/layout/withNav'
import ClientProfile from '@/components/advisor/clientProfile/ClientProfile'
import AdvisorWallet from '@/pages/advisor/Wallet';

const AdvisorRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="" element={<AdvisorLanding />} />
            {/* <Route element={<PublicRoute/>}> */}
            <Route path="register" element={<AdvisorRegister />} />
            <Route path="login" element={<AdvisorLogin />} />
            {/* </Route> */}
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route element={<AdvisorProtectedRoute />}>
                <Route element={<WithNavbar />}>
                    <Route path="home" element={<DashboardAd />} />
                    <Route path="profile" element={<ProfileAd />} />
                    <Route path="wallet" element={<AdvisorWallet/>}/>
                    <Route path="slotManage" element={<SlotManage />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="clientProfile/:clientId" element={<ClientProfile/>}/>
                </Route>
            </Route>
        </Routes >
    );
};

export default AdvisorRoutes;
