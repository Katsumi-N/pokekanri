import { DeckCard } from "../../lib/card";
import CardItem from "./CardItem";

interface DeckProps {
  deckCards: DeckCard[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Deck({ deckCards, onIncrement, onDecrement, onDelete }: DeckProps) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {deckCards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onIncrement={() => onIncrement(card.id)}
          onDecrement={() => onDecrement(card.id)}
          onDelete={() => onDelete(card.id)}
        />
      ))}
    </ul>
  );
}
