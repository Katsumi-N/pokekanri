import { Deck } from '@/types/deck';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import NextImage from 'next/image';

interface DeckItemProps {
  deck: Deck;
  onClick: () => void;
}

export function DeckItem({ deck, onClick }: DeckItemProps) {
  return (
    <div className="flex flex-col space-y-2" onClick={onClick}>
      <Card className="w-full h-48 relative cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-2 sm:p-4 h-full flex flex-row gap-2 sm:gap-4 justify-center">
          {/* Main card */}
          {deck.mainCard ? (
            <div className="w-20 sm:w-24 h-32 sm:h-36 border border-gray-300 bg-white rounded flex-shrink-0">
              <div className="text-xs p-1 text-center font-medium truncate">
                メインカード
              </div>
              {deck.mainCard.image_url && (
                <div className="w-full h-16 sm:h-20 relative">
                  <NextImage 
                    src={`/images/${deck.mainCard.image_url}`} 
                    alt={deck.mainCard.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 sm:w-24 h-32 sm:h-36 border border-gray-300 bg-white rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              カードなし
            </div>
          )}

          {/* Sub card */}
          {deck.subCard ? (
            <div className="w-20 sm:w-24 h-32 sm:h-36 border border-gray-300 bg-white rounded flex-shrink-0">
              <div className="text-xs p-1 text-center font-medium truncate">
                サブカード
              </div>
              {deck.subCard.image_url && (
                <div className="w-full h-16 sm:h-20 relative">
                  <NextImage 
                    src={`/images/${deck.subCard.image_url}`} 
                    alt={deck.subCard.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 sm:w-24 h-32 sm:h-36 border border-gray-300 bg-white rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
              カードなし
            </div>
          )}
        </CardContent>
        <div className="text-sm font-medium truncate absolute bottom-1 justify-center w-full text-center">
          {deck.name || "デッキ名"}
        </div>
      </Card>
    </div>
  );
}