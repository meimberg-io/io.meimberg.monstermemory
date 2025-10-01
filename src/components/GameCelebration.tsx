'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface GameCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  gameStats: {
    moves: number;
    time: number;
    gridSize: number;
  };
}

export default function GameCelebration({ isVisible, onClose, gameStats }: GameCelebrationProps) {
  useEffect(() => {
    if (isVisible) {
      // Create a spectacular confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }

        // Create multiple bursts of confetti
        const particleCount = 50 * (timeLeft / duration);
        
        // Left side burst
        confetti({
          particleCount: Math.floor(particleCount * 0.4),
          angle: randomInRange(60, 120),
          spread: randomInRange(50, 70),
          origin: { x: 0, y: 0.8 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        });

        // Right side burst
        confetti({
          particleCount: Math.floor(particleCount * 0.4),
          angle: randomInRange(60, 120),
          spread: randomInRange(50, 70),
          origin: { x: 1, y: 0.8 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        });

        // Center burst
        confetti({
          particleCount: Math.floor(particleCount * 0.2),
          angle: 90,
          spread: 45,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
        });
      }, 250);

      // Clean up interval after duration
      setTimeout(() => {
        clearInterval(confettiInterval);
      }, duration);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGridSizeText = (size: number) => {
    return `${size}x${size} (${size * size} cards)`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-purple-400">
        <div className="text-center">
          {/* Celebration Icon */}
          <div className="text-6xl mb-4 animate-bounce">
            🎉
          </div>
          
          {/* Congratulations Message */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Congratulations!
          </h2>
          <p className="text-xl text-purple-100 mb-6">
            You completed the {getGridSizeText(gameStats.gridSize)} memory game!
          </p>
          
          {/* Game Stats */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {gameStats.moves}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Moves
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(gameStats.time)}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Time
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-400 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
