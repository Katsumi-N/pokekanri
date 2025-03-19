'use client';

import { useState } from 'react';
import { updateProfile } from '@/home/profile/action';
import { UserInfo } from '../../../types/user_info';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { toast } from 'sonner';
import Link from 'next/link';

export function ProfileForm({ initialData }: { initialData: UserInfo }) {
  const [username, setUsername] = useState(initialData.username);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('プロファイルを更新しました');
      } else {
        toast.error(result.error || 'プロファイルの更新に失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" value={initialData.email} disabled />
        <p className="text-sm text-muted-foreground">
          メールアドレスは変更できません
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">表示名</Label>
        <Input 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="表示名"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar">プロフィール画像</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarPreview !== 'no-image' ? avatarPreview : undefined} alt={username} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input 
            id="avatar" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存する'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/home">キャンセル</Link>
        </Button>
      </div>
    </form>
  );
}
