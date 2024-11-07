"use client";

import { useState } from "react";
import { masterCards, CardInfo, DeckCard } from "./lib/card";
import SearchBar from "./components/ui/SearchBar";
import SearchCardList from "./components/ui/SearchCardList";
import Deck from "./components/ui/Deck";

export default function Page() {
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addCardToDeck = (card: CardInfo) => {
    const existingCard = deckCards.find(deckCard => deckCard.id === card.id);
    if (existingCard) {
      setDeckCards(deckCards.map(card => card.id === card.id ? { ...card, quantity: card.quantity + 1 } : card));
    } else {
      setDeckCards([...deckCards, { ...card, quantity: 1 }]);
    }
    setSearchTerm("");
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
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      {searchTerm && <SearchCardList cards={filteredMasterCards} onAdd={addCardToDeck} />}
      <Deck deckCards={deckCards} onIncrement={incrementCard} onDecrement={decrementCard} onDelete={deleteCard} />
    </div>
  );
}
