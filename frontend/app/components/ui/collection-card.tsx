import { CardInventoryInfo } from "@/lib/card";
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import CardImageWithQuantity from "./card-image-with-quantity";

const fetchUserCollections = async (): Promise<CardInventoryInfo[]> => {
  const jwt = cookies().get('token')?.value
  if (!jwt) {
    return [];
  }
  
  const response = await fetch(`${process.env.API_BASE_URL}/v1/cards/collections`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    redirect('/error')
  }

  const data = await response.json();
  const cards: CardInventoryInfo[] = [
    ...(data.pokemons.map((pokemon: any) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.energy_type,
      image_url: pokemon.image_url,
      hp: pokemon.hp,
      quantity: pokemon.quantity
    })) || []),
    ...(data.trainers.map((trainer: any) => ({
      id: trainer.id,
      name: trainer.name,
      image_url: trainer.image_url,
      quantity: trainer.quantity
    })) || []),
  ];

  return cards;
}

export default async function UserCollections() {
  const cards = await fetchUserCollections()

  return (
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardImageWithQuantity 
          key={card.id}
          imageUrl={card.image_url}
          quantity={card.quantity}
        />
      ))}
      </div>
  );
}
