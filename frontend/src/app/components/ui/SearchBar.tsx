import { Input } from "@/app/components/ui/shadcn/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="mb-4 flex space-x-2">
      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 rounded-md flex-grow"
      />
    </div>
  );
}
