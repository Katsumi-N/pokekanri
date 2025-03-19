'use client';

import { login } from '@/login/action';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/shadcn/sonner";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import Link from 'next/link';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isShowedToast = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 入力があればエラーメッセージをクリア
    setErrorMessage('');
  };

  // ログインの処理
  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await login(formData);
    } catch (error) {
      // エラー処理はlogin関数内で行われるため、ここでは何もしない
    } finally {
      setIsLoading(false);
    }
  };

  // 通知とエラーメッセージの処理
  useEffect(() => {
    // ログアウトメッセージ
    if (!isShowedToast.current) {
      const msg = searchParams.get('msg');
      if (msg === 'logout') {
        isShowedToast.current = true;
        toast('ログアウトしました');
      }
    }

    // エラーメッセージの処理
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'invalid_credentials':
          setErrorMessage('メールアドレスまたはパスワードが正しくありません');
          break;
        case 'email_not_confirmed':
          setErrorMessage('メールアドレスが確認されていません。メールをご確認ください');
          break;
        case 'session_error':
          setErrorMessage('セッションエラーが発生しました。もう一度お試しください');
          break;
        case 'unknown':
        default:
          setErrorMessage('エラーが発生しました。もう一度お試しください');
          break;
      }
    }

    // 会員登録成功メッセージ
    const status = searchParams.get('status');
    if (status === 'registered') {
      toast.success('会員登録が完了しました。ログインしてください');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PokeKanri</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">ログイン</h2>
        </div>
        
        <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
          {errorMessage && (
            <div className="mb-4 p-3 border border-destructive/50 bg-destructive/10 rounded-md flex items-start gap-2">
              <AlertCircleIcon className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <span className="text-destructive">{errorMessage}</span>
            </div>
          )}

          <form className="space-y-6" action={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">メールアドレス</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">パスワード</Label>
                <div className="text-sm">
                  <Link href="#" className="text-primary hover:underline">
                    パスワードをお忘れですか？
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password" 
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                    ログイン中...
                  </>
                ) : (
                  "ログイン"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでないですか？{' '}
            <Link href="/signin" className="text-primary hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
