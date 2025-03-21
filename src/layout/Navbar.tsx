import { useState } from 'react';
import {LogoutDialog} from '@/components/modals/logoutDialogue'
import { User, LogOut, Menu, X } from 'lucide-react';
import toastr from 'toastr'
import NotificationBell from '@/components/chat/notificationBell'
import { Button } from "@/components/ui/button";
import { advisorLogout } from '@/services/advisor/AuthServices'
import { userLogout } from '@/services/user/AuthServices'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom'
import Store from '@/store/store'

const Navbar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    role === 'user' ? navigate('/profile') : navigate('/advisor/profile')
  }
  const role = Store((state) => state.user.role)

  const handleConfirmLogout = async () => {
    try {
      if (role === "advisor") {
        await advisorLogout();
      } else {
        await userLogout();
      }
      Store.getState().clearUser();
      localStorage.removeItem("userProfile");
      toastr.success("Logged out successfully!");
      setTimeout(() => {
        window.location.href = role === "advisor" ? "/advisor/login" : "/login";
      }, 1500); 
    } catch (err) {
      toastr.error("Logout failed. Please try again.");
    } finally {
      setOpen(false);
    }
  };
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm h-10 px-4 flex items-center justify-between">
      {/* Logo and site name */}
      <div className="flex items-center space-x-2">
      </div>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-600 dark:text-gray-200 focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size="icon">
                <User className="h-5 w-5 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfileClick}>
                Profile</DropdownMenuItem>
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant='outline'
            onClick={()=>setOpen(true)}
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <LogoutDialog open={open} onClose={() => setOpen(false)} onConfirm={handleConfirmLogout} />

          {/* Profile */}

        </div>
      </div>

      {/* Mobile menu, only shown when menu is open */}
      {mobileMenuOpen && (

        <NotificationBell />

      )}
    </nav>
  );
};

export default Navbar;