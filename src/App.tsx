import {Routes,Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './components/user/RegisterForm'
import OTPVerification from './components/user/Otp'
import LandingPage from './pages/user/LandingPage'
import LoginPage from './components/user/LoginForm'
import ForgetPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AdvisorLogin from './components/advisor/LoginForm'
import AdvisorRegister from './components/advisor/RegisterForm'
import AdvisorLanding from './pages/advisor/LandingPage'
// import AdminLogin from './components/admin/Login'
// import AdminRegister from './components/admin/Register'
import OTPVerificationad from './components/advisor/Otp'
import AdminLogin from './components/admin/Login'
import AdminDashboard from './pages/admin/LandingPage'
const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID


const App = ()=>{
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OTPVerification email={''} purpose={''}/>} />
        <Route path='/forgetPassword' element={<ForgetPassword toggleModal={function (): void {
        throw new Error('Function not implemented.')
      } }/>} />
      <Route path='/resetPassword' element={<ResetPassword/>} />
      <Route path='/advisor/register' element={<AdvisorRegister/>} />
      <Route path='/advisor/login' element={<AdvisorLogin/>} />
      <Route path='/advisor' element={<AdvisorLanding/>} />
      <Route path='/advisor/otp' element={<OTPVerificationad/>} />
      <Route path='/advisor/resetPassword' element={<ResetPassword/>} />

      <Route path='/admin/login' element={<AdminLogin/>} />      
      <Route path='/admin' element={<AdminDashboard/>} />      
      
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App
