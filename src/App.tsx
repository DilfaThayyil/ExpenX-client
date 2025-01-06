import {Routes,Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './components/user/RegisterForm'
import OTPVerification from './components/user/Otp'
import LandingPage from './pages/user/LandingPage'
import LoginPage from './components/user/LoginForm'
import ForgetPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
// import LandingPage from './pages/user/LandingPage'
// import FinancialAdvisorLoginPage from './components/advisor/LoginForm'
// import AdvisorRegisterPage from './components/advisor/RegisterForm'
// import LandingPage from './pages/advisor/LandingPage'
// import AdminLogin from './components/admin/Login'
// import AdminRegister from './components/admin/Register'
// import OTPVerification from './components/user/Otp'



const App = ()=>{
  return (
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OTPVerification/>} />
        <Route path='/forgetPassword' element={<ForgetPassword toggleModal={function (): void {
        throw new Error('Function not implemented.')
      } }/>} />
      <Route path='/resetPassword' element={<ResetPassword/>} />
      </Routes>
  );
}

export default App
