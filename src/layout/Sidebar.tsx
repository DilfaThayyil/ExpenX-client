import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

const userMenuItems = [
  { title: "Dashboard", url: "/home", icon: Home },
  { title: "Expenses", url: "/expenses", icon: Inbox },
  { title: "Groups", url: "/groups", icon: Calendar },
  { title: "Advisors", url: "/advisors", icon: Search },
  { title: "Profile", url: "/profile", icon: Settings },
];

const advisorMenuItems = [
  { title: "Dashboard", url: "/advisor/home", icon: Home },
  { title: "Clients", url: "/advisor/clients", icon: Inbox },
  { title: "Appointments", url: "/advisor/appointments", icon: Calendar },
  { title: "Profile", url: "/advisor/profile", icon: Settings },
  // { title: "Profile", url: "/advisor/profile", icon: Search },
];

     
export default function Layout({
  children,
  role,
}: {  
  children: React.ReactNode;
  role: "user" | "advisor"
}) {
  const menuItems = role === "advisor" ? advisorMenuItems : userMenuItems;
  const username = role === "advisor" ? "Advisor Name" : "User Name";

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar menuItems={menuItems} username={username} />
        <div className="flex-1">
          <main className="p-4">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
