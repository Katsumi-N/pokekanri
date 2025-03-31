'use server';

import { fetchJwt } from "@/lib/session";
import { Deck } from "@/types/deck";

export async function fetchDeck(deckId: number): Promise<{ deck: Deck | null, error?: string }> {
  try {
    const jwt = await fetchJwt();
    const response = await fetch(`${process.env.API_BASE_URL}/v1/decks/detail/${deckId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        deck: null,
        error: `APIエラー: ${response.status} - ${error}`
      };
    }

    const data = await response.json();

    // APIからの応答が { deck: {...}, result: true } の形式である場合に対応
    const deckData = data.deck || data;

    return { deck: deckData };
  } catch (error) {
    console.error('Failed to fetch deck:', error);
    return {
      deck: null,
      error: 'デッキの取得に失敗しました'
    };
  }
}