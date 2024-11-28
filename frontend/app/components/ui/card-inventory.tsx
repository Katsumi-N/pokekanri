'use client';

import { useState } from 'react';
import { useCardContext } from '@/context/CardContext';
import { Button } from "@/components/ui/shadcn/button";
import Image from 'next/image';
import { CardInfo } from '@/lib/card';
import { FaTrash, FaSave } from 'react-icons/fa';

export default function CardInventory() {
  const { cards, deleteCard, saveCardQuantity } = useCardContext();
  const [tempQuantities, setTempQuantities] = useState<{ [key: string]: number }>({});

  const incrementCard = (card: CardInfo) => {
    setTempQuantities((prev) => ({ ...prev, [card.id]: (prev[card.id] || 0) + 1 }));
  }

  const decrementCard = (id: string) => {
    setTempQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col style={{ minHeight: '200px' }}">
            <Image src={card.image_url} alt={card.name} width={64} height={64} className="object-cover rounded-md mr-4" />
            <h3 className="text-lg font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.type} {card.hp ? `- HP ${card.hp}` : ""}</p>
            <p className="text-sm text-gray-600">枚数: {card.quantity || 0}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Button onClick={() => decrementCard(card.id)} className="px-2 py-1">-</Button>
              <span className="text-sm text-gray-600">{tempQuantities[card.id] || 0}</span>
              <Button onClick={() => incrementCard(card)} className="px-2 py-1">+</Button>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Button onClick={() => saveCardQuantity(card, tempQuantities[card.id])} className="px-2 py-1 bg-green-500 flex items-center justify-center">
                <FaSave />
              </Button>
              <Button onClick={() => deleteCard(card.id)} className="px-2 py-1 bg-red-500 flex items-center justify-center">
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
