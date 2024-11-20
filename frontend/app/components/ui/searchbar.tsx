'use client';

import { Input } from "@/components/ui/shadcn/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Searchbar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

  return (
    <div className="mb-4 flex space-x-2">
      <Input
        type="text"
        placeholder="カードを検索"
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 rounded-md flex-grow"
      />
    </div>
  );
}