import React, { useState } from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import FormInput from '../InputField';
import GoogleAuth from '../user/GoogleAuth';
import {
  createUser,
  otpGenerate
} from '../../services/advisor/AuthServices';
import {
  isValidateEmail,
  isValidatePassword,
} from '../../utility/validator';
import useShowToast from '../../customHook/showToaster';
import OTPVerification from './Otp';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}



const AdvisorRegister: React.FC = () => {
  // const navigate = useNavigate();
  const Toaster = useShowToast();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [lastSubmittedValues, setLastSubmittedValues] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

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

    if (!formData.username.trim()) {
      errors.push('Username is required.');
    }

    if (!formData.email) {
      errors.push('Email is required.');
    } else if (!validEmail) {
      errors.push('Invalid email format or domain not allowed.');
    }

    if (!formData.password) {
      errors.push('Password is required.');
    } else if (!validPassword) {
      errors.push(
        'Password must be at least 6 characters long and contain one uppercase letter, one number, and one special character.'
      );
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    return errors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.email === lastSubmittedValues.email &&
      formData.password === lastSubmittedValues.password &&
      formData.confirmPassword === lastSubmittedValues.confirmPassword
    ) {
      if (formSubmitted) {
        toastr.info('No changes detected. Please modify your input.');
      } else {
        toastr.info('Please make changes to submit the form.');
      }
      return;
    }

    setFormSubmitted(true);
    const errors = validateForm()
    
    if (errors.length > 0) {
      errors.forEach((error) => Toaster(error, 'error', true));
      setFormSubmitted(false);
      return;
    }

    try {
      setLoading(true);
      const response = await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response === 'Email is already in use') {
        toastr.error(response);
        setLoading(false);
        return;
      }

      setLastSubmittedValues(formData);

      const res = await otpGenerate(formData.email);
      setLoading(false);

      if (res.message === 'OTP sent successfully') {
        toastr.success('OTP sent successfully');
        setOtpSent(true);
        // navigate('/advisor/otp', { state: { formData } });
      } else {
        toastr.error('Failed to send OTP');
      }
    } catch (error) {
      toastr.error('Registration failed');
      console.error('Registration failed:', error);
      setLoading(false);
    }
  };

  if(otpSent){
    return <OTPVerification email={formData.email} purpose='register' role='advisor'/>
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Briefcase className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Sign up
            </h1>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {otpSent && (
            <div className="bg-green-50 p-4 rounded-md flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">OTP sent successfully!</p>
            </div>
          )}

          <div className="space-y-4">
            <FormInput
              label="Username"
              name='username'
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Email address"
              name='email'
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormInput
              label="password"
              name='password'
              id="password"
              type='password'
              isPassword
              value={formData.password}
              onChange={handleChange}
              required
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={()=>setPasswordVisible}
            />

            <FormInput     
              label="Confirm Password"
              id="confirmPassword"
              name='confirmPassword'
              type='password'
              isPassword
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={()=>setPasswordVisible}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

          <div className="mt-6">
            <div className="flex justify-center mt-4">
              <GoogleAuth role={'advisor'}/>
            </div>
          </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already an advisor? </span>
          <a href="/advisor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdvisorRegister;