'use client';

import { useDeckContext } from '@/context/DeckContext';
import { useState, useEffect } from 'react';
import { CardInfo } from '@/lib/card';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { DeckCard } from '@/types/deck';

interface DeckCardWithDetails extends CardInfo {
  quantity: number;
}

export default function DeckCardList() {
  const { currentDeck, removeCardFromDeck, updateCardQuantity } = useDeckContext();
  
  const handleRemoveCard = (cardId: number) => {
    removeCardFromDeck(cardId);
  };

  const handleQuantityChange = (cardId: number, quantity: number) => {
    updateCardQuantity(cardId, quantity);
  };


  if (!currentDeck) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">デッキにカードが追加されていません</p>
      </div>
    );
  }

  // カードタイプごとにグループ化
  const cards = currentDeck.cards;
  const pokemonCards = cards.filter(card => card.category === 'pokemon');
  const trainerCards = cards.filter(card => card.category === 'trainer');
  const energyCards = cards.filter(card => card.category === 'energy');

  const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="font-semibold">合計: {totalCards}枚</p>
        <div className="flex gap-4 text-sm text-gray-600">
          <p>ポケモン: {pokemonCards.reduce((sum, card) => sum + card.quantity, 0)}枚</p>
          <p>トレーナーズ: {trainerCards.reduce((sum, card) => sum + card.quantity, 0)}枚</p>
          <p>エネルギー: {energyCards.reduce((sum, card) => sum + card.quantity, 0)}枚</p>
        </div>
      </div>

      {pokemonCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">ポケモン</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderCardList(pokemonCards)}
          </div>
        </div>
      )}

      {trainerCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">トレーナーズ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderCardList(trainerCards)}
          </div>
        </div>
      )}

      {energyCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">エネルギー</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderCardList(energyCards)}
          </div>
        </div>
      )}
    </div>
  );

  function renderCardList(cards: DeckCard[]) {
    return cards.map(card => (
      <div key={card.id} className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-3">
          {card.image_url && (
            <Image 
              src={`/images/${card.image_url}`} 
              alt={card.name} 
              width={100} 
              height={140} 
              className="object-cover rounded-md mb-2" 
            />
          )}
          <h4 className="font-semibold">{card.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max={card.category === 'energy' ? '99' : '4'}
            value={card.quantity}
            onChange={(e) => handleQuantityChange(card.id, parseInt(e.target.value, 10))}
            className="w-20"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveCard(card.id)}
          >
            削除
          </Button>
        </div>
      </div>
    ));
  }
}
