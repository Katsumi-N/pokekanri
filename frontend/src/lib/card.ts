export interface Card {
    id: number;
    name: string;
    type: string;
    hp: number;
  }
  
  export interface DeckCard extends Card {
    quantity: number;
  }
  
  export const masterCards: Card[] = [
    { id: 1, name: "Pikachu", type: "Electric", hp: 35 },
    { id: 2, name: "Bulbasaur", type: "Grass", hp: 45 },
    // 他のカードデータ
  ];
  