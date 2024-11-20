import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";

export default async function Page() {
    return (
      <div>
        <h1>ログインページ(仮)</h1>
        <Link href="/login">
          <Button className="bg-blue-500 text-white hover:bg-blue-700" >ログイン</Button>
        </Link>
      </div>
    )
}
