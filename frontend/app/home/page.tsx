import CardInventory from "@/components/ui/card-inventory";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Page(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  // ログインしてなかったら弾く
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <CardInventory />
    </div>
  );
}
