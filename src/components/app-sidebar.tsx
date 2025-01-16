import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { User2 } from "lucide-react";

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
  return (
    <Sidebar>
      <SidebarContent className="mt-20">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
          <span>{username}</span> {/* Larger text */}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
