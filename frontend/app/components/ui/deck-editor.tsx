'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeckContext } from '@/context/DeckContext';
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { toast } from "sonner";
import { Loader2, Trash2 } from 'lucide-react';
import DeckCardList from './deck-card-list';
import SearchForDeck from './search-for-deck';
import { updateDeck } from "@/actions/update-deck";
import { deleteDeck } from "@/actions/delete-deck";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";

interface DeckEditorProps {
  deckId: number;
  initialDeck?: {
    name: string;
    description?: string;
  };
}

export default function DeckEditor({ deckId, initialDeck }: DeckEditorProps) {
  const [deckName, setDeckName] = useState(initialDeck?.name || '');
  const [deckDescription, setDeckDescription] = useState(initialDeck?.description || '');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentDeck, validateDeck } = useDeckContext();
  const router = useRouter();

  const handleSaveDeck = async () => {
    // 名前が空でないかチェック
    if (!deckName.trim()) {
      toast.error('デッキ名を入力してください');
      return;
    }

    const validation = validateDeck();
    if (!validation.isValid) {
      toast.error('デッキを保存できません', {
        description: validation.errors.join('\n')
      });
      return;
    }

    try {
      if (!currentDeck) {
        toast.error('デッキが存在しません');
        return;
      }

      setIsLoading(true);

      // 現在のデッキに名前と説明を設定
      const updatedDeck = {
        ...currentDeck,
        name: deckName,
        description: deckDescription
      };

      const result = await updateDeck(deckId, updatedDeck);

      if (result.success) {
        toast.success('デッキを更新しました');
        router.push('/home/deck/list');
      } else {
        toast.error('デッキの更新に失敗しました', {
          description: result.error
        });
      }
    } catch (error) {
      toast.error('デッキの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeck = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteDeck(deckId);

      if (result.success) {
        toast.success('デッキを削除しました');
        router.push('/home/deck/list');
      } else {
        toast.error('デッキの削除に失敗しました', {
          description: result.error
        });
      }
    } catch (error) {
      toast.error('デッキの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">デッキ編集</h1>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push('/home/deck/list')}
              >
                キャンセル
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        削除中...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        削除
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>デッキを削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は元に戻すことができません。このデッキはあなたのアカウントから完全に削除されます。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDeck}>削除する</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                onClick={handleSaveDeck}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : '変更を保存'}
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="deckName" className="block text-sm font-medium mb-1">デッキ名</label>
              <Input
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="デッキ名を入力してください"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="deckDescription" className="block text-sm font-medium mb-1">デッキの説明（任意）</label>
              <Textarea
                id="deckDescription"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="デッキの説明を入力してください"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <DeckCardList />
        </div>

        <div className="p-6">
          <Button onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? 'カード検索を閉じる' : 'カードを追加'}
          </Button>

          {showSearch && (
            <div className="mt-6">
              <SearchForDeck />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}