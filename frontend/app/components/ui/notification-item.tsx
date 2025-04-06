'use client';

import { markNotificationAsRead } from "@/actions/mark-notification-read";
import { DropdownMenuItem } from "@/components/ui/shadcn/dropdown-menu";
import { Notification } from "@/types/notification";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <DropdownMenuItem
      className={cn(
        "flex flex-col items-start p-3 cursor-pointer",
        !notification.read && "bg-muted/50"
      )}
      onClick={() => {
        if (!notification.read) {
          markNotificationAsRead(notification.id);
        }
      }}
    >
      <div className="flex w-full justify-between">
        <span className="font-medium">{notification.title}</span>
        {!notification.read && (
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
      <span className="text-xs text-muted-foreground mt-2">
        {new Date(notification.timestamp).toLocaleString('ja-JP')}
      </span>
    </DropdownMenuItem>
  );
}
