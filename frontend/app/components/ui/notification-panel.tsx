import { getNotifications } from "@/actions/get-notifications";
import { markAllNotificationsAsRead } from "@/actions/mark-notification-read";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { NotificationItem } from "./notification-item";

export async function NotificationPanel() {
  const notifications = await getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationBadge unreadCount={unreadCount}>
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>通知</span>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button 
              variant="ghost" 
              size="sm" 
              type="submit"
              className="text-xs"
            >
              すべて既読にする
            </Button>
          </form>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="max-h-[300px] overflow-y-auto">
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              通知はありません
            </div>
          )}
        </DropdownMenuGroup>
      </div>
    </NotificationBadge>
  );
}
