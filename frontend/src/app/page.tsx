"use client";

import { useState } from "react";
import { masterCards } from "./lib/card";

interface Card {
  id: number;
  name: string;
  type: string;
  hp: number;
}

interface DeckCard extends Card {
  quantity: number;
}

export default function Page() {
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addCardToDeck = () => {
    if (selectedCard) {
      const existingCard = deckCards.find(card => card.id === selectedCard.id);
      if (existingCard) {
        setDeckCards(deckCards.map(card => card.id === selectedCard.id ? { ...card, quantity: card.quantity + 1 } : card));
      } else {
        setDeckCards([...deckCards, { ...selectedCard, quantity: 1 }]);
      }
      setSelectedCard(null);
      setSearchTerm("");
    }
  };

  const incrementCard = (id: number) => {
    setDeckCards(deckCards.map(card =>
      card.id === id ? { ...card, quantity: card.quantity + 1 } : card
    ));
  };

  const decrementCard = (id: number) => {
    setDeckCards(deckCards.map(card =>
      card.id === id ? { ...card, quantity: card.quantity - 1 } : card
    ).filter(card => card.quantity > 0));
  };

  const deleteCard = (id: number) => {
    setDeckCards(deckCards.filter((card) => card.id !== id));
  };

  const filteredMasterCards = masterCards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) || card.type.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={addCardToDeck}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Card
        </button>
      </div>
      <ul className="list-disc pl-5">
        {deckCards.map((card) => (
          <li key={card.id} className="mb-2">
            <span className="font-semibold">
              {card.name} - {card.type} - {card.hp} HP - {card.quantity}
            </span>
            <button onClick={() => incrementCard(card.id)} className="bg-blue-500 text-white p-1 ml-2 rounded">+</button>
              <button onClick={() => decrementCard(card.id)} className="bg-red-500 text-white p-1 ml-2 rounded">-</button>
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
