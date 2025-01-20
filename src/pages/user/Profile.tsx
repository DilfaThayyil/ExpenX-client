import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Settings, PieChart, Users, LogOut,
  CheckCircle, Edit,
  UploadCloud
} from 'lucide-react';
import Layout from '@/layout/Sidebar';
import Store from '@/store/store';
import { FaLanguage, FaLocationDot } from 'react-icons/fa6';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import FormInput from '@/components/InputField';
import ImageUploader from '@/components/imageUploader';



// Types
interface RecentActivity {
  id: number;
  type: string;
  description: string;
  amount: number;
  timestamp: string;
}

export const Profile = () => {
  const user = Store(state => state.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen,setEditModalOpen] = useState(false)
  const [formData,setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
    language: user.language || 'English',
    country: user.country || 'india',
    profilePic: user.profilePic || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (uploadedImage: string) => {
    setFormData({ ...formData, profilePic: uploadedImage });
  };
  

  const recentActivity: RecentActivity[] = [
    { id: 1, type: "expense", description: "Groceries at Walmart", amount: 85.50, timestamp: "2 hours ago" },
    { id: 2, type: "group", description: "Split dinner bill with roommates", amount: 45.00, timestamp: "Yesterday" },
    { id: 3, type: "payment", description: "Utility bill payment", amount: 120.00, timestamp: "2 days ago" },
  ];

  return (
    <Layout role="user">
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profilePic} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <CheckCircle className="text-emerald-600 w-5 h-5" />
              </div>
              <p className="text-gray-600">{user.email}</p>
              <button className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                onClick={()=>setEditModalOpen(true)}>
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
              <hr className="my-6 border-t border-gray-300" />
              <div className="flex items-center text-gray-700">
                <FaLanguage className="mr-3" />
                <p>{user.language ? user.language : "English"}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <FaLocationDot className="mr-3" />
                <p>{user.country ? user.country : ""}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <MdOutlineMailOutline className="mr-3" />
                <p>{user.email}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <FaPhoneAlt className="mr-3" />
                <p>{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="bg-white p-1 rounded-lg shadow-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" /> Expenses
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Groups
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-emerald-600">
                      {/* ${user.totalExpenses.toLocaleString()} */}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Active Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">
                      {/* {user.activeGroups} */}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Settlements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-amber-600">
                      {/* ${user.pendingSettlements} */}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.timestamp}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${activity.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
              <div className="mt-4 space-y-4">
              <div className="flex flex-col items-center">
                  <div className="relative">
                  <ImageUploader
                    initialImage={formData.profilePic} 
                    onImageUpload={handleImageUpload} 
                  />
                  </div>
                </div>
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
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="phone"
                  name="phone"
                  type="text"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <FormInput
                  id="language"
                  name="language"
                  type="text"
                  label="Language"
                  value={formData.language}
                  onChange={handleChange}
                />
                <FormInput
                  id="country"
                  name="country"
                  type="text"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                  
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
