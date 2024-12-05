'use client';

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/shadcn/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb"
import { Separator } from '@/components/ui/shadcn/separator';
import { Toaster } from "@/components/ui/shadcn/sonner";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CardProvider } from "@/context/CardContext";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const href = '/' + pathSegments.slice(0, index + 1).join('/');
                return (
                  <>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
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
