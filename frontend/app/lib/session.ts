import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function fetchJwt(): Promise<string> {
  const jwtInCookie = cookies().get('token')
  if (jwtInCookie) {
    return jwtInCookie.value
  }
  
  const session = await fetchSession()
  if (!session) {
    return ''
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
