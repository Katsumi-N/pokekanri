import SearchCard from "@/components/ui/search-card";
import Searchbar from "@/components/ui/searchbar";

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <>
      <Searchbar placeholder={""}/>
      {query.length > 0 && <SearchCard query={query} currentPage={currentPage} />}
    </>
  )
}
