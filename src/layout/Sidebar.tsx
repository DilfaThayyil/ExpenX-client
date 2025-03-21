import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Calendar, Home, Inbox, Search, Settings, Users, UsersRound, FileWarning, UserCircle } from "lucide-react";

const userMenuItems = [
  { title: "Dashboard", url: "/home", icon: Home },
  { title: "Expenses", url: "/expenses", icon: Inbox },
  { title: "Groups", url: "/groups", icon: Calendar },
  { title: "Slot Booking", url: "/slotBooking", icon: Search },
  { title: "Profile", url: "/profile", icon: Settings },
  { title: "Advisors", url: "/advisors", icon: UserCircle }
];

const advisorMenuItems = [
  { title: "Dashboard", url: "/advisor/home", icon: Home },
  { title: "Appointments", url: "/advisor/slotManage", icon: Calendar },
  { title: "Clients", url: "/advisor/clients", icon: Inbox },
  { title: "Profile", url: "/advisor/profile", icon: Settings },
  // { title: "Profile", url: "/advisor/profile", icon: Search },   
];

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Advisors", url: "/admin/advisors", icon: UsersRound },
  { title: "Categories", url: "/admin/categories", icon: Inbox },
  // { title: "Profile", url: "/admin/profile", icon: Settings },
  { title: "User Reports", url: "/admin/reports", icon: FileWarning }
];


export default function Layout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "user" | "advisor" | "admin"
}) {
  const menuItems =
    role === "advisor" ?
      advisorMenuItems
      : role === "admin"
        ? adminMenuItems
        : userMenuItems;

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar menuItems={menuItems} role={role} />
        <SidebarTrigger />
        <div className="flex-1">
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
