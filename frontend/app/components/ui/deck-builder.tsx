'use client';

import { useState } from 'react';
import { useDeckContext } from '@/context/DeckContext';
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Alert, AlertDescription } from "@/components/ui/shadcn/alert";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import DeckCardList from './deck-card-list';
import SearchForDeck from './search-for-deck';

export default function DeckBuilder() {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { createNewDeck, currentDeck, validateDeck, clearDeck } = useDeckContext();
  const router = useRouter();

  const handleCreateDeck = () => {
    if (!deckName.trim()) {
      toast.error('デッキ名を入力してください');
      return;
    }
    
    createNewDeck(deckName, deckDescription);
    toast.success('新しいデッキを作成しました');
  };

  const handleSaveDeck = async () => {
    const validation = validateDeck();
    
    if (!validation.isValid) {
      toast.error('デッキを保存できません', {
        description: validation.errors.join('\n')
      });
      return;
    }
    
    // 実際のAPIが実装されたら、ここでデッキを保存する処理を追加
    // 例:
    // try {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/decks`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${jwt}`
    //     },
    //     body: JSON.stringify(currentDeck)
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //
    //   toast.success('デッキを保存しました');
    //   router.push('/home/decks');
    // } catch (error) {
    //   console.error('Failed to save deck:', error);
    //   toast.error('デッキの保存に失敗しました');
    // }
    
    // 現在はAPIがないので成功メッセージのみ表示
    toast.success('デッキを保存しました（APIは今後実装予定）');
  };
  
  const handleNewDeck = () => {
    clearDeck();
    setDeckName('');
    setDeckDescription('');
  };

  return (
    <div>
      {!currentDeck ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">新しいデッキを作成</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="deckName" className="block text-sm font-medium mb-1">デッキ名</label>
              <Input
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="デッキ名を入力"
              />
            </div>
            <div>
              <label htmlFor="deckDescription" className="block text-sm font-medium mb-1">説明（任意）</label>
              <Textarea
                id="deckDescription"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="デッキの説明を入力"
                rows={3}
              />
            </div>
            <Button onClick={handleCreateDeck} className="w-full">
              デッキを作成
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{currentDeck.name}</h2>
              {currentDeck.description && (
                <p className="text-gray-600 mt-1">{currentDeck.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowSearch(!showSearch)} variant="outline">
                {showSearch ? 'カード一覧を表示' : 'カードを追加'}
              </Button>
              <Button onClick={handleSaveDeck} variant="default">
                デッキを保存
              </Button>
              <Button onClick={handleNewDeck} variant="destructive">
                新規作成
              </Button>
            </div>
          </div>

          {validateDeck().errors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validateDeck().errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {showSearch ? (
            <SearchForDeck />
          ) : (
            <DeckCardList />
          )}
        </div>
      )}
    </div>
  );
}
