import {Routes,Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './components/user/RegisterForm'
import LandingPage from './pages/user/LandingPage'
import LoginPage from './components/user/LoginForm'
import ResetPassword from './components/user/ResetPassword'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AdvisorLogin from './components/advisor/LoginForm'
import AdvisorRegister from './components/advisor/RegisterForm'
import AdvisorLanding from './pages/advisor/LandingPage'
import AdminLogin from './components/admin/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import Navbar from './layout/layout'
// import HomePage from './pages/user/HomePage'
// import HomePageAd from './pages/advisor/HomePage'
const GOOGLECLIENTID = import.meta.env.VITE_GOOGLECLIENTID


const App = ()=>{
  return (
    <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
      <Navbar/>
      <Routes>
        {/* <Route path='/home' element={<HomePage/>}/> */}
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />} />
      <Route path='/resetPassword' element={<ResetPassword/>} />

      {/* <Route path='/advisor/home' element={<HomePageAd/>}/> */}
      <Route path='/advisor/register' element={<AdvisorRegister/>} />
      <Route path='/advisor/login' element={<AdvisorLogin/>} />
      <Route path='/advisor' element={<AdvisorLanding/>} />
      <Route path='/advisor/resetPassword' element={<ResetPassword/>} />

      <Route path='/admin/login' element={<AdminLogin/>} />      
      <Route path='/admin' element={<AdminDashboard/>} />      
      
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App
