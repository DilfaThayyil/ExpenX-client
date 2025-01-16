import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

const userMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Expense Tracker", url: "/expenses", icon: Inbox },
  { title: "Groups", url: "/groups", icon: Calendar },
  { title: "Profile", url: "/profile", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

const advisorMenuItems = [
  { title: "Advisor Dashboard", url: "/advisor/dashboard", icon: Home },
  { title: "Client Management", url: "/advisor/clients", icon: Inbox },
  { title: "Appointments", url: "/advisor/appointments", icon: Calendar },
  { title: "Advisor Profile", url: "/advisor/profile", icon: Search },
  { title: "Advisor Settings", url: "/advisor/settings", icon: Settings },
];

export default function Layout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "user" | "advisor";
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
