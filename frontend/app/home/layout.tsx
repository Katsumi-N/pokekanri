import { SidebarProvider, SidebarTrigger } from '@/components/ui/shadcn/sidebar';
import { AppSidebar } from "@/components/ui/app-sidebar";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
