'use client';

import { markNotificationAsRead } from "@/actions/mark-notification-read";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationListItemProps {
  notification: Notification;
}

export function NotificationListItem({ notification }: NotificationListItemProps) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 cursor-pointer",
        !notification.read && "bg-muted/50"
      )}
      onClick={() => {
        if (!notification.read) {
          markNotificationAsRead(notification.id);
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        </div>
        {!notification.read && (
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {new Date(notification.timestamp).toLocaleString('ja-JP')}
      </div>
    </div>
  );
}
