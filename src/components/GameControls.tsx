'use client';

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
  isGameActive: boolean;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
}

export default function GameControls({ 
  onNewGame, 
  onResetGame, 
  isGameActive, 
  gridSize, 
  onGridSizeChange 
}: GameControlsProps) {
  // Updated with new grid size options
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Game Controls</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={onNewGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            New Game
          </button>
          
          {isGameActive && (
            <button
              onClick={onResetGame}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Reset
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <label htmlFor="grid-size" className="text-sm font-medium text-gray-300">
            Grid Size:
          </label>
          <select
            id="grid-size"
            value={gridSize}
            onChange={(e) => onGridSizeChange(Number(e.target.value))}
            className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isGameActive}
          >
            <option value={2}>2x2 (4 cards)</option>
            <option value={4}>4x4 (16 cards)</option>
            <option value={6}>6x6 (36 cards)</option>
            <option value={8}>8x8 (64 cards)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

