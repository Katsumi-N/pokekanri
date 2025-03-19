'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * ユーザーログイン処理
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  // 入力データの取得と検証
  const email = formData.get('email')
  const password = formData.get('password')

  // 簡易的な入力検証
  if (!email || !password || 
      typeof email !== 'string' || 
      typeof password !== 'string') {
    throw new Error('メールアドレスとパスワードを入力してください')
  }

  const { data: session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    
    // エラーケースに応じてリダイレクト
    if (error.message.includes('Invalid login credentials')) {
      redirect('/login?error=invalid_credentials')
    } else if (error.message.includes('Email not confirmed')) {
      redirect('/login?error=email_not_confirmed')
    } else {
      redirect('/login?error=unknown')
    }
  }

  if (!session?.session?.access_token) {
    redirect('/login?error=session_error')
  }

  const jwt = session.session.access_token

  // トークンをクッキーに保存
  cookies().set('token', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  })

  revalidatePath('/', 'layout')
  redirect('/home')
}

/**
 * ユーザー登録処理
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 入力データの取得と検証
  const email = formData.get('email')
  const password = formData.get('password')

  // 簡易的な入力検証
  if (!email || !password || 
      typeof email !== 'string' || 
      typeof password !== 'string') {
    throw new Error('メールアドレスとパスワードを入力してください')
  }

  if (password.length < 6) {
    throw new Error('パスワードは6文字以上である必要があります')
  }

  // メール確認を有効にするオプション
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/confirm`,
    }
  })

  if (error) {
    console.error('Signup error:', error.message)
    
    // エラーケースに応じてリダイレクト
    if (error.message.includes('already registered')) {
      redirect('/signin?error=email_in_use')
    } else {
      redirect('/signin?error=registration_failed')
    }
  }

  // 登録成功後、確認画面にリダイレクト
  redirect('/signin?status=check_email')
}
