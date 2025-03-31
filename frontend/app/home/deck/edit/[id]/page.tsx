'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DeckEditor from '@/components/ui/deck-editor';
import { DeckProvider } from '@/context/DeckContext';
import { fetchDeck } from '@/actions/fetch-deck';
import { useDeckContext } from '@/context/DeckContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


// DeckをロードしてContextに設定
function DeckLoader({ deckId }: { deckId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentDeck, loadDeck } = useDeckContext();
  const router = useRouter();

  const loadDeckFromApi = async () => {
    if (isInitialized) return;

    setIsInitialized(true);
    try {
      const { deck, error } = await fetchDeck(deckId);

      if (error || !deck) {
        toast.error('デッキの取得に失敗しました', {
          description: error
        });
        router.push('/home/deck/list');
        return;
      }

      loadDeck(deck);
    } catch (error) {
      console.error('Error loading deck:', error);
      toast.error('デッキの取得中にエラーが発生しました');
      router.push('/home/deck/list');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    loadDeckFromApi();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gradient-to-b from-background to-background/80">
        <div className="relative w-16 h-16">
          <Loader2 className="h-16 w-16 animate-spin text-primary absolute" />
          <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse"></div>
        </div>
        <span className="mt-4 text-lg font-medium text-primary/80">デッキを読み込み中...</span>
        <p className="text-sm text-muted-foreground mt-2">ポケモンカードデータを準備しています</p>
      </div>
    );
  }

  if (!currentDeck) return null;

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{currentDeck.name}</h1>
        {currentDeck.description && (
          <p className="text-muted-foreground mt-2">{currentDeck.description}</p>
        )}
      </div>

      <DeckEditor
        deckId={deckId}
        initialDeck={{
          name: currentDeck.name,
          description: currentDeck.description
        }}
      />
    </div>
  );
}

export default function EditDeckPage() {
  const params = useParams();
  const deckId = parseInt(params.id as string, 10);

  return (
    <DeckProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <DeckLoader deckId={deckId} />
      </div>
    </DeckProvider>
  );
}