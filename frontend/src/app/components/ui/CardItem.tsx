import { DeckCard } from "../../../lib/card";
import { Button } from "@/app/components/ui/shadcn/button";

interface CardItemProps {
  card: DeckCard;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

export default function CardItem({ card, onIncrement, onDecrement, onDelete }: CardItemProps) {
  return (
    <div className="mb-2 flex justify-between items-center bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center">
        <img src="https://www.pokemon-card.com/assets/images/card_images/large/SV8/046373_P_PIKACHIXYUUEX.jpg" alt={card.name} className="w-16 h-16 object-cover rounded-md mr-4" />
        <div>
          <h3 className="text-lg font-semibold">{card.name}</h3>
          <p className="text-sm text-gray-600">{card.type} - {card.hp} HP - {card.quantity}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onIncrement} className="bg-blue-500 text-white p-2 rounded-md">+</Button>
        <Button onClick={onDecrement} className="bg-red-500 text-white p-2 rounded-md">-</Button>
        <Button onClick={onDelete} className="bg-red-500 text-white p-2 rounded-md">Delete</Button>
      </div>
    </div>
  );
}
