'use client'

import { updateInventory } from '@/actions/update-inventory'
import React, { useState } from 'react'
import { FaSync } from 'react-icons/fa';

interface InventoryQuantityEditorProps {
  cardId: number
  cardType: string
  initialQuantity: number
}

export default function InventoryQuantityEditor({
	cardId,
	cardType,
	initialQuantity
}: InventoryQuantityEditorProps) {
	const [quantity, setQuantity] = useState(initialQuantity)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)
		if (value >= 0) {
			setQuantity(value)
		}
	}

	return (
	  <form action={updateInventory} className="mt-4">
		<input type="hidden" name="cardId" value={cardId} />
		<input type="hidden" name="cardType" value={cardType} />
		
		<div className="flex items-center space-x-2">
		  <label htmlFor="quantity" className="text-sm font-medium">`</label>
		  <div className="flex items-center border rounded">
			<input 
			  type="number" 
			  id="quantity" 
			  name="quantity" 
			  value={quantity} 
			  onChange={handleInputChange}
			  min="0" 
			  className="w-16 text-center py-1 focus:outline-none" 
			/>
		  </div>
		  <button 
			type="submit" 
			className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
		  >
			<FaSync />
		  </button>
		</div>
	  </form>
	)
}
