import { getNotifications } from "@/actions/get-notifications";
import { markAllNotificationsAsRead } from "@/actions/mark-notification-read";
import { Button } from "@/components/ui/shadcn/button";
import { NotificationListItem } from "./notification-list-item";

export async function NotificationList() {
  const notifications = await getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">
          {unreadCount > 0 ? `${unreadCount}件の未読通知があります` : 'すべての通知を既読にしました'}
        </h3>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button variant="outline" size="sm" type="submit">
              すべて既読にする
            </Button>
          </form>
        )}
      </div>
      
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationListItem key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            通知はありません
          </div>
        )}
      </div>
    </div>
  );
}
