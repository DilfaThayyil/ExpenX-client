import React, { useState, FormEvent } from 'react';
import { AlertCircle, Briefcase, PieChart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr'
import "react-toastify/dist/ReactToastify.css";
import FormInput from '../InputField';
import GoogleAuth from '../user/GoogleAuth';
import ForgetPassword from '../advisor/ForgotPassword';
import { userLogin } from '../../services/advisor/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';


const AdvisorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [formSubmitted,setFormSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

 const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
  setFormData({
    ...formData,
    [e.target.name] : e.target.value
  })
 }


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

  const toggleModal = ()=>{
    setIsModalOpen((prev)=>!prev)
  }

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
              value={formData.email}
              onChange={handleChange}
              required

            />

            <FormInput
              label="Password"
              id="password"
              name='password'
              type='password'
              isPassword
              value={formData.password}
              onChange={handleChange}
              required
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={()=>setPasswordVisible}
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
              <GoogleAuth role={'advisor'}/>
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
      {isModalOpen && <ForgetPassword toggleModal={toggleModal} />}
    </div>
  );
};

export default AdvisorLogin;