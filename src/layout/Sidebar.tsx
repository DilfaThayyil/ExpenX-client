import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1">
          <main className="p-4"><SidebarTrigger/>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
