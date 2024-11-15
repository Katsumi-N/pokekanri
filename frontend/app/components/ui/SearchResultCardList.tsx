'use client';

import { CardInfo } from "@/lib/card";
import Image from 'next/image';
import { useCardContext } from '@/context/CardContext';

interface ClientCardListProps {
  cards: CardInfo[];
}

export default function SearchResultCardList({ cards }: ClientCardListProps) {
  const { incrementCard } = useCardContext();

  return (
    <div className="max-h-64 overflow-y-auto">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          onClick={() => incrementCard(card)}
        >
          <Image src={card.image_url} alt={card.name} width={64} height={64} className="object-cover rounded-md mr-4" />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type} {card.hp ? `- HP ${card.hp}` : ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
