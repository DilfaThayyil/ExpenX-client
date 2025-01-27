import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../InputField';
import { isValidateEmail, isValidatePassword } from '../../utility/validator';
import useShowToast from '../../customHook/showToaster';
import { adminLogin } from '../../services/admin/adminServices';
import useAdminStore from '@/store/adminStore'



const AdminLogin: React.FC = () => {
  const setAdminEmail = useAdminStore((state) => state.setAdminEmail)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const Toaster=useShowToast()
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(email);
    const validPassword = isValidatePassword(password);

    if (!email) {
      errors.push('Email is required.');
    } else if (!validEmail) {
      errors.push('Invalid email format or domain not allowed.');
    }

    if (!password) {
      errors.push('Password is required.');
    } else if (!validPassword) {
      errors.push('Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character.');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => Toaster(error,'error',true));
      setLoading(false);
      return;
    }

    try {
      const response=await adminLogin(email,password)
        if(response.error){
            Toaster(response.error,'error',true)
        }else{
          Toaster("admin logged in successfully",'success',true)
          setAdminEmail(email)
          navigate('/admin')
        }

  //       if(response.message){
  //         adminEmail(email)
  //         Toaster(response.message,'success',true)
  //         navigate('/admin')
  //       }
      
    } catch (error) {
      Toaster('Login failed','error',true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div>
            <h3 className="text-2xl font-bold mb-6"> Admin Login</h3>
            <div className="mb-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isPassword={true}
                passwordVisible={showPassword}
                onPasswordVisibilityChange={togglePasswordVisibility}
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;