import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the game components since they might have complex dependencies
jest.mock('../components/GameBoard', () => {
  return function MockGameBoard() {
    return <div data-testid="game-board">Game Board</div>
  }
})

jest.mock('../components/GameControls', () => {
  return function MockGameControls() {
    return <div data-testid="game-controls">Game Controls</div>
  }
})

jest.mock('../components/GameStats', () => {
  return function MockGameStats() {
    return <div data-testid="game-stats">Game Stats</div>
  }
})

describe('Home Page', () => {
  it('renders the main page with game components', () => {
    render(<Home />)
    
    // Check if the main heading is present
    expect(screen.getByText('Monstermemory')).toBeInTheDocument()
    
    // Check if game components are rendered
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
    expect(screen.getByTestId('game-controls')).toBeInTheDocument()
    expect(screen.getByTestId('game-stats')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
  })
})

