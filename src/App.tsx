import {Routes,Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './components/user/RegisterForm'
import OTPVerification from './components/user/Otp'
import LandingPage from './pages/user/LandingPage'
import LoginPage from './components/user/LoginForm'
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
        <Route path="/otp" element={<OTPVerification />} />
      </Routes>
  );
}

export default App
