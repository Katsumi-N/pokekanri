'use client';

import { useState } from 'react';
import { useCardContext } from '@/context/CardContext';
import { CardInfo } from '@/lib/card';
import CardNumberEditDialog from './card-number-edit-dialog';
import CardImageWithQuantity from '@/components/ui/card-image-with-quantity';

export default function CardInventory() {
  const { cards, deleteCard, saveCardQuantity } = useCardContext();
  const [tempQuantities, setTempQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  const incrementCard = (card: CardInfo) => {
    setTempQuantities((prev) => ({ ...prev, [card.id]: (prev[card.id] || 0) + 1 }));
  }

  const decrementCard = (id: string) => {
    setTempQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
  }

  const handleCardClick = (id: string) => {
    setSelectedCardId(selectedCardId === id ? null : id);
  }

  const closeModal = () => {
    setSelectedCardId(null);
  }

  return (
    <div>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="flex flex-col cursor-pointer" 
            onClick={() => handleCardClick(card.id)}
          >
            <CardImageWithQuantity 
              imageUrl={card.image_url} 
              quantity={card.quantity} 
              onClick={() => handleCardClick(card.id)}
            />
          </div>
        ))}
      </div>
      {selectedCardId && (
        <CardNumberEditDialog
        card={cards.find(c => c.id === selectedCardId)!}
        tempQuantity={tempQuantities[selectedCardId] || cards.find(c => c.id === selectedCardId)!.quantity}
        incrementCard={incrementCard}
        decrementCard={decrementCard}
        saveCardQuantity={saveCardQuantity}
        deleteCard={deleteCard}
        selectedCardId={selectedCardId}
        closeModal={closeModal}
      />
)}
    </div>
  );
}
