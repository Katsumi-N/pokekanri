import { ProfileForm } from '@/home/profile/profile-form';
import { fetchUserInfo } from '@/utils/supabase/fetchUserInfo';

export default async function ProfilePage() {
  const userInfo = await fetchUserInfo();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プロファイル設定</h1>
      <ProfileForm initialData={userInfo} />
    </div>
  );
}
