'use client';

import { useCardContext } from '@/app/context/CardContext';
import { Button } from "@/app/components/ui/shadcn/button";
import Image from 'next/image';

export default function CardInventory() {
  const { cards, incrementCard, decrementCard, deleteCard } = useCardContext();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">所持カード</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white shadow-md rounded-lg p-4">
            <Image src={card.image_url} alt={card.name} width={64} height={64} className="object-cover rounded-md mr-4" />
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type} {card.hp ? `- HP ${card.hp}` : ""}</p>
            <p className="text-sm text-gray-600">Quantity: {card.quantity}</p>
            <div className="flex space-x-2">
              <Button onClick={() => incrementCard(card)}>+</Button>
              <Button onClick={() => decrementCard(card.id)}>-</Button>
              <Button onClick={() => deleteCard(card.id)}>Delete</Button>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}
