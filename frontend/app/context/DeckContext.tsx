'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Deck, DeckCard } from '@/types/deck';

interface DeckContextType {
  currentDeck: Deck | null;
  mainCard: DeckCard | null;
  subCard: DeckCard | null;
  createNewDeck: (name: string, description?: string) => void;
  addCardToDeck: (card: DeckCard, quantity: number) => void;
  removeCardFromDeck: (cardId: number) => void;
  updateCardQuantity: (cardId: number, quantity: number) => void;
  validateDeck: () => DeckValidationResult;
  clearDeck: () => void;
  addMainCard: (card: DeckCard) => void;
  addSubCard: (card: DeckCard) => void;
  removeMainCard: () => void;
  removeSubCard: () => void;
}

export interface DeckValidationResult {
  isValid: boolean;
  errors: string[];
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const useDeckContext = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeckContext must be used within a DeckProvider');
  }
  return context;
};

export const DeckProvider = ({ children }: { children: ReactNode }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [mainCard, setMainCard] = useState<DeckCard | null>(null);
  const [subCard, setSubCard] = useState<DeckCard | null>(null);

  const createNewDeck = (name: string, description?: string) => {
    setCurrentDeck({
      name,
      description,
      cards: []
    });
  };

  const addCardToDeck = (card: DeckCard, quantity: number) => {
    if (!currentDeck) return;

    setCurrentDeck(prev => {
      if (!prev) return prev;

      const existingCard = prev.cards.find(c => c.name === card.name && c.category === card.category);
      if (existingCard) {
        return {
          ...prev,
          cards: prev.cards.map(c => 
            c.name === card.name && c.category === card.category
              ? { ...c, quantity: c.quantity + quantity } 
              : c
          )
        };
      } else {
        return {
          ...prev,
          cards: [...prev.cards, { id: card.id, name: card.name, image_url: card.image_url, category: card.category, quantity }]
        };
      }
    });
  };

  const removeCardFromDeck = (cardId: number) => {
    if (!currentDeck) return;

    setCurrentDeck(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId)
      };
    });
  };

  const updateCardQuantity = (cardId: number, quantity: number) => {
    if (!currentDeck) return;

    setCurrentDeck(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cards: prev.cards.map(c => 
          c.id === cardId ? { ...c, quantity } : c
        )
      };
    });
  };

  const validateDeck = (): DeckValidationResult => {
    const errors: string[] = [];
    
    if (!currentDeck) {
      errors.push('デッキが作成されていません');
      return { isValid: false, errors };
    }

    if (!currentDeck.name) {
      errors.push('デッキ名を入力してください');
    }

    if (currentDeck.cards.length === 0) {
      errors.push('デッキにカードが追加されていません');
    }

    const totalCards = currentDeck.cards.reduce((sum, card) => sum + card.quantity, 0);
    if (totalCards !== 60) {
      errors.push('デッキは60枚です');
    }

    const cardCounts: Record<string, number> = {};
    currentDeck.cards.forEach(card => {
      if (card.category !== 'energy') {
        const key = `${card.id}-${card.category}`;
        if (!cardCounts[key]) {
          cardCounts[key] = 0;
        }
        cardCounts[key] += card.quantity;
        
        if (cardCounts[key] > 4) {
          errors.push(`同名カードは4枚までしか入れられません（${card.id}）`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const clearDeck = () => {
    setCurrentDeck(null);
  };

  const addMainCard = (card: DeckCard) => {
    setMainCard(card);
  };

  const addSubCard = (card: DeckCard) => {
    setSubCard(card);
  };

  const removeMainCard = () => {
    setMainCard(null);
  };

  const removeSubCard = () => {
    setSubCard(null);
  };

  return (
    <DeckContext.Provider value={{ 
      currentDeck,
      mainCard,
      subCard,
      createNewDeck, 
      addCardToDeck, 
      removeCardFromDeck, 
      updateCardQuantity, 
      validateDeck,
      clearDeck,
      addMainCard,
      addSubCard,
      removeMainCard,
      removeSubCard
    }}>
      {children}
    </DeckContext.Provider>
  );
};
