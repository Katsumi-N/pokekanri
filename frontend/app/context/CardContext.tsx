'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CardInfo, CardInventoryInfo } from '@/lib/card';

interface CardContextType {
  cards: CardInventoryInfo[];
  deleteCard: (id: number) => void;
  saveCardQuantity: (card: CardInfo, quantity: number) => void;
  getCardQuantity: (id: number) => number;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<CardInventoryInfo[]>([]);

  const deleteCard = (id: number) => {
    setCards((prevCards) => {
      return prevCards.filter(c => c.id !== id);
    });
  };

  const saveCardQuantity = (card: CardInfo, quantity: number) => {
    setCards((prevCards) => {
      const existingCard = prevCards.find(c => c.id === card.id);
      if (existingCard) {
        return prevCards.map(c => c.id === card.id ? { ...c, quantity: quantity } : c);
      } else {
        return [...prevCards, { ...card, quantity: quantity }];
      }
    });
  };

  const getCardQuantity = (id: number) => {
    const card = cards.find(c => c.id === id);
    return card ? card.quantity : 0;
  }

  return (
    <CardContext.Provider value={{ cards, deleteCard, saveCardQuantity, getCardQuantity }}>
      {children}
    </CardContext.Provider>
  );
};
