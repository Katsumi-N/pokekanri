'use client';

import { login, signup } from '@/login/action'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/shadcn/sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isShowedToast = useRef(false);

  useEffect(() => {
    if (isShowedToast.current) {
      return
    }

    const msg = searchParams.get('msg');
    if (msg === 'logout') {
      isShowedToast.current = true;
      toast('ログアウトしました');
    }
  }, [searchParams]);

  return (
    <div>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
      <Toaster />
    </div>
  )
}
