import DeckList from "@/components/ui/deck-list";

export default function DeckListPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">デッキリスト</h1>
      <DeckList />
    </div>
  )
}