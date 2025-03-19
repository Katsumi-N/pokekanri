import DeckBuilder from "@/components/ui/deck-builder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "デッキビルダー | Pokekanri",
  description: "ポケモンカードのデッキを作成・管理するページです",
};

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">デッキビルダー</h1>
      <DeckBuilder />
    </div>
  );
}
