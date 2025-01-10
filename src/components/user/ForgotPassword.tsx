import React, { useState } from 'react';
import { handleforgetpassword } from '../../services/user/AuthServices';
import toastr from 'toastr';
import { isValidateEmail } from '../../utility/validator';
import Loading from '../../style/loading';
// import Otp from '../user/Otp';
import { useNavigate } from 'react-router-dom';
import OTPVerification from './Otp';


interface ForgetPasswordProps {
  toggleModal: () => void;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ toggleModal }) => {

  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(email.trim()==''){
      return toastr.error('Email is Required')
    }
    const emailvalidation=isValidateEmail(email)
    if(!emailvalidation){
      return toastr.error('Please Enter valid email')
    }
    setLoading(true);
    try {
     const response= await handleforgetpassword(email);
     setLoading(false);
     if(response.message){
      toastr.success(response.message)
      setShowOtp(true)
     }else{
      toastr.error(response.error)
     }
    } catch (err) {
      setLoading(false);
      toastr.error('An error occurred');
      console.log(err);
    }
  }


  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-gray-900 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-black">
              Reset your password
            </h3>
            <button
              type="button"
              onClick={toggleModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="youremail@gmail.com"
                  
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loading />
          </div>
        )}
        {showOtp&& (
            <div className="fixed inset-0 flex items-center justify-center bg-white ">
            <OTPVerification email={email} purpose='forgotPassword'/>
          </div>
        )}
    </div>
  );
};

export default ForgetPassword;
