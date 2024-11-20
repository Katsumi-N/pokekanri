import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";

export default async function Page() {
    return (
      <div>
        <h1>ログインページ(仮)</h1>
        <Link href="/login">
          <Button className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base" >ログイン</Button>
        </Link>
      </div>
    )
}
