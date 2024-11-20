import { CardProvider } from "@/context/CardContext";
import SearchCardList from "@/components/ui/SearchCardList";
import Search from "@/components/ui/Search";

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <>
      <Search placeholder={""}/>
      {query.length > 0 && <SearchCardList query={query} currentPage={currentPage} />}
    </>
  )
}
