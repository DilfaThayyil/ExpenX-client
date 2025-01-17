import React, { useState } from 'react';
import { Eye,EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/user/AuthServices';
import {resetPasswordAdv} from '../../services/advisor/AuthServices'
import toastr from 'toastr';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email || '';
  const role = location?.state?.role || ''
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible,setPasswordVisible] = useState(false)

  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(email);
    const validPassword = isValidatePassword(password);

    if (!validEmail) {
      errors.push("Invalid email format or domain not allowed.");
    }

    if (!validPassword) {
      errors.push(
        "Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character."
      );
    }

    return errors;
  } 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toastr.error('Passwords do not match');
      return;
    }
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toastr.error(error));
      return;
    }

    try {
      setLoading(true);
      console.log("email : ", email);
      console.log("password : ",password)
      if(role==='user'){
        const response = await resetPassword(email, password);
        if (response?.success) {
          toastr.success('Password reset successfully');
          navigate('/login');
        } else {
          toastr.error(response?.message || 'Failed to reset password');
        }
      }else{
        const response = await resetPasswordAdv(email, password);
        if (response?.success) {
          toastr.success('Password reset successfully');
          navigate('/advisor/login');
        } else {
          toastr.error(response?.message || 'Failed to reset password');
        }
      }
    } catch (error: any) {
      toastr.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        <h2 className="text-center text-2xl font-bold text-gray-900">Reset Password</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={passwordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
