export interface CardInfo {
  id: number;
  name: string;
  type: string;
  hp?: number;
}
  
export interface DeckCard extends CardInfo {
  quantity: number;
}
  
export const masterCards: CardInfo[] = [
  { id: 1, name: "ピカチュウ", type: "雷", hp: 40 },
  { id: 2, name: "ライチュウ", type: "雷", hp: 100 },
  { id: 3, name: "ピカチュウex", type: "雷", hp: 100 },
  { id: 4, name: "ハイパーボール", type: "グッズ" },
  { id: 5, name: "ピカチュウexピカチュウexピカチュウex", type: "雷", hp: 100 },
  // 他のカードデータ
];
  