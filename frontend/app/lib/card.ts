export interface CardInfo {
  id: number;
  name: string;
  energy_type: string;
  category: string;
  image_url: string;
  hp?: number;
}
  
export interface CardInventoryInfo extends CardInfo {
  quantity: number;
}
  