export interface Deck {
  id?: number;
  name: string;
  description?: string;
  cards: DeckCard[];
  mainCard?: DeckCard;
  subCard?: DeckCard;
}

export interface DeckCard {
  id: number;
  name: string;
  image_url: string;
  category: string; // pokemon, trainer, energy
  quantity: number;
}
