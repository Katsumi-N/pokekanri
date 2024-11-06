import { Card } from "../../../lib/card";
import { Button } from "@/app/components/ui/shadcn/button";

interface CardListProps {
  cards: Card[];
  onAdd: (card: Card) => void;
}

export default function CardList({ cards, onAdd }: CardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <img src="https://www.pokemon-card.com/assets/images/card_images/large/SV8/046373_P_PIKACHIXYUUEX.jpg" alt={card.name} className="w-full h-48 object-cover rounded-md mb-2" />
          <div className="mb-2">
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type} - {card.hp} HP</p>
          </div>
          <Button onClick={() => onAdd(card)} className="bg-blue-500 text-white p-2 rounded-md">
            Add
          </Button>
        </div>
      ))}
    </div>
  );
}
