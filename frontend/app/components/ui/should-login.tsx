import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./shadcn/alert";
import Link from "next/link";

export function shouldLoginAlert() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>ログインしたユーザーのみの機能です</AlertTitle>
      <AlertDescription>
        <Link href="/login">ログイン</Link>してください
      </AlertDescription>
    </Alert>
  )
}
