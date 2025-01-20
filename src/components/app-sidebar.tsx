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
import { User2, Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Store from "@/store/store";
import { useState } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
}

export function AppSidebar({ menuItems }: AppSidebarProps) {
  const router = useLocation();
  const currentPath = router.pathname;
  const user = Store((state) => state.user);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark", !isDarkMode); // Example toggle for Tailwind dark mode
  };

  return (
    <Sidebar>
      {/* ExpenX Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <img
          src="/src/assets/Letter E.png"
          alt="ExpenX Logo"
          className="w-16 h-16"
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            xpenX
          </span>
        </div>
      </div>

      <SidebarContent className="mt-6">

        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-emerald-100 text-emerald-600"
                        : "hover:bg-gray-200 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className="flex items-center space-x-8 px-8 py-6 text-2xl font-bold"
                      >
                        <item.icon className="w-12 h-12 text-emerald-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="mt-auto px-8 py-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <SidebarMenuButton className="flex items-center space-x-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <User2 className="w-8 h-8 text-emerald-600" />
            <span>{user.username}</span>
          </SidebarMenuButton>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
