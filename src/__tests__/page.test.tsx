import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the game components since they might have complex dependencies
jest.mock('../components/GameBoard', () => {
  return function MockGameBoard() {
    return <div data-testid="game-board">Game Board</div>
  }
})

// GameControls and GameStats are integrated into the main page, not separate components

describe('Home Page', () => {
  it('renders the main page with game components', () => {
    render(<Home />)
    
    // Check if the main heading is present
    expect(screen.getByText('Monstermemory')).toBeInTheDocument()
    
    // Check if game components are rendered
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
    
    // Check if game controls are present (buttons and select)
    expect(screen.getByText('Neues Spiel')).toBeInTheDocument()
    expect(screen.getByText('Bilder Online Kaufen')).toBeInTheDocument()
    expect(screen.getByText('2x2 (4 cards)')).toBeInTheDocument()
    expect(screen.getByText('4x4 (16 cards)')).toBeInTheDocument()
    
    // Check if game stats are present
    expect(screen.getByText('Züge')).toBeInTheDocument()
    expect(screen.getByText('Gefunden')).toBeInTheDocument()
    expect(screen.getByText('Zeit')).toBeInTheDocument()
    expect(screen.getByText('Genauigkeit')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
  })
})

