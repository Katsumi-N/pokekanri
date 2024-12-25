'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb"

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);
  return (
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
  )
}
