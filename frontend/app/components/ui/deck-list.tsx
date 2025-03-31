import Link from 'next/link';
import { DeckItem } from "@/components/ui/deck-item";
import { PlusCircle } from "lucide-react";
import { fetchDecks } from "@/actions/fetch-decks";
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { AlertCircle } from 'lucide-react';

export default async function DeckList() {
  const { decks, error } = await fetchDecks();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* Header with title and action button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">マイデッキ一覧</h1>
            <p className="text-gray-500 mt-1">あなたのポケモンデッキコレクションを管理</p>
          </div>

          <Link href="/home/deck/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              新しいデッキを作成
            </Button>
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">エラーが発生しました</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && decks.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <PlusCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">デッキがありません</h3>
            <p className="text-gray-500 mb-6">新しいデッキを作成して、カードを追加しましょう</p>
            <Link href="/home/deck/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                最初のデッキを作成
              </Button>
            </Link>
          </div>
        )}

        {/* Deck grid */}
        {!error && decks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Existing decks */}
            {decks.map((deck) => (
              <Link href={`/home/deck/edit/${deck.id}`} key={deck.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                <DeckItem deck={deck} />
              </Link>
            ))}

            {/* Add new deck card */}
            <Link href="/home/deck/create" className="h-64">
              <Card className="w-full h-full border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                    <PlusCircle className="h-8 w-8" />
                  </div>
                  <span className="font-medium">新しいデッキを作成</span>
                </div>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}