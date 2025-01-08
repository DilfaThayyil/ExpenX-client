import React, { useState } from 'react';
import { AlertCircle, DollarSign, Wallet } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import toastr from 'toastr';
import "react-toastify/dist/ReactToastify.css";
import { userLogin } from '../../services/user/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from './ForgotPassword';
import GoogleAuth from './GoogleAuth';
import FormInput from '../InputField';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // UI state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [lastSubmittedValues, setLastSubmittedValues] = useState({
    email: "",
    password: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(formData.email);
    const validPassword = isValidatePassword(formData.password);

    if (!formData.email) {
      errors.push("Email is required.");
    } else if (!validEmail) {
      errors.push("Invalid email format or domain not allowed.");
    }

    if (!formData.password) {
      errors.push("Password is required.");
    } else if (!validPassword) {
      errors.push(
        "Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character."
      );
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLastSubmittedValues({ ...formData });
    setFormSubmitted(true);
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toastr.error(error));
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await userLogin(formData.email, formData.password);
      if (response.message) {
        console.log(response.userObject);
        toastr.success(response.message);
        setTimeout(() => navigate("/"), 1000);
      } else if (response.error) {
        toastr.error(response.error || "Login failed");
      }
    } catch (error) {
      toastr.error("Login failed");
      console.error("Login failed:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        {/* Header */}
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

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              isPassword
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button 
                type="button"
                onClick={toggleModal} 
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            Sign in to your account
          </button>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center mt-4">
              <GoogleAuth />
            </div>
          </div>
        </form>
        
        <ToastContainer />

        {/* Register Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">New to ExpenX? </span>
          <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Create an account
          </a>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {isModalOpen && <ForgetPassword toggleModal={toggleModal} />}
    </div>
  );
};

export default LoginPage;