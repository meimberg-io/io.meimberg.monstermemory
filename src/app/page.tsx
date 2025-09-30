'use client';

import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import GameControls from '@/components/GameControls';
import { useMemoryGame } from '@/hooks/useMemoryGame';

// Monster images from the pics directory
const MONSTER_IMAGES = [
  '/pics/monster_anton_thumb_big.jpg',
  '/pics/monster_baffo_thumb_big.jpg',
  '/pics/monster_benni_thumb_big.jpg',
  '/pics/monster_berta_thumb_big.jpg',
  '/pics/monster_bombo_thumb_big.jpg',
  '/pics/monster_bruno_thumb_big.jpg',
  '/pics/monster_carlo_thumb_big.jpg',
  '/pics/monster_clara_thumb_big.jpg',
  '/pics/monster_emil_thumb_big.jpg',
  '/pics/monster_fiete_thumb_big.jpg',
  '/pics/monster_fino_thumb_big.jpg',
  '/pics/monster_flocke_thumb_big.jpg',
  '/pics/monster_friedrich_thumb_big.jpg',
  '/pics/monster_glubbio_thumb_big.jpg',
  '/pics/monster_gordon_thumb_big.jpg',
  '/pics/monster_grudo_thumb_big.jpg',
  '/pics/monster_icy_thumb_big.jpg',
  '/pics/monster_igor_thumb_big.jpg',
  '/pics/monster_jim_thumb_big.jpg',
  '/pics/monster_jonas_thumb_big.jpg',
  '/pics/monster_juri_thumb_big.jpg',
  '/pics/monster_kalle_thumb_big.jpg',
  '/pics/monster_knuffling_thumb_big.jpg',
  '/pics/monster_lars_thumb_big.jpg',
  '/pics/monster_lila_thumb_big.jpg',
  '/pics/monster_luppa_thumb_big.jpg',
  '/pics/monster_mello_thumb_big.jpg',
  '/pics/monster_milo_thumb_big.jpg',
  '/pics/monster_moritz_thumb_big.jpg',
  '/pics/monster_mueffo_thumb_big.jpg',
  '/pics/monster_nika_thumb_big.jpg',
  '/pics/monster_noko_thumb_big.jpg',
  '/pics/monster_oskar_thumb_big.jpg',
  '/pics/monster_rocko_thumb_big.jpg',
  '/pics/monster_sami_thumb_big.jpg',
  '/pics/monster_theo_thumb_big.jpg',
  '/pics/monster_timmi_thumb_big.jpg',
  '/pics/monster_tobi_thumb_big.jpg',
  '/pics/monster_wibbel_thumb_big.jpg',
  '/pics/monster_yeti_thumb_big.jpg',
  '/pics/monster_zari_thumb_big.jpg',
  '/pics/monstr_pepe_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_070fd42a-8d12-49e0-bb5a-3cfb5c2b9c46_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_12f803fe-f045-417d-84a7-f4971e9cb58a_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_54da1e30-2546-4777-8db6-b40a8298564e_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_7d74af75-92f0-490f-87ab-75a37548de49_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_893872d5-0322-40be-a5af-d3caf49c778f_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_92e41a65-f5fa-4a59-859f-b93a9aa2c3c4_big_thumb_big.jpg',
  '/pics/morpheuxx_cute_monster_white_background_fa3a2289-4f7f-4ab4-8820-5a69e4a0056d_big_thumb_big.jpg',
];

export default function Home() {
  const [gridSize, setGridSize] = useState(4);
  const { gameState, stats, startNewGame, handleCardClick } = useMemoryGame({
    gridSize,
    imageUrls: MONSTER_IMAGES,
  });

  const handleNewGame = () => {
    startNewGame();
  };

  const handleResetGame = () => {
    startNewGame();
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <img 
                src="/monstershape_white.png" 
                alt="Monster" 
                className="w-8 h-8 filter brightness-0 invert"
              />
              <h1 className="text-2xl font-bold text-white whitespace-nowrap">
                Monstermemory
              </h1>
            </div>
            
            {/* Game Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleNewGame}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
              >
                New Game
              </button>
              
              {gameState.gameStartTime !== null && (
                <button
                  onClick={handleResetGame}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                >
                  Reset
                </button>
              )}
              
              <div className="flex items-center gap-2">
                <label htmlFor="grid-size" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                  Grid:
                </label>
                <select
                  id="grid-size"
                  value={gridSize}
                  onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={4}>4x4</option>
                  <option value={6}>6x6</option>
                  <option value={8}>8x8</option>
                </select>
              </div>
            </div>
            
            {/* Game Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{gameState.moves}</div>
                <div className="text-xs text-gray-400">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{gameState.matchedPairs}</div>
                <div className="text-xs text-gray-400">Matched</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-500">
                  {gameState.gameStartTime && !gameState.isGameComplete 
                    ? Math.floor((Date.now() - gameState.gameStartTime) / 1000)
                    : gameState.isGameComplete 
                      ? Math.floor((gameState.gameEndTime! - gameState.gameStartTime!) / 1000)
                      : 0}s
                </div>
                <div className="text-xs text-gray-400">Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">
                  {gameState.moves > 0 ? Math.round((gameState.matchedPairs * 2 / gameState.moves) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <GameBoard
            gameState={gameState}
            onCardClick={handleCardClick}
            gridSize={gridSize}
          />
        </div>
      </div>
    </div>
  );
}