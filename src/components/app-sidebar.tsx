import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";
import { useLocation } from "react-router-dom";

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
                      <a
                        href={item.url}
                        className="flex items-center space-x-6 px-8 py-6 text-lg font-semibold"
                      >
                        <item.icon className="w-8 h-8" />
                        <span>{item.title}</span>
                      </a>
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
