export interface Deck {
  id?: number;
  name: string;
  description?: string;
  cards: DeckCardWithQuantity[];
  mainCard?: DeckCard;
  subCard?: DeckCard;
}

export interface DeckCard {
  id: number;
  name: string;
  image_url: string;
  category: string; // pokemon, trainer, energy
}

export interface DeckCardWithQuantity extends DeckCard {
  quantity: number;
}