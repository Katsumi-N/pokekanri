'use server';

import { createClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';

export const signout = async (): Promise<boolean> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error logging out:', error.message);
    return false;
  }
  cookies().delete('token');

  return true;
}
