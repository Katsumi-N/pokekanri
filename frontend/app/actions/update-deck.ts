'use server';

import { fetchJwt } from "@/lib/session";
import type { Deck, CreateDeckRequest } from "@/types/deck";

type UpdateDeckResult = {
  success: boolean;
  error?: string;
};

export async function updateDeck(deckId: number, deck: Deck): Promise<UpdateDeckResult> {
  try {
    // デッキデータをAPIに送信する形式に変換する
    const updateDeckRequest: CreateDeckRequest = {
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
      updateDeckRequest.sub_card = {
        id: Number(deck.subCard.id),
        category: deck.subCard.category as "pokemon" | "trainer" | "energy"
      };
    }

    const jwt = await fetchJwt();
    const response = await fetch(`${process.env.API_BASE_URL}/v1/decks/edit/${deckId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(updateDeckRequest)
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
    console.error('Failed to update deck:', error);
    return {
      success: false,
      error: '不明なエラーが発生しました'
    };
  }
}