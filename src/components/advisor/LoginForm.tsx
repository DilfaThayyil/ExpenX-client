import React, { useState } from 'react';
import { Briefcase, PieChart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import toastr from 'toastr'
import "react-toastify/dist/ReactToastify.css";
import FormInput from '../InputField';
import GoogleAuth from '../user/GoogleAuth';
import ForgetPassword from '../advisor/ForgotPassword';
import { userLogin } from '../../services/advisor/AuthServices';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';
import Store from '@/store/store';



const AdvisorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = Store()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((formData) => ({
      ...formData,
      [name]: value
    }))
    setFormErrors((prev) => ({
      ...prev,
      [name]: ''
    }))
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
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toastr.error(error));
      return;
    }

    try {
      const response = await userLogin(formData.email, formData.password);
      if (response.message) {
        setUser(response.user2)
        toast.success(response.message);
        setTimeout(() => navigate("/advisor/home"), 1000);
      } else if (response.error) {
        toast.error(response.error || "Login failed");
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
    setIsModalOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Briefcase className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Login
            </h1>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              label="Your email address"
              id="email"
              name='email'
              type="text"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />

            <FormInput
              label="Password"
              id="password"
              name='password'
              type='password'
              isPassword
              value={formData.password}
              onChange={handleChange}
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
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PieChart className="h-4 w-4" />
            Sign in
          </button>

          <div className="flex justify-center mt-4">
            <GoogleAuth role={'advisor'} />
          </div>
          <div className="text-center text-sm">
            <span className="text-gray-600">New to ExpenX Advisors? </span>
            <Link to='/advisor/register'>
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
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

export default AdvisorLogin;