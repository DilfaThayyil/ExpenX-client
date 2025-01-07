import React, { useState } from 'react';
import { AlertCircle, DollarSign, Wallet, Eye, EyeOff } from 'lucide-react';
import { ToastContainer,toast } from 'react-toastify';
import toastr from 'toastr';
import "react-toastify/dist/ReactToastify.css";
import { userLogin } from '../../services/user/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from './ForgotPassword';
import GoogleAuth from './GoogleAuth';


const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible,setPasswordVisible] = useState(false)
  const [lastSubmittedValues,setLastSubmittedValues] = useState<{
    email : string;
    password : string;
  }>({email:"",password:""})
  const [formSubmitted,setFormSubmitted] = useState<boolean>(false)
  const [error,setError] = useState("")
  const [isModalOpen,setIsModalOpen] = useState(false)


  const validateForm = ()=>{
    const errors : string[]=[]
    const validEmail = isValidateEmail(email)
    const validPassword = isValidatePassword(password)
    if (!email) {
      errors.push("Email is required.");
    } else if (!validEmail) {
      errors.push("Invalid email format or domain not allowed.");
    }

    if (!password) {
      errors.push("Password is required.");
    } else if (!validPassword) {
      errors.push(
        "Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character."
      );
    }

    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
      setLastSubmittedValues({ email, password });
  
      // if (
      //   email === lastSubmittedValues.email &&
      //   password === lastSubmittedValues.password
      // ) {
      //   if (formSubmitted) {
      //     toastr.info("No changes detected. Please modify your input.");
      //   } else {
      //     toastr.info("Please make changes to submit the form.");
      //   }
      //   return;
      // }
  
      setFormSubmitted(true);
      const errors = validateForm();
      if (errors.length > 0) {
        errors.forEach((error) => toastr.error(error))
        setFormSubmitted(false);
        return;
      }
  
      try {
        const response = await userLogin(email, password);
        if (response.message) {
          // setUser(response.userObject);
          console.log(response.userObject)
          toastr.success(response.message)
          setTimeout(() => navigate("/"), 1000);
        } else if (response.error) {
          toastr.error(response.error || "Login failed")
        }
      } catch (error) {
        toastr.error("login failed")
        console.error("Login failed:", error);
        // setLoading(false);
      }
    };
  
    const toggleModal = () => {
      setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Wallet className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              ExpenX
            </h1>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Track expenses, split bills, save money
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Your email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">

            <div className="text-sm">
              <button onClick={toggleModal} className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot your password?
              </button>
            </div>
            
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              Sign in to your account
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <GoogleAuth/>
            </div>
          </div>
        </form>
        <ToastContainer/>

        <div className="text-center text-sm">
          <span className="text-gray-600">New to ExpenX? </span>
          <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Create an account
          </a>
        </div>
      </div>
      {isModalOpen && <ForgetPassword toggleModal={toggleModal} />}
    </div>
  );
};

export default LoginPage;