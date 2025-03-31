import { Notification } from "@/types/notification";

// モックデータ（将来的にはAPIから取得）
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '新機能のお知らせ',
    message: 'デッキビルダー機能が追加されました！',
    timestamp: '2025-03-20T10:00:00',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'メンテナンス予定',
    message: '明日の午前2時から4時までメンテナンスを行います。',
    timestamp: '2025-03-19T15:30:00',
    read: true,
    type: 'warning'
  }
];

export async function getNotifications(): Promise<Notification[]> {
  // 将来的にはここでAPIからデータを取得
  // const response = await fetch('/api/v1/users/notification');
  // const data = await response.json();
  // return data;
  
  // 現在はモックデータを返す
  return mockNotifications;
}
