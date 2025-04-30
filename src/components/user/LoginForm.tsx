import React, { useState } from 'react';
import { DollarSign, Wallet } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import toastr from 'toastr';
import "react-toastify/dist/ReactToastify.css";
import { userLogin } from '../../services/user/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from './ForgotPassword';
import GoogleAuth from './GoogleAuth';
import FormInput from '../InputField';
import Store from '@/store/store';
import {Link} from 'react-router-dom'
import { useSearchParams } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((formData)=>({
      ...formData,
      [name]: value,
    }))
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
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
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toastr.error(error));
      return;
    }

    try {
      const response = await userLogin(formData.email, formData.password);
      if (response.message) {
        Store.getState().setUser(response.user2);
        toastr.success(response.message);
        setTimeout(() => {
        if (redirect) {
          navigate(decodeURIComponent(redirect));
        } else {
          navigate("/home");
        }
      }, 1000);
      } else if (response.error) {
        toastr.error(response.error || "Login failed");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorsArray = error.response.data.errors;
        const fieldErrors: { [key: string]: string } = {};
        errorsArray.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
        setFormErrors(fieldErrors);
      } else {
        toastr.error(error.response?.data?.error);
        console.error("Login failed:", error);
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Wallet className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Login
            </h1>
          </div>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="text"
              label="Your email address"     
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              isPassword
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={() => setPasswordVisible(!passwordVisible)}
              error={formErrors.password}
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
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            Sign in
          </button>

          <div className="flex justify-center mt-4">
            <GoogleAuth role={'user'} />
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">New to ExpenX? </span>
            <Link to="/register">
              <a className="font-medium text-emerald-600 hover:text-emerald-500">
                Create an account
              </a>
            </Link>

          </div>
        </form>
        <ToastContainer />

      </div>
      {isModalOpen && <ForgetPassword toggleModal={toggleModal} />}
    </div>
  );
};

export default LoginPage;