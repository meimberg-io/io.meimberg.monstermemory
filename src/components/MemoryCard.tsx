'use client';

import { Card } from '@/types/game';
import { useState } from 'react';

interface MemoryCardProps {
  card: Card;
  onClick: (cardId: string) => void;
  isDisabled: boolean;
}

export default function MemoryCard({ card, onClick, isDisabled }: MemoryCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isDisabled || card.isFlipped || card.isMatched) return;
    
    setIsAnimating(true);
    onClick(card.id);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      className={`
        relative w-full h-full cursor-pointer transform transition-all duration-300 ease-in-out
        ${isAnimating ? 'scale-95' : 'hover:scale-105'}
        ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
      onClick={handleClick}
    >
      <div
        className={`
          w-full h-full rounded-lg border-2 border-gray-600
          transition-transform duration-300 ease-in-out
          ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
          ${card.isMatched ? 'border-green-500' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800
            flex items-center justify-center text-white
            ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
        >
          <img 
            src="/monstershape_white.png" 
            alt="Monster" 
            className="w-10 h-10 opacity-60 filter brightness-0 invert"
          />
        </div>

        {/* Card Front */}
        <div
          className={`
            absolute inset-0 w-full h-full rounded-lg bg-gray-100
            flex items-center justify-center overflow-hidden
            ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300
          `}
        >
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={`Memory card ${card.id}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

