import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "@/store/adminStore";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {adminLogout} from '@/services/admin/adminServices'
import ReportTable from "@/components/admin/ReportTable";


const AdminProfile = () => {
  const navigate = useNavigate();
  const adminEmail = useAdminStore((state) => state.adminEmail);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = async() => {
    const response = await adminLogout()
    console.log("response : ",response)
    useAdminStore.getState().clearAdminEmail();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/admin/login")
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <ToastContainer />
      <div className="flex items-center space-x-6">
        <img
          src="https://static.vecteezy.com/system/resources/previews/043/900/708/non_2x/user-profile-icon-illustration-vector.jpg"
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-300"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-gray-800">Admin Profile</h1>
          <p className="text-gray-600">admin</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-lg text-gray-800">{adminEmail}</p>

        <div className="mt-6 flex items-center space-x-4">
          <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
            <DialogTrigger asChild>
              <Button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Logout
              </Button>
            </DialogTrigger>

            <DialogContent>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-white rounded-lg shadow-lg"
              >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to log out? You will be redirected to the login page.
                </DialogDescription>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmLogout}>
                    Logout
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ReportTable/>
    </div>
  );
};

export default AdminProfile;
