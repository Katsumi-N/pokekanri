// CardDetail.tsx
'use client';

import { CardInventoryInfo } from '@/lib/card';
import { Button } from "@/components/ui/shadcn/button";
import { FaTrash, FaSave } from 'react-icons/fa';
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/shadcn/dialog';

interface CardDetailProps {
  card: CardInventoryInfo;
  tempQuantity: number;
  incrementCard: (card: CardInventoryInfo) => void;
  decrementCard: (id: number) => void;
  saveCardQuantity: (card: CardInventoryInfo, quantity: number) => void;
  deleteCard: (id: number) => void;
  selectedCardId: number | null;
  closeModal: () => void;
}

export default function CardNumberEditDialog({
  card,
  tempQuantity,
  incrementCard,
  decrementCard,
  saveCardQuantity,
  deleteCard,
  selectedCardId,
  closeModal,
}: CardDetailProps) {
  const handleDelete = (id: number) => {
    closeModal();
    deleteCard(id);
  };

  return (
    <Dialog open={!!selectedCardId} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-600">{card.energy_type} {card.hp ? `- HP ${card.hp}` : ""}</p>
            <p className="text-sm text-gray-600">枚数: {card.quantity}</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-2">
          <Button type="button" onClick={() => decrementCard(card.id)} className="px-2 py-1">-</Button>
          <span className="text-sm text-gray-600">{tempQuantity}</span>
          <Button type="button" onClick={() => incrementCard(card)} className="px-2 py-1">+</Button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Button type="button" onClick={() => saveCardQuantity(card, tempQuantity)} className="px-2 py-1 bg-green-500 text-white flex-grow flex items-center justify-center">
            <FaSave />
          </Button>
          <Button type="button" onClick={() => handleDelete(card.id)} className="px-2 py-1 bg-red-500 text-white flex-grow flex items-center justify-center">
            <FaTrash />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
