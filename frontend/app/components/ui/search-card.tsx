import { CardInfo } from "@/lib/card";
import SearchResult from "@/components/ui/searh-result";
import { fetchJwt } from "@/lib/session";

interface CardListProps {
  query: string;
  currentPage: number;
  cardType: string;
}

const fetchCards = async (query: string, page: number, cardType: string): Promise<CardInfo[]> => {
  if (!query) {
    return [];
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/v1/cards/search?q=${query}&page=${page}&card_type=${cardType}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const cards: CardInfo[] = [
      ...(data.pokemons?.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        energy_type: pokemon.energy_type,
        category: 'pokemon',
        image_url: pokemon.image_url,
        hp: pokemon.hp
      })) || []),
      ...(data.trainers?.map((trainer: any) => ({
        id: trainer.id,
        name: trainer.name,
        category: 'trainer',
        image_url: trainer.image_url
      })) || []),
    ];

    return cards;
  } catch (error) {
    console.error("Failed to fetch cards:", error);
    return [];
  }
}

export default async function SearchCard({ query, currentPage, cardType }: CardListProps) {
  const cards = await fetchCards(query, currentPage, cardType);
  const jwt = await fetchJwt();
  if (!jwt) {
    return;
  }

  return (
    <SearchResult cards={cards} jwt={jwt} />
  );
}
