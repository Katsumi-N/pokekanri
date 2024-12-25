import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/shadcn/sidebar';
import { Separator } from '@/components/ui/shadcn/separator';
import { Toaster } from "@/components/ui/shadcn/sonner";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CardProvider } from "@/context/CardContext";
import { fetchUserInfo } from '@/utils/supabase/fetchUserInfo';
import { HeaderBreadcrumb } from '@/components/ui/header-breadcrumb';

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
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <CardProvider>
            {children}
          </CardProvider>
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
