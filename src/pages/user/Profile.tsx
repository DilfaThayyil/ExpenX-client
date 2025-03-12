import React, { useState } from 'react';
import { User, Mail, Phone, Globe, Languages, Target, Edit2, X, UploadCloud ,LogOut} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Layout from '@/layout/Sidebar';
import Store from '@/store/store';
import FormInput from '@/components/InputField';
import Progresss from '@/components/progressBar'
import useShowToast from '@/customHook/showToaster';
import { updateUser, uploadImageToCloudinary } from '@/services/user/userService';
import { userLogout } from '@/services/user/AuthServices'
import GoalsList from '@/components/goals/GoalsList';



interface ExpenseGoal {
  title: string;
  current: number;
  target: number;
  deadline: string;
}

const Profile = () => {

  const Toaster = useShowToast()
  const user = Store(state => state.user)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewPic, setPreviewPic] = useState(user.profilePic)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    username: string
    phone: string
    country: string
    language: string
  }>({
    username: '',
    phone: '',
    country: '',
    language: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.phone.trim()) {
      errors.push('phone is required.');
    }
    if (!formData.country.trim()) {
      errors.push('country is required.');
    }
    if (!formData.language.trim()) {
      errors.push('language is required.');
    }
    return errors;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0])
      setPreviewPic(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach((error) => Toaster(error, 'error', true))
      setFormSubmitted(false)
      return
    }
    try {
      setLoading(true);

      let imageUrl = previewPic;

      if (profilePic) {
        const formData = new FormData();
        formData.append('profilePic', profilePic);
        const response = await uploadImageToCloudinary(formData);
        imageUrl = response.url;
        setLoading(false)
      }

      const updatedUser = await updateUser({
        profilePic: imageUrl,
        username: formData.username,
        email: user.email,
        phone: formData.phone,
        country: formData.country,
        language: formData.language,
      });
      Toaster('Profile updated successfully!', 'success', true);
      // Store.setState({ user: updatedUser });
      Store.getState().setUser(updatedUser);
      setFormData({
        username: '',
        phone: '',
        country: '',
        language: ''
      })
      setLoading(false)
      setIsDrawerOpen(false);
    } catch (error) {
      Toaster(error as string, 'error', true);
      console.error('Update failed:', error);
      setLoading(false);
    }
  }

  const calculateProfileCompletion = () => {
    const fields = Object.values(user);
    const completedFields = fields.filter(field => field && field.length > 0);
    return Math.floor((completedFields.length / fields.length) * 100);
  };


  

  return (
    <Layout role='user'>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Profile Completion Alert */}
        <Alert className="mb-6">
          <AlertDescription className="flex items-center justify-between">
            <span>Profile Completion: {calculateProfileCompletion()}%</span>
            <Progress value={calculateProfileCompletion()} className="w-64" />
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="outline" size="icon" onClick={() => setIsDrawerOpen(true)}>
                <Edit2 className="h-4 w-4 text-emerald-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {/* Profile Image with Edit Icon */}
                <div className="relative">
                  <img
                    src={previewPic}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  {/* Edit Icon */}
                  <button
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-emerald-800 text-white rounded-full shadow-md"
                  >
                    <UploadCloud className="h-5 w-5" />
                  </button>
                  {/* Hidden File Input */}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Other user info sections */}
                <div className="w-full space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>{user.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <span>{user.language || "English"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Goals Card */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Progresss
                        value={(goal.current / goal.target) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>${goal.current.toLocaleString()}</span>
                        <span>${goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant='outline'>Add goal</Button>
            </CardContent>
          </Card> */}
          <GoalsList />
        </div>
        

        {/* Edit Profile Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-emerald-600">Edit Profile</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <FormInput
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* <div>
              <FormInput
                id="email"
                name="email"
                type="text"
                label="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
              </div> */}
                <div>
                  <FormInput
                    id="phone"
                    name="phone"
                    type="text"
                    label="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    id="country"
                    name="country"
                    type="text"
                    label="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    id="language"
                    name="language"
                    type="text"
                    label="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading
                      ? 'bg-emerald-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
                >
                  {loading ? 'Saving Changes..' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;