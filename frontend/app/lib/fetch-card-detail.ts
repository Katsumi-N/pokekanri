import { cookies } from 'next/headers';

export async function fetchCardDetail(cardType: string, id: number) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/v1/cards/detail/${cardType}/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`カード詳細の取得に失敗しました: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("カード詳細取得エラー:", error);
    throw error;
  }
}
