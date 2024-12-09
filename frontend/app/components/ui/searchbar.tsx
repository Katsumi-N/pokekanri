'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Searchbar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [cardType, setCardType] = useState('all');

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCardTypeChange = (type: string) => {
    setCardType(type);
    const params = new URLSearchParams(searchParams);
    if (type !== 'all') {
      params.set('card_type', type);
    } else {
      params.delete('card_type');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="カードを検索"
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded-md flex-grow max-w-lg"
        />
      </div>
      <div className="mt-4 flex space-x-4">
        <Button
          variant={cardType === 'all' ? 'default' : 'secondary'}
          onClick={() => handleCardTypeChange('all')}
        >
          すべて
        </Button>
        <Button
          variant={cardType === 'pokemon' ? 'default' : 'secondary'}
          onClick={() => handleCardTypeChange('pokemon')}
        >
          ポケモン
        </Button>
        <Button
          variant={cardType === 'trainers' ? 'default' : 'secondary'}
          onClick={() => handleCardTypeChange('trainers')}
        >
          トレーナーズ
        </Button>
        <Button
          variant={cardType === 'energy' ? 'default' : 'secondary'}
          onClick={() => handleCardTypeChange('energy')}
        >
          エネルギー
        </Button>
      </div>
    </div>
  );
}
