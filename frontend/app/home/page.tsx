import CardInventory from "@/components/ui/card-inventory";

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  return (
    <div className="container mx-auto p-4">
      <CardInventory />
    </div>
  );
}
