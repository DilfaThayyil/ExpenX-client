import React, { useState } from 'react';
import useAdminStore from '@/store/adminStore'
import FormInput from '@/components/InputField'
import { isValidateEmail, isValidatePassword } from '@/utility/validator'
import { updateAdmin } from '@/services/admin/adminServices'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminProfile = () => {

  const adminEmail = useAdminStore((state) => state.adminEmail);
  const adminName = useAdminStore((state) => state.adminName);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>(adminName)
  const [email, setEmail] = useState<string>(adminEmail);
  const [password, setPassword] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)



  const validateForm = () => {
    const errors: string[] = [];
    const validEmail = isValidateEmail(email);
    const validPassword = isValidatePassword(password);

    if (!name) {
      errors.push("Name is required. ")
    } else if (name.length < 3) {
      errors.push("at least 3 characters required. ")
    }

    if (!email) {
      errors.push("Email is required.");
    } else if (!validEmail) {
      errors.push("Invalid email format or domain not allowed.");
    }

    if (!password) {
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
      errors.forEach((error) => toast.error(error));
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await updateAdmin(name, email, password);
      console.log("response : ", response)
      if (response) {
        useAdminStore.getState().setAdminEmail(response.email)
        useAdminStore.getState().setAdminName(response.username)
        toast.success('profile updated successfully')
        setIsEditing(false)
      } else {
        toast.error('Failed to update profile , please try again.')
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('An error occurred while updating profile.')
    } finally {
      setFormSubmitted(false)
    }
  };


  const handleCancel = () => {
    setName(adminName);
    setEmail(adminEmail);
    setPassword("");
    setIsEditing(false);
  }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <ToastContainer />
        <div className="flex items-center space-x-6">
          <img
            src={'https://static.vecteezy.com/system/resources/previews/043/900/708/non_2x/user-profile-icon-illustration-vector.jpg'}
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-300"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-800">Admin Profile</h1>
            <p className="text-gray-600">admin</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            {isEditing ? (
              <FormInput
                id='username'
                name='username'
                type="username"
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            ) : (
              <p className="text-lg text-gray-800">{name}</p>
            )}
          </div>
          <div className="mb-4">
            {isEditing ? (
              <FormInput
                id='email'
                name='email'
                type="email"
                label='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <p className="text-lg text-gray-800">{email}</p>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isPassword
                passwordVisible={passwordVisible}
                onPasswordVisibilityChange={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
          )}

          <div className="mt-6 flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default AdminProfile;
