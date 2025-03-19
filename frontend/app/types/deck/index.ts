export interface Deck {
  id?: number;
  name: string;
  description?: string;
  cards: DeckCard[];
}

export interface DeckCard {
  id: number;
  category: string; // pokemon, trainer, energy
  quantity: number;
}
