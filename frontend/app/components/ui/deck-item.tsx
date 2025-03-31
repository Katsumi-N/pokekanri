import { Deck } from '@/types/deck';
import { Card } from '@/components/ui/shadcn/card';
import NextImage from 'next/image';
import { Badge } from '@/components/ui/shadcn/badge';

interface DeckItemProps {
  deck: Deck;
}

export function DeckItem({ deck }: DeckItemProps) {
  return (
    <Card className="w-full h-64 relative cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white">
      {/* Card background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Deck name */}
      <div className="absolute top-3 left-3 right-3">
        <h3 className="font-bold text-sm md:text-base truncate text-gray-800 group-hover:text-white transition-colors duration-300 z-10 relative">
          {deck.name || "デッキ名"}
        </h3>
      </div>

      <div className="flex justify-center items-center h-full p-4">
        <div className="flex flex-row gap-3 sm:gap-5 relative z-10">
          {/* Main card with staggered effect */}
          <div className="relative transform group-hover:translate-y-[-8px] transition-transform duration-300">
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-blue-600 hover:bg-blue-700 px-3 whitespace-nowrap">
              メイン
            </Badge>
            {deck.mainCard ? (
              <div className="w-24 sm:w-28 h-40 sm:h-44 rounded-lg shadow-md bg-white overflow-hidden border-2 border-blue-400">
                {deck.mainCard.image_url ? (
                  <div className="w-full h-full relative">
                    <NextImage
                      src={`/images/${deck.mainCard.image_url}`}
                      alt={deck.mainCard.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-2"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 sm:w-28 h-40 sm:h-44 rounded-lg shadow-md bg-white/80 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-blue-300">
                カードなし
              </div>
            )}
          </div>

          {/* Sub card */}
          <div className="relative transform group-hover:translate-y-[-4px] transition-transform duration-300">
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 hover:bg-emerald-700 px-3 whitespace-nowrap">
              サブ
            </Badge>
            {deck.subCard ? (
              <div className="w-24 sm:w-28 h-40 sm:h-44 rounded-lg shadow-md bg-white overflow-hidden border-2 border-emerald-400">
                {deck.subCard.image_url ? (
                  <div className="w-full h-full relative">
                    <NextImage
                      src={`/images/${deck.subCard.image_url}`}
                      alt={deck.subCard.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-2"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 sm:w-28 h-40 sm:h-44 rounded-lg shadow-md bg-white/80 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-emerald-300">
                カードなし
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info badge - shows on hover */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Badge variant="outline" className="bg-white/90">
          編集する
        </Badge>
      </div>
    </Card>
  );
}