import { createClient } from '@/utils/supabase/server';
import { UserInfo } from '../../../types/user_info';

export const fetchUserInfo = async (): Promise<UserInfo> => {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return {
      email:'',
      avatar: 'no-image',
      username: 'ゲストユーザー'
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url,display_name')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return {
      email: user.email || '',
      avatar: 'no-image',
      username: 'ゲストユーザー'
    };
  }

  const userInfo: UserInfo = {
    email: user.email || '',
    avatar: profile?.avatar_url || 'no-image',
    username: profile?.display_name || 'ゲストユーザー'
  };

  return userInfo;
}
