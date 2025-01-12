import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, createUser, handleforgetpasswordOtp, resendOtp } from '../../services/advisor/AuthServices';
import toastr from 'toastr';

interface otpProps{
  email:string
  purpose:string
  role:'user'|'advisor'
}

const OTPVerification:React.FC<otpProps> = ({email,purpose,role}) => {
  // const location = useLocation()
  // const formData = location.state?.formData
  // const email = location.state?.email || ''
  // const purpose = location.state?.purpose || ''
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);  
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      console.log("calling resendOtp...")
      const res = await resendOtp(email)
      console.log("response from resendOtp : ",res)
      toastr.success(res.message);
      setTimeLeft(60);
      setTimeout(() => setIsResending(false), 1000); 
    } catch (error) {
      toastr.error('Failed to resend OTP.');
      console.error('Resend OTP Error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; 
    setLoading(true);

    try {
      const enteredOtp = otp.join('');
      console.log("forgotPassword email : ", email)
      console.log("forgotPassword purpose : ",purpose)
      console.log("email & otp : ",email,enteredOtp)
      const res = purpose==='forgotPassword'
        ? await handleforgetpasswordOtp(email,enteredOtp)
        : await verifyOtp(email,enteredOtp)
        console.log("response : ", res)
        if(res){
          if(purpose==='forgotPassword' && res?.message==='OTP verified successfully'){
            toastr.success('OTP verified successfully')
            navigate('/resetPassword',{state:{email,role}})
          }
          else if(res?.message === 'User registered successfully') {
              toastr.success('User registered successfully');
              navigate('/advisor/login');
          }
        }
    } catch (error: any) {
      // Check for specific error messages
      if (error.response?.status === 404) {
        toastr.error('No OTP record found for this email.');
      } else if (error.response?.status === 400) {
        toastr.error('The OTP you entered is incorrect.');
      } else if (error.response?.status === 410) {
        toastr.error('The OTP has expired. Please request a new one.');
      } else {
        // Generic fallback error
        toastr.error(error.response?.data?.message || 'Failed to verify OTP');
      }
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-emerald-100">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Wallet className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              ExpenX
            </h1>
          </div>
          <div className="mt-6 flex justify-center items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              OTP Verification
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the code
          </p>
        </div>

        {/* OTP Input */}
        <div className="mt-8">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              We sent the verification code to your email{' '}
              <span className="font-medium">*****@gmail.com</span>
            </p>
            <p className="mt-2">
              Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || isResending}
              className="text-indigo-600 hover:text-indigo-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : "I didn't receive the code? Send again"}
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <div className="mt-8">
          <button
            onClick={handleOtpSubmit}
            disabled={otp.some(digit => !digit) || loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Shield className="h-4 w-4" />
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
