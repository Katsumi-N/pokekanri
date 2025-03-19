'use client';

import { CardInfo } from "@/lib/card";
import Image from 'next/image';
import { useCardContext } from '@/context/CardContext';
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/shadcn/button';
import { useRouter } from 'next/navigation';

interface ClientCardListProps {
  cards: CardInfo[];
  jwt: string;
}

const postInventory = async (card: CardInfo, quantity: number, jwt: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/cards/inventories`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      card_id: Number(card.id),
      card_type: card.category,
      quantity: quantity,
      increment: true,
    }),
  });

  if (!response.ok) {
    toast('カードの保存に失敗しました。リトライしてください。');
  }
}

export default function SearchResult({ cards, jwt }: ClientCardListProps) {
  const router = useRouter();
  const { saveCardQuantity, getCardQuantity } = useCardContext();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleAddToInventory = async (card: CardInfo) => {
    const quantity = quantities[card.id] || 1;
    const before_quantity = getCardQuantity(card.id);
    await postInventory(card, quantity, jwt);
    toast(`${card.name}を追加しました`, {
      action: {
        label: "キャンセル",
        onClick: async () => {
          toast('キャンセルしました')
          await postInventory(card, quantity, jwt)
          saveCardQuantity(card, before_quantity)
        },
      },
    })
  };

  const handleCardClick = (card: CardInfo) => {
    router.push(`/home/detail/${card.category}/${card.id}`);
  };

  const handleQuantityChange = (cardId: number, quantity: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // イベントの伝播を止める
    setQuantities((prev) => ({ ...prev, [cardId]: quantity }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
        >
          <div 
            className="cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <Image 
              src={`/images/${card.image_url}`} 
              alt={card.name} 
              width={256} 
              height={256} 
              className="object-cover rounded-md mb-4" 
            />
            <div className="mb-3">
              <h3 className="text-lg font-semibold">{card.name}</h3>
              <p className="text-sm text-gray-600">{card.energy_type} {card.hp ? `- HP ${card.hp}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" 
              value={quantities[card.id] || 1} 
              onChange={(e) => handleQuantityChange(card.id, parseInt(e.target.value, 10), e)} 
              className="border p-2 rounded-md w-20"
              onClick={(e) => e.stopPropagation()} // 必要に応じてクリックイベントの伝播を止める
            />
            <Button 
              onClick={(e) => {
                e.stopPropagation(); // イベントの伝播を止める
                handleAddToInventory(card);
              }} 
              className="flex-1"
            >
              追加
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
