'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CardInfo, CardInventoryInfo } from '@/lib/card';

interface CardContextType {
  cards: CardInventoryInfo[];
  incrementCard: (card: CardInfo) => void;
  decrementCard: (id: number) => void;
  deleteCard: (id: number) => void;
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

  const incrementCard = (card: CardInfo) => {
    setCards((prevCards) => {
      const existingCard = prevCards.find(c => c.id === card.id);
      if (existingCard) {
        return prevCards.map(c => c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c);
      } else {
        return [...prevCards, { ...card, quantity: 1 }];
      }
    });
  };

  const decrementCard = (id: number) => {
    setCards((prevCards) => {
      const existingCard = prevCards.find(c => c.id === id);
      if (existingCard) {
        if (existingCard.quantity === 1) {
          return prevCards.filter(c => c.id !== id);
        } else {
          return prevCards.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
        }
      } else {
        return prevCards;
      }
    });
  };

  const deleteCard = (id: number) => {
    setCards((prevCards) => {
      return prevCards.filter(c => c.id !== id);
    });
  };

  return (
    <CardContext.Provider value={{ cards, incrementCard, decrementCard, deleteCard }}>
      {children}
    </CardContext.Provider>
  );
};
