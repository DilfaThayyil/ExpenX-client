import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
// import LoginPage from './components/user/LoginForm'
import RegisterPage from './components/user/RegisterForm'
import OTPVerification from './components/user/Otp'
// import RegisterPage from './components/user/RegisterForm'
// import LandingPage from './pages/user/LandingPage'
// import FinancialAdvisorLoginPage from './components/advisor/LoginForm'
// import AdvisorRegisterPage from './components/advisor/RegisterForm'
// import LandingPage from './pages/advisor/LandingPage'
// import AdminLogin from './components/admin/Login'
// import AdminRegister from './components/admin/Register'
// import OTPVerification from './components/user/Otp'



const App = ()=>{
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/otp' element={<OTPVerification/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
