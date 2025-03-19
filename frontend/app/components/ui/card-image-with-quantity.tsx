// CardImageWithQuantity.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CardImageWithQuantityProps {
  imageUrl: string;
  quantity: number;
  cardId: number;
  cardType: string;
  onClick?: () => void;
}

export default function CardImageWithQuantity({ 
  imageUrl, 
  quantity, 
  cardId, 
  cardType, 
  onClick 
}: CardImageWithQuantityProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/home/collection/detail/${cardType}/${cardId}?quantity=${quantity}`);
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <Image src={`/images/${imageUrl}`} alt={"card"} width={256} height={256} className="object-cover rounded-md mb-4" />
      <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-tr-md">
        {quantity}枚
      </div>
    </div>
  );
}
