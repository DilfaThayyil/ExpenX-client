import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
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

import { Calendar, Home, Inbox, Search, Settings, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Expense Tracker",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Groups",
    url: "/",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="mt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-6 px-8 py-6 text-lg font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      <item.icon className="w-8 h-8 text-emerald-600" /> {/* Larger size for icons */}
                      <span>{item.title}</span> {/* Larger text */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto px-8 py-6">
        <SidebarMenuButton className="flex items-center space-x-4 text-lg font-semibold text-gray-700">
          <User2 className="w-8 h-8 text-emerald-600" /> {/* Larger icon for footer */}
          <span>Username</span> {/* Larger text */}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
