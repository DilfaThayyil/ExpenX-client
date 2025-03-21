import { LogOut } from 'lucide-react';
import { useState } from 'react'
import { LogoutDialog } from '@/components/modals/logoutDialogue'
import { adminLogout } from '@/services/admin/adminServices'
import useAdminStore from "@/store/adminStore";
import useShowToast from '@/customHook/showToaster'
import { useNavigate } from "react-router-dom";


export const AdminNavbar = () => {
    const [open, setOpen] = useState(false)
    const Toaster = useShowToast()
    const navigate = useNavigate()
    const handleConfirmLogout = async () => {
        await adminLogout()
        useAdminStore.getState().clearAdminEmail();
        Toaster("Logged out successfully!",'success');
        setTimeout(() => {
          navigate("/admin/login")
        }, 1500);
      };
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 right-0">
            <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                </div>

                <div className="flex items-center">
                    <div className="relative mr-4 hidden md:block">
                    </div>

                    <div className="relative mx-4">
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <LogOut className="w-4 h-4" />
                            </div>
                        </button>
                        <LogoutDialog open={open} onClose={() => setOpen(false)} onConfirm={handleConfirmLogout} />
                    </div>
                </div>
            </div>
        </nav>
    )
}





