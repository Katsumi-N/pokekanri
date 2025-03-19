'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // ユーザー情報の取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'ユーザー情報の取得に失敗しました' };
    }
    
    const username = formData.get('username') as string;
    const avatarFile = formData.get('avatar') as File;
    
    let avatarUrl = null;
    
    // アバター画像がアップロードされた場合
    if (avatarFile && avatarFile.size > 0) {
      // 古いアバター画像の削除（必要に応じて）
      const { data: oldProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
        
      if (oldProfile?.avatar_url && oldProfile.avatar_url !== 'no-image') {
        const oldPath = oldProfile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('profile').remove([oldPath]);
        }
      }
      
      // 新しいアバター画像のアップロード
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile')
        .upload(fileName, avatarFile);
        
      if (uploadError) {
        return { success: false, error: 'アバター画像のアップロードに失敗しました' };
      }
      
      // 公開URLの取得
      const { data: publicUrl } = supabase.storage
        .from('profile')
        .getPublicUrl(fileName);
        
      avatarUrl = publicUrl.publicUrl;
    }
    
    // プロファイル情報の更新
    const updateData: { display_name: string; avatar_url?: string } = {
      display_name: username,
    };
    
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
      
    if (updateError) {
      return { success: false, error: 'プロファイルの更新に失敗しました' };
    }
    
    // キャッシュの更新
    revalidatePath('/home');
    revalidatePath('/home/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'エラーが発生しました' };
  }
}
