import Search from "./components/ui/Search";
import SearchCardList from "./components/ui/SearchCardList";
import CardInventory from "./components/ui/CardInventory";
import { CardProvider } from "./context/CardContext";

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <CardProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pokekanri</h1>
        <Search placeholder={""}/>
        <SearchCardList query={query} currentPage={currentPage} />
        <CardInventory />
      </div>
    </CardProvider>
  );
}
