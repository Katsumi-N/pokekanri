export interface Deck {
  id?: number;
  name: string;
  description?: string;
  cards: DeckCardWithQuantity[];
  mainCard: DeckCard;
  subCard?: DeckCard | null;
}

export interface DeckCard {
  id: number;
  name: string;
  image_url: string;
  category: "pokemon" | "trainer" | "energy";
}

export interface DeckCardWithQuantity extends DeckCard {
  quantity: number;
}

export interface CreateDeckRequest {
  name: string;
  description?: string;
  main_card: CreateDeckMainSubCard;
  sub_card?: CreateDeckMainSubCard;
  cards: CreateDeckCard[];
}

interface CreateDeckMainSubCard {
  id: number;
  category: "pokemon" | "trainer" | "energy";
}

export interface CreateDeckCard {
  id: number;
  category: "pokemon" | "trainer" | "energy";
  quantity: number;
}

export interface DeckListResponse {
  decks: Deck[];
}
export interface DeckResponse {
  id: number;
  name: string;
  description: string;
  main_card: DeckCard;
  sub_card?: DeckCard | null;
  cards: DeckCardWithQuantity[];
}

export interface DeckCardResponse {
  id: number;
  name: string;
  image_url: string;
  category: "pokemon" | "trainer" | "energy";
  quantity: number;
}