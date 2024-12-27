import React, { useState } from 'react';
import { AlertCircle, Wallet, CheckCircle2 } from 'lucide-react';
import toastr from 'toastr';
// import {
//   createUser,
//   otpGenerate,
// } from '../../../api/user/AuthuserServices'; 
// import {
//   isValidateEmail,
//   isValidatePassword,
// } from '../../../utility/Validator';
// import useShowToast from '../../../Custom Hook/showToaster';



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
  })
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [lastSubmittedValues, setLastSubmittedValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState<boolean>(false)
  // const [otpSent, setOtpSent] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({...formData,[e.target.name]: e.target.value,})}

  const validateForm = () => {
    const errors: string[] = []
    const validEmail = formData.email
    const validPassword = formData.password

    if (!formData.email) {
      errors.push('Email is required.')
    } else if (!validEmail) {
      errors.push('Invalid email format or domain not allowed.');
    }

    if (!formData.password) {
      errors.push('Password is required.')
    } else if (!validPassword) {
      errors.push(
        'Password must be at least 6 characters long and contain one uppercase letter, one number, and one special character.'
      )
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.')
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
        email: formData.email,
        password: formData.password,
      });

      if (response === 'Email is already in use') {
        toastr.error(response);
        setLoading(false);
        return;
      }

      setLastSubmittedValues({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const res = await otpGenerate(formData.email);
      setLoading(false);

      if (res.message === 'OTP sent successfully') {
        toastr.success('OTP sent successfully');
        setOtpSent(true);
      } else {
        toastr.error('Failed to send OTP');
      }
    } catch (error) {
      toastr.error('Registration failed');
      console.error('Registration failed:', error);
      setLoading(false);
    }
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start tracking expenses and splitting bills with friends
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {otpSent && <p className="text-green-500 text-center">OTP sent successfully!</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Create Account
          </button>
        </form>

        <div className="flex items-center mt-4">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3 text-sm text-gray-600">or register with</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <button
          className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img
            src="/path-to-google-logo.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Register with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/sign-in"
            className="text-emerald-600 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          By registering, you agree to our{' '}
          <a
            href="/terms-of-service"
            className="text-gray-600 hover:underline"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className="text-gray-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
