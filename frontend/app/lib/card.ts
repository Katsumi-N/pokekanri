export interface CardInfo {
  id: number;
  name: string;
  type: string;
  image_url: string;
  hp?: number;
}
  
export interface CardInventoryInfo extends CardInfo {
  quantity: number;
}
  