'use server'

import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(id: string) {
  // 将来的にはここでAPIに既読状態を送信
  // await fetch(`/api/v1/users/notification/${id}/read`, { method: 'POST' });
  
  // キャッシュを更新
  revalidatePath('/home');
}

export async function markAllNotificationsAsRead() {
  // 将来的にはここでAPIに全既読状態を送信
  // await fetch('/api/v1/users/notification/read-all', { method: 'POST' });
  
  // キャッシュを更新
  revalidatePath('/home');
}
