import React, { useState, FormEvent } from 'react';
import { AlertCircle, Briefcase, PieChart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormInput from '../InputField';
import GoogleAuth from '../user/GoogleAuth';
import ForgetPassword from '../user/ForgotPassword';
import { userLogin } from '../../services/advisor/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';

interface FormErrors {
  email?: string;
  password?: string;
}

const FinancialAdvisorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidateEmail(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isValidatePassword(password)) {
      errors.password = 'Password must be at least 8 characters with one uppercase, one number, and one special character';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await userLogin(email, password);
      if (response.message) {
        toast.success(response.message);
        setTimeout(() => navigate("/advisor"), 1000);
      } else if (response.error) {
        toast.error(response.error || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Briefcase className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              ExpenX
            </h1>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Financial Advisor Login
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              label="Your email address"
              id="email"
              name='email'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required

            />

            <FormInput
              label="Password"
              id="password"
              name='password'
              type='password'
              isPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={()=>setPasswordVisible}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/advisor/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PieChart className="h-4 w-4" />
            Sign in
          </button>

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
              <GoogleAuth />
            </div>
          </div>
        </form>
        <ToastContainer />

        <div className="text-center text-sm">
          <span className="text-gray-600">New to ExpenX Advisors? </span>
          <a href="/advisor/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create an account
          </a>
        </div>
      </div>
      {isModalOpen && <ForgetPassword toggleModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default FinancialAdvisorLoginPage;