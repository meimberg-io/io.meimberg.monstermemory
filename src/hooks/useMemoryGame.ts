'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, GameState, GameStats } from '@/types/game';

interface UseMemoryGameProps {
  gridSize: number;
  imageUrls: string[];
}

export function useMemoryGame({ gridSize, imageUrls }: UseMemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    isGameComplete: false,
    gameStartTime: null,
    gameEndTime: null,
    wrongPairCards: [],
  });

  const [stats, setStats] = useState<GameStats>({
    totalMoves: 0,
    totalTime: 0,
    matchedPairs: 0,
    accuracy: 0,
  });

  // Create cards from image URLs
  const createCards = useCallback((urls: string[]): Card[] => {
    const totalCards = gridSize * gridSize;
    const pairsNeeded = Math.floor(totalCards / 2);
    
    // Shuffle the available images and take only the number we need for pairs
    const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledUrls.slice(0, pairsNeeded);
    
    // Create pairs
    const cardPairs: Card[] = [];
    selectedImages.forEach((url, index) => {
      const pairId = `pair-${index}`;
      cardPairs.push(
        { id: `${pairId}-1`, imageUrl: url, isFlipped: false, isMatched: false },
        { id: `${pairId}-2`, imageUrl: url, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle the cards
    return cardPairs.sort(() => Math.random() - 0.5);
  }, [gridSize]);

  // Initialize new game
  const startNewGame = useCallback(() => {
    const newCards = createCards(imageUrls);
    setGameState({
      cards: newCards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isGameComplete: false,
      gameStartTime: Date.now(),
      gameEndTime: null,
      wrongPairCards: [],
    });
    setStats({
      totalMoves: 0,
      totalTime: 0,
      matchedPairs: 0,
      accuracy: 0,
    });
  }, [createCards, imageUrls]);

  // Handle card click
  const handleCardClick = useCallback((cardId: string) => {
    setGameState(prevState => {
      // Don't allow clicking if game is complete or card is already flipped/matched
      if (prevState.isGameComplete) return prevState;
      
      const card = prevState.cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prevState;

      // Don't allow more than 2 cards to be flipped at once
      if (prevState.flippedCards.length >= 2) return prevState;

      const newFlippedCards = [...prevState.flippedCards, cardId];
      const newCards = prevState.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      // If this is the second card flipped, check for a match
      if (newFlippedCards.length === 2) {
        const [firstCardId, secondCardId] = newFlippedCards;
        const firstCard = newCards.find(c => c.id === firstCardId);
        const secondCard = newCards.find(c => c.id === secondCardId);

        if (firstCard && secondCard && firstCard.imageUrl === secondCard.imageUrl) {
          // Match found!
          const updatedCards = newCards.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isMatched: true }
              : c
          );

          const newMatchedPairs = prevState.matchedPairs + 1;
          const totalPairs = (gridSize * gridSize) / 2;
          const isGameComplete = newMatchedPairs === totalPairs;

          return {
            ...prevState,
            cards: updatedCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: prevState.moves + 1,
            isGameComplete,
            gameEndTime: isGameComplete ? Date.now() : null,
          };
        } else {
          // No match, show red border then flip cards back after a delay
          setGameState(prevState => ({
            ...prevState,
            wrongPairCards: [firstCardId, secondCardId],
          }));
          
          setTimeout(() => {
            setGameState(prevState => ({
              ...prevState,
              cards: prevState.cards.map(c => 
                c.id === firstCardId || c.id === secondCardId 
                  ? { ...c, isFlipped: false }
                  : c
              ),
              flippedCards: [],
              moves: prevState.moves + 1,
              wrongPairCards: [],
            }));
          }, 1000);
        }
      }

      return {
        ...prevState,
        cards: newCards,
        flippedCards: newFlippedCards,
      };
    });
  }, [gridSize]);

  // Update stats when game completes
  useEffect(() => {
    if (gameState.isGameComplete && gameState.gameStartTime && gameState.gameEndTime) {
      const totalTimeMs = gameState.gameEndTime - gameState.gameStartTime;
      const totalTimeSeconds = Math.floor(totalTimeMs / 1000);
      const accuracy = gameState.moves > 0 ? (gameState.matchedPairs * 2 / gameState.moves) * 100 : 0;
      
      setStats({
        totalMoves: gameState.moves,
        totalTime: totalTimeSeconds,
        matchedPairs: gameState.matchedPairs,
        accuracy,
      });
    }
  }, [gameState.isGameComplete, gameState.gameStartTime, gameState.gameEndTime, gameState.moves, gameState.matchedPairs]);

  // Restart game when grid size changes
  useEffect(() => {
    startNewGame();
  }, [gridSize, startNewGame]);

  return {
    gameState,
    stats,
    startNewGame,
    handleCardClick,
  };
}

