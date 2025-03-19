'use client';

import { signup } from '@/login/action';
import { useState } from 'react';
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import Link from 'next/link';
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/shadcn/sonner";
import { toast } from 'sonner';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // エラーをクリア
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // フォームの検証
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    // メールアドレスの検証
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = '有効なメールアドレスを入力してください';
      isValid = false;
    }

    // パスワードの検証
    if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上である必要があります';
      isValid = false;
    }

    // 確認パスワードの検証
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // サインアップの処理
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      
      await signup(formDataToSend);
      
      // 成功メッセージ
      toast.success('登録確認メールを送信しました。メールをご確認ください。');
      
      // フォームをリセット
      setFormData({ email: '', password: '', confirmPassword: '' });
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PokeKanri</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">アカウント作成</h2>
        </div>
        
        <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
          <form className="space-y-6" onSubmit={handleSignup}>
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
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">パスワード</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password" 
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
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">パスワード（確認）</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-muted-foreground">
                利用規約とプライバシーポリシーに同意します
              </label>
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
                    登録中...
                  </>
                ) : (
                  "アカウント作成"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            すでにアカウントをお持ちですか？{' '}
            <Link href="/login" className="text-primary hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
