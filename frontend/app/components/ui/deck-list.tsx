'use client';

import { useDeckContext } from "@/context/DeckContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn/card";
import { DeckItem } from "@/components/ui/deck-item";
import { Deck } from "@/types/deck";
import { PlusCircle } from "lucide-react";

export default function DeckList() {
  const { currentDeck, mainCard, subCard, removeCardFromDeck, updateCardQuantity, addMainCard, addSubCard, removeMainCard, removeSubCard } = useDeckContext();
  
  const handleCreateNewDeck = () => {
    console.log("Create new deck");
  };
  const decks: Deck[] = [
    {
      id: 1,
      name: "デッキ名1",
      mainCard: {
        id: 1,
        name: "メインカード",
        image_url: "046948_P_BAFFURON.jpg",
        category: "pokemon"
      },
      subCard: {
        id: 2,
        name: "サブカード",
        image_url: "047133_P_NINFUIAEX.jpg",
        category: "trainer"
      },
      cards: []
    },
    {
      id: 2,
      name: "デッキ名2",
      mainCard: {
        id: 3,
        name: "メインカード",
        image_url: "047350_P_PEPANOYOKUBARISU.jpg",
        category: "energy"
      },
      subCard: {
        id: 4,
        name: "サブカード",
        image_url: "047330_P_EREKIBURUEX.jpg",
        category: "energy"
      },
      cards: []
    },
    {
      id: 3,
      name: "デッキ名3",
      mainCard: {
        id: 3,
        name: "メインカード",
        image_url: "047350_P_PEPANOYOKUBARISU.jpg",
        category: "energy"
      },
      subCard: {
        id: 4,
        name: "サブカード",
        image_url: "047330_P_EREKIBURUEX.jpg",
        category: "energy"
      },
      cards: []
    },
    {
      id: 4,
      name: "デッキ名4",
      mainCard: {
        id: 3,
        name: "メインカード",
        image_url: "047350_P_PEPANOYOKUBARISU.jpg",
        category: "energy"
      },
      subCard: {
        id: 4,
        name: "サブカード",
        image_url: "047330_P_EREKIBURUEX.jpg",
        category: "energy"
      },
      cards: []
    },
  ]
  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <CardTitle>デッキリスト</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {decks.map((deck, index) => (
              <DeckItem 
                key={index} 
                deck={deck} 
                onClick={() => console.log(deck)}
              />
            ))}

            {/* Add new deck button */}
            <div className="flex flex-col space-y-2">
              <Card 
                className="w-full h-48 border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleCreateNewDeck}
              >
                <div className="flex flex-col items-center text-gray-500">
                  <PlusCircle className="h-12 w-12 mb-2" />
                  <span>新しいデッキを作成</span>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}