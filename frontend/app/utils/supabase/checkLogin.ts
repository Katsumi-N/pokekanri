'use server';

import { createClient } from '@/utils/supabase/server'

export async function checkLogin(): Promise<boolean>  {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  return true;
}
