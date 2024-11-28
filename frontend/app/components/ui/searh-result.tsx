'use client';

import { CardInfo } from "@/lib/card";
import Image from 'next/image';
import { useCardContext } from '@/context/CardContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

interface ClientCardListProps {
  cards: CardInfo[];
}

export default function SearchResult({ cards }: ClientCardListProps) {
  const { saveCardQuantity } = useCardContext();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleCardClick = (card: CardInfo) => {
    const quantity = quantities[card.id] || 1;
    saveCardQuantity(card, quantity);
    toast.success(`${card.name}を追加しました`);
  };

  const handleQuantityChange = (cardId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [cardId]: quantity }));
  };

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100"
          >
            <Image src={card.image_url} alt={card.name} width={64} height={64} className="object-cover rounded-md mb-4" />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{card.name}</h3>
              <p className="text-sm text-gray-600">{card.type} {card.hp ? `- HP ${card.hp}` : ""}</p>
              <input 
                type="number" 
                min="1" 
                value={quantities[card.id] || 1} 
                onChange={(e) => handleQuantityChange(card.id, parseInt(e.target.value, 10))} 
                className="border p-2 rounded-md mb-2"
              />
              <button 
                onClick={() => handleCardClick(card)} 
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                追加
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
