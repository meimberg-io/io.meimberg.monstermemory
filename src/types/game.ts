export interface Card {
  id: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: string[];
  matchedPairs: number;
  moves: number;
  isGameComplete: boolean;
  gameStartTime: number | null;
  gameEndTime: number | null;
}

export interface GameStats {
  totalMoves: number;
  totalTime: number;
  matchedPairs: number;
  accuracy: number;
}

