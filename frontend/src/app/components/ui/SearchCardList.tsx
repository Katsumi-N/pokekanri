import { CardInfo } from "../../lib/card";
import { Button } from "@/app/components/ui/shadcn/button";
import Image from 'next/image'

interface CardListProps {
  cards: CardInfo[];
  onAdd: (card: CardInfo) => void;
}

export default function SearchCardList({ cards, onAdd }: CardListProps) {
  return (
    <div className="mb-2 bg-white shadow-md rounded-lg p-4">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          onClick={() => onAdd(card)}
        >
          <Image src="https://www.pokemon-card.com/assets/images/card_images/large/SV8/046373_P_PIKACHIXYUUEX.jpg" alt={card.name} width={64} height={64} className="object-cover rounded-md mr-4" />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type} {card.hp ? `- HP ${card.hp}` : ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
