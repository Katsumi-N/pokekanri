import { CardInfo } from "@/lib/card";
import SearchedCardList from "./SearchResultCardList";

interface CardListProps {
  query: string;
  currentPage: number;
}

const fetchCards = async (query: string, page: number): Promise<CardInfo[]> => {
  if (!query) {
    return [];
  }

  try {
    const response = await fetch(`http://localhost:8080/v1/cards/search?q=${query}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const cards: CardInfo[] = [
      ...(data.pokemons?.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.energy_type,
        image_url: pokemon.image_url,
        hp: pokemon.hp
      })) || []),
      ...(data.trainers?.map((trainer: any) => ({
        id: trainer.id,
        name: trainer.name,
        image_url: trainer.image_url
      })) || []),
    ];

    return cards;
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    return [];
  }
}

export default async function SearchCardList({ query, currentPage }: CardListProps) {
  const cards = await fetchCards(query, currentPage);

  return (
    <div className="mb-2 bg-white shadow-md rounded-lg p-4">
      <SearchedCardList cards={cards} />
    </div>
  );
}
