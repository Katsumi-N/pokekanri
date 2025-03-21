import CardInventory from "@/components/ui/card-inventory";
import { NotificationList } from "@/components/ui/notification-list";

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">通知</h2>
          <NotificationList />
        </div>
        {/* 他のコンテンツ */}
      </div>
    </div>
  );
}
