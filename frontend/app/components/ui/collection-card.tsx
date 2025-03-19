import { CardInventoryInfo } from "@/lib/card";
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import CardImageWithQuantity from "./card-image-with-quantity";
import { shouldLoginAlert } from "./should-login";

const fetchUserCollections = async (): Promise<CardInventoryInfo[] | null> => {
  const jwt = cookies().get('token')?.value
  if (!jwt) {
    return null;
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
    ...(data.pokemons?.map((pokemon: any) => ({
      id: pokemon.card_id,
      name: pokemon.card_name,
      energy_type: pokemon.energy_type,
      category: "pokemon",
      image_url: pokemon.image_url,
      hp: pokemon.hp,
      quantity: pokemon.quantity
    })) || []),
    ...(data.trainers?.map((trainer: any) => ({
      id: trainer.card_id,
      name: trainer.card_name,
      category: "trainer",
      energy_type: "",
      image_url: trainer.image_url,
      quantity: trainer.quantity
    })) || []),
    ...(data.energies?.map((energy: any) => ({
      id: energy.card_id,
      name: energy.card_name,
      category: "energy",
      energy_type: "",
      image_url: energy.image_url,
      quantity: energy.quantity
    })) || []),
  ];

  return cards;
}

export default async function UserCollections() {
  const cards = await fetchUserCollections()

  if (cards === null) {
    return shouldLoginAlert();
  }

  return (
    <div className="grid justify-items-start grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
      {cards.map((card) => (
        <CardImageWithQuantity 
          key={card.id}
          imageUrl={card.image_url}
          quantity={card.quantity}
          cardId={card.id}
          cardType={card.category}
        />
      ))}
    </div>
  );
}
