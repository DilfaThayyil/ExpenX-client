import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  username: string;
}

export function AppSidebar({ menuItems, username }: AppSidebarProps) {
  const router = useLocation()
  const currentPath = router.pathname; 

  return (
    <Sidebar>
      <SidebarContent className="mt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = currentPath === item.url;
              return (
                <SidebarMenuItem
                  key={item.title}
                  className={`rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-emerald-100 text-emerald-600" : "hover:bg-gray-200 text-gray-700"
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
      <SidebarFooter className="mt-auto px-8 py-6">
        <SidebarMenuButton className="flex items-center space-x-4 text-lg font-semibold text-gray-700">
          <User2 className="w-8 h-8 text-emerald-600" />
          <span>{username}</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
