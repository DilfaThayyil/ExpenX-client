import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Store from "@/store/store";
import useAdminStore from '@/store/adminStore'
import { AppSidebarProps } from './types'
import expenxLogo from '@/assets/image/Letter E.png'

export function AppSidebar({ menuItems, role }: AppSidebarProps) {
  const router = useLocation();
  const currentPath = router.pathname;
  const user = Store((state) => state.user);
  const adminEmail = useAdminStore((state) => state.adminEmail)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const toggleTheme = () => {
  //   setIsDarkMode((prev) => !prev);
  //   document.documentElement.classList.toggle("dark", !isDarkMode); 
  // };

  return (
    <Sidebar collapsible="icon">
      {/* ExpenX Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <img
          src={expenxLogo}
          alt="ExpenX Logo"
          className="w-16 h-16"
        />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              xpenX
            </span>
          </div>
        )}
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
                    className={`rounded-lg transition-colors duration-200 ${isActive
                      ? "bg-emerald-100 text-emerald-600"
                      : "hover:bg-gray-200 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}>
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
            {!isCollapsed && (
              <>
                <User2 className="w-8 h-8 text-emerald-600" />
                <span>{role === "admin" ? adminEmail : user.username}</span>
              </>
            )}
          </SidebarMenuButton>

          {/* Dark/Light Mode Toggle
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
          </button> */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
