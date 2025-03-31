import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/shadcn/sidebar';
import { Separator } from '@/components/ui/shadcn/separator';
import { Toaster } from "@/components/ui/shadcn/sonner";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { DeckProvider } from '@/context/DeckContext';
import { CardProvider } from "@/context/CardContext";
import { fetchUserInfo } from '@/utils/supabase/fetchUserInfo';
import { HeaderBreadcrumb } from '@/components/ui/header-breadcrumb';
import { NotificationPanel } from '@/components/ui/notification-panel'; // 追加

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userInfo = await fetchUserInfo();
  return (
    <SidebarProvider>
      <AppSidebar {...userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <HeaderBreadcrumb />
          <div className="ml-auto flex items-center gap-2">
            <NotificationPanel />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <CardProvider>
            <DeckProvider>
              {children}
            </DeckProvider>
          </CardProvider>
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
