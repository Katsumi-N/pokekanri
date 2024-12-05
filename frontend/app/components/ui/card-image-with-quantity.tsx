// CardImageWithQuantity.tsx
'use client';

import Image from 'next/image';

interface CardImageWithQuantityProps {
  imageUrl: string;
  quantity: number;
  onClick: () => void;
}

export default function CardImageWithQuantity({ imageUrl, quantity, onClick }: CardImageWithQuantityProps) {
  console.log(imageUrl);
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Image src={`/images/${imageUrl}`} alt={"card"} width={256} height={256} className="object-cover rounded-md mb-4" />
      <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-tr-md">
        {quantity}枚
      </div>
    </div>
  );
}
