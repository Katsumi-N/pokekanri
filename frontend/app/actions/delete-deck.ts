'use server';

import { fetchJwt } from "@/lib/session";

type DeleteDeckResult = {
  success: boolean;
  error?: string;
};

export async function deleteDeck(deckId: number): Promise<DeleteDeckResult> {
  try {
    const jwt = await fetchJwt();
    const response = await fetch(`${process.env.API_BASE_URL}/v1/decks/delete/${deckId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || `APIエラー: ${response.status}`
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to delete deck:', error);
    return {
      success: false,
      error: '不明なエラーが発生しました'
    };
  }
}