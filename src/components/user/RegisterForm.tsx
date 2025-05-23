import React, { useState } from 'react';
import { Wallet, CheckCircle2 } from 'lucide-react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import GoogleAuth from './GoogleAuth';
import FormInput from '../InputField';
import { createUser, otpGenerate } from '../../services/user/AuthServices';
import { isValidateEmail, isValidatePassword, } from '../../utility/validator';
import useShowToast from '../../customHook/showToaster';
import OTPVerification from './Otp';
import {Link} from 'react-router-dom'
import { useSearchParams } from 'react-router-dom';



const RegisterPage = () => {
  const [formData, setFormData] = useState<{
    username: string
    email: string
    password: string
    confirmPassword: string
  }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [params] = useSearchParams();
  const redirect = params.get("redirect");  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lastSubmittedValues, setLastSubmittedValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const Toaster = useShowToast();

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
    const errors = validateForm();

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

      setLastSubmittedValues({
        ...formData
      });


      const res = await otpGenerate(formData.email);
      setLoading(false);

      if (res.message === 'OTP sent successfully') {
        toastr.success('OTP sent successfully');
        setOtpSent(true);
        // navigate('/otp', { state: { formData } });
      } else {
        toastr.error('Failed to send OTP');
      }
    } catch (error) {
      toastr.error('Registration failed');
      console.error('Registration failed:', error);
      setLoading(false);
    }
  };

  if (otpSent) {
    return <OTPVerification email={formData.email} purpose='register' role='user' redirect={redirect}/>
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Wallet className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Sign up
            </h1>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {otpSent && (
            <div className="flex items-center justify-center text-sm text-green-600 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              OTP sent successfully!
            </div>
          )}

          <div className="space-y-4">
            <FormInput
              id="username"
              name="username"
              type="text"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email address"
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

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              isPassword
              passwordVisible={passwordVisible}
              onPasswordVisibilityChange={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading
                ? 'bg-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Google Login */}
        <div className="flex justify-center mt-4">
          <GoogleAuth role={'user'} />
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login">
            <a className="text-emerald-600 hover:underline font-medium">
              Sign in
            </a>
          </Link>

        </p>
      </div>
    </div>
  );
};

export default RegisterPage;