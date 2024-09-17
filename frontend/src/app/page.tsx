"use client";

import { useState, useEffect } from "react";
import { mockCards, masterCards } from "./lib/card";

interface Card {
  id: number;
  name: string;
  type: string;
  hp: number;
}

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    // モックデータを使用
    setCards(mockCards);
  };

  const addCard = () => {
    if (selectedCard) {
      setCards([...cards, { ...selectedCard, id: cards.length + 1 }]);
      setSelectedCard(null);
      setSearchTerm("");
    }
  };

  const deleteCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const filteredMasterCards = masterCards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pokekanri</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2"
        />
        {searchTerm && (
          <ul className="border p-2 max-h-40 overflow-y-auto">
            {filteredMasterCards.map((card) => (
              <li
                key={card.id}
                onClick={() => {
                  setSelectedCard(card);
                  setSearchTerm(card.name);
                }}
                className="cursor-pointer hover:bg-gray-200 p-1"
              >
                {card.name} - {card.type} - {card.hp} HP
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={addCard}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Card
        </button>
      </div>
      <ul className="list-disc pl-5">
        {cards.map((card) => (
          <li key={card.id} className="mb-2">
            <span className="font-semibold">
              {card.name} - {card.type} - {card.hp} HP
            </span>
            <button
              className="bg-red-500 text-white p-1 ml-2 rounded"
              onClick={() => deleteCard(card.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
