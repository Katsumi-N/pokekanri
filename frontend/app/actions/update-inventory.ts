'use server'

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

export async function updateInventory(formData: FormData) {
  const cardId = formData.get('cardId') as string
  const cardType = formData.get('cardType') as string
  const quantity = parseInt(formData.get('quantity') as string, 10)
  const jwt = cookies().get('token')?.value

  if (!jwt) {
    return null
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/v1/cards/inventories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        card_id: Number(cardId),
        card_type: cardType,
        quantity: quantity,
        increment: false,
      })
    })

    if (!response.ok) {
      throw new Error(`カードの保存に失敗しました: ${response.status}`)
    }

    redirect('/home/collection')
  } catch (error) {
    console.error('カードの保存に失敗しました:', error)
    throw error
  }
}
