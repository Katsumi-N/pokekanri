'use client';

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useState } from "react";

interface NotificationBadgeProps {
  unreadCount: number;
  children: React.ReactNode;
}

export function NotificationBadge({ unreadCount, children }: NotificationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
