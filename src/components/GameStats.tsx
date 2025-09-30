'use client';

import { GameState, GameStats as GameStatsType } from '@/types/game';

interface GameStatsProps {
  gameState: GameState;
  stats: GameStatsType;
}

export default function GameStats({ gameState, stats }: GameStatsProps) {
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    if (gameState.gameStartTime && !gameState.isGameComplete) {
      return Date.now() - gameState.gameStartTime;
    }
    return stats.totalTime;
  };

  const currentTime = getCurrentTime();
  const totalPairs = (gameState.cards.length) / 2;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        📊 Game Statistics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {gameState.moves}
          </div>
          <div className="text-sm text-gray-400">Moves</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">
            {gameState.matchedPairs}
          </div>
          <div className="text-sm text-gray-400">
            Matched ({gameState.matchedPairs}/{totalPairs})
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-500">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-500">
            {gameState.moves > 0 ? Math.round((gameState.matchedPairs * 2 / gameState.moves) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
      </div>

      {gameState.isGameComplete && (
        <div className="mt-6 p-4 bg-green-900 border border-green-700 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2 text-white">🎉 Congratulations!</div>
            <div className="text-gray-200">
              You completed the game in {gameState.moves} moves and {formatTime(stats.totalTime)}!
            </div>
            {stats.accuracy > 0 && (
              <div className="text-sm text-gray-300 mt-1">
                Accuracy: {Math.round(stats.accuracy)}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
