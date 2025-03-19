'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { CardInfo } from "@/lib/card";
import { useDeckContext } from '@/context/DeckContext';
import { toast } from "sonner";
import Image from 'next/image';

export default function SearchForDeck() {
  const [query, setQuery] = useState('');
  const [cardType, setCardType] = useState('all');
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addCardToDeck } = useDeckContext();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/cards/search?q=${query}&page=1&card_type=${cardType}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const fetchedCards: CardInfo[] = [
        ...(data.pokemons?.map((pokemon: any) => ({
          id: pokemon.id,
          name: pokemon.name,
          energy_type: pokemon.energy_type,
          category: 'pokemon',
          image_url: pokemon.image_url,
          hp: pokemon.hp
        })) || []),
        ...(data.trainers?.map((trainer: any) => ({
          id: trainer.id,
          name: trainer.name,
          category: 'trainer',
          image_url: trainer.image_url,
          energy_type: ''
        })) || []),
        ...(data.energies?.map((energy: any) => ({
          id: energy.id,
          name: energy.name,
          category: 'energy',
          image_url: energy.image_url,
          energy_type: energy.energy_type || ''
        })) || []),
      ];
      
      setCards(fetchedCards);
      
      // 初期数量を1に設定
      const initialQuantities: { [key: string]: number } = {};
      fetchedCards.forEach(card => {
        initialQuantities[`${card.id}-${card.category}`] = 1;
      });
      setQuantities(initialQuantities);
      
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      toast.error('カードの検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCardTypeChange = (type: string) => {
    setCardType(type);
  };

  const handleQuantityChange = (card: CardInfo, value: number) => {
    setQuantities(prev => ({ ...prev, [`${card.id}-${card.category}`]: value }));
  };

  const handleAddToDeck = (card: CardInfo) => {
    const quantity = quantities[`${card.id}-${card.category}`] || 1;
    addCardToDeck(card, quantity);
    toast.success(`${card.name}をデッキに追加しました`);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="text"
            placeholder="カードを検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded-md flex-grow max-w-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </Button>
        </div>
        <div className="flex space-x-4">
          <Button
            variant={cardType === 'all' ? 'default' : 'secondary'}
            onClick={() => handleCardTypeChange('all')}
          >
            すべて
          </Button>
          <Button
            variant={cardType === 'pokemon' ? 'default' : 'secondary'}
            onClick={() => handleCardTypeChange('pokemon')}
          >
            ポケモン
          </Button>
          <Button
            variant={cardType === 'trainer' ? 'default' : 'secondary'}
            onClick={() => handleCardTypeChange('trainer')}
          >
            トレーナーズ
          </Button>
          <Button
            variant={cardType === 'energy' ? 'default' : 'secondary'}
            onClick={() => handleCardTypeChange('energy')}
          >
            エネルギー
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div 
            key={`${card.id}-${card.category}`}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <div>
              <Image 
                src={`/images/${card.image_url}`} 
                alt={card.name} 
                width={256} 
                height={256} 
                className="object-cover rounded-md mb-4" 
              />
              <div className="mb-3">
                <h3 className="text-lg font-semibold">{card.name}</h3>
                <p className="text-sm text-gray-600">
                  {card.category === 'pokemon' ? (
                    <>
                      {card.energy_type} {card.hp ? `- HP ${card.hp}` : ""}
                    </>
                  ) : card.category === 'energy' ? (
                    <>{card.energy_type}</>
                  ) : (
                    <>トレーナーズ</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number" 
                min="1" 
                max={card.category === 'energy' ? '99' : '4'}
                value={quantities[`${card.id}-${card.category}`] || 1} 
                onChange={(e) => handleQuantityChange(card, parseInt(e.target.value, 10))} 
                className="border p-2 rounded-md w-20"
              />
              <Button 
                onClick={() => handleAddToDeck(card)} 
                className="flex-1"
              >
                デッキに追加
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {cards.length === 0 && query && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">検索結果がありません</p>
        </div>
      )}
    </div>
  );
}
