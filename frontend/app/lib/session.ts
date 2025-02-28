import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtDecode, JwtPayload } from "jwt-decode";


export async function fetchJwt(): Promise<string> {
  const jwtInCookie = cookies().get('token')
  if (jwtInCookie) {
    const token = jwtInCookie.value;
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp > currentTime) {
      return token;
    }
  }
  
  const session = await fetchSession()
  if (!session) {
    redirect('/login')
  }

  return session.access_token
}

async function fetchSession() {
  const supabase = await createClient()
  const { data: session, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Failed to fetch session:', error)
    return null
  }
  return session.session
}
