'use server';

import { fetchJwt } from "@/lib/session";
import type { Deck, CreateDeckRequest } from "@/types/deck";

type SaveDeckResult = {
  success: boolean;
  error?: string;
};

export async function saveDeck(deck: Deck): Promise<SaveDeckResult> {
  try {
    // デッキデータをAPIに送信する形式に変換する
    const createDeckRequest: CreateDeckRequest = {
      name: deck.name,
      description: deck.description,
      main_card: {
        id: Number(deck.mainCard.id),
        category: deck.mainCard.category as "pokemon" | "trainer" | "energy"
      },
      cards: deck.cards.map(card => ({
        id: Number(card.id),
        category: card.category as "pokemon" | "trainer" | "energy",
        quantity: Number(card.quantity)
      }))
    };

    if (deck.subCard) {
      createDeckRequest.sub_card = {
        id: Number(deck.subCard.id),
        category: deck.subCard.category as "pokemon" | "trainer" | "energy"
      };
    }

    const jwt = await fetchJwt();
    const response = await fetch(`${process.env.API_BASE_URL}/v1/decks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(createDeckRequest)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('デッキの保存に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}
