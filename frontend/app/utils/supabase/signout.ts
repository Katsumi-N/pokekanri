import { createClient } from '@/utils/supabase/client';

export const signout = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) {
        console.error('Error logging out:', error.message);
        return;
    }
}
