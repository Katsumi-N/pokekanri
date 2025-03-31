'use server';

import { fetchJwt } from "@/lib/session";
import { Deck, DeckResponse, DeckCardResponse } from "@/types/deck";

export async function fetchDecks(): Promise<{ decks: Deck[], error?: string }> {
  try {
    const jwt = await fetchJwt();
    const response = await fetch(`${process.env.API_BASE_URL}/v1/decks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        decks: [],
        error: `APIエラー: ${response.status} - ${error}`
      };
    }

    const data = await response.json();

    if (!data.decks) {
      return {
        decks: [],
      };
    }
    // data.decksをDeck[]に変換
    const decks: Deck[] = data.decks.map((deck: DeckResponse) => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      mainCard: {
        id: deck.main_card.id,
        category: deck.main_card.category,
        image_url: deck.main_card.image_url,
      },
      subCard: deck.sub_card ? {
        id: deck.sub_card.id,
        category: deck.sub_card.category,
        image_url: deck.sub_card.image_url,
      } : null,
      cards: deck.cards.map((card: DeckCardResponse) => ({
        id: card.id,
        category: card.category,
        quantity: card.quantity,
      })),
    }));

    console.log('Fetched decks:', decks);

    return { decks: decks };
  } catch (error) {
    console.error('Failed to fetch decks:', error);
    return {
      decks: [],
      error: 'デッキ一覧の取得に失敗しました'
    };
  }
}