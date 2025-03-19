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

export interface PokemonAttack {
  name: string;
  required_energy: string;
  damage: string;
  description: string;
}

export interface PokemonCardDetail {
  id: number;
  name: string;
  energy_type: string;
  hp: number;
  ability: string;
  ability_description: string;
  image_url: string;
  regulation: string;
  expansion: string;
  attacks: PokemonAttack[];
}

export interface TrainerCardDetail {
  id: number;
  name: string;
  trainer_type: string;
  description: string;
  image_url: string;
  regulation: string;
  expansion: string;
}

export interface EnergyCardDetail {
  id: number;
  name: string;
  image_url: string;
  description: string;
  regulation: string;
  expansion: string;
}
