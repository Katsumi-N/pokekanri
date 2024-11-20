import { SidebarProvider, SidebarTrigger } from '@/components/ui/shadcn/sidebar';
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CardProvider } from "@/context/CardContext";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4">
        <CardProvider>
          <SidebarTrigger />
          {children}
        </CardProvider>
      </main>
    </SidebarProvider>
  );
}
