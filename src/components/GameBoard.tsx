'use client';

import { GameState } from '@/types/game';
import MemoryCard from './MemoryCard';

interface GameBoardProps {
  gameState: GameState;
  onCardClick: (cardId: string) => void;
  gridSize: number;
}

export default function GameBoard({ gameState, onCardClick, gridSize }: GameBoardProps) {
  const isDisabled = gameState.flippedCards.length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        className={`
          grid gap-2 mx-auto
          ${gridSize === 2 ? 'grid-cols-2' : ''}
          ${gridSize === 4 ? 'grid-cols-4' : ''}
          ${gridSize === 6 ? 'grid-cols-6' : ''}
          ${gridSize === 8 ? 'grid-cols-8' : ''}
        `}
        style={{
          aspectRatio: '1/1',
          maxHeight: '80vh',
        }}
      >
        {gameState.cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={onCardClick}
            isDisabled={isDisabled && !card.isFlipped && !card.isMatched}
            isWrongPair={gameState.wrongPairCards.includes(card.id)}
          />
        ))}
        {/* Add empty spaces for odd grid sizes */}
        {Array.from({ length: (gridSize * gridSize) - gameState.cards.length }, (_, index) => (
          <div key={`empty-${index}`} className="bg-transparent" />
        ))}
      </div>
    </div>
  );
}

