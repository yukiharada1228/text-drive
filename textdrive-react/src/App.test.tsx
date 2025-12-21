import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as gameLogic from './gameLogic'

describe('App', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 0)
      return 0
    })

    // Mock cancelAnimationFrame
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial Rendering', () => {
    it('should render the app without crashing', () => {
      render(<App />)
      expect(document.querySelector('.min-h-screen')).not.toBeNull()
    })

    it('should render control buttons', () => {
      render(<App />)
      const buttons = screen.getAllByRole('button')

      // Left and Right control buttons should be present
      expect(buttons.length).toBeGreaterThanOrEqual(2)
      expect(buttons.some(btn => btn.textContent === '←')).toBe(true)
      expect(buttons.some(btn => btn.textContent === '→')).toBe(true)
    })

    it('should display initial distance of 0', () => {
      render(<App />)
      expect(screen.getByText(/Distance: 0/)).not.toBeNull()
    })

    it('should render the player character', () => {
      render(<App />)
      expect(screen.getByText('車')).not.toBeNull()
    })
  })

  describe('Game State Management', () => {
    it('should not show game over screen initially', () => {
      render(<App />)
      expect(screen.queryByText('Game Over')).toBeNull()
    })

    it('should show game over screen when game is over', async () => {
      // Mock updateGameState to return game over state immediately
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 42,
      })

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      expect(screen.getByText(/Final Distance: 42/)).not.toBeNull()
    })
  })

  describe('Control Buttons', () => {
    it('should handle left button click', async () => {
      const user = userEvent.setup()
      render(<App />)

      const leftButton = screen.getByText('←')
      await user.click(leftButton)

      // Button should be clickable without errors
      expect(leftButton).not.toBeNull()
    })

    it('should handle right button click', async () => {
      const user = userEvent.setup()
      render(<App />)

      const rightButton = screen.getByText('→')
      await user.click(rightButton)

      // Button should be clickable without errors
      expect(rightButton).not.toBeNull()
    })
  })

  describe('Keyboard Input', () => {
    it('should handle keyboard input for restart when game is over', async () => {
      const user = userEvent.setup()

      // Mock updateGameState to return game over state
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 42,
      })

      render(<App />)

      // Wait for game over screen
      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      // Restore the mock to allow normal behavior after restart
      mockUpdateGameState.mockRestore()

      // Press 'r' key to restart
      await user.keyboard('r')

      // After restart, distance should reset
      await waitFor(() => {
        expect(screen.queryByText('Game Over')).toBeNull()
      }, { timeout: 1000 })
    })

    it('should handle uppercase R key for restart', async () => {
      const user = userEvent.setup()

      // Mock updateGameState to return game over state
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 100,
      })

      render(<App />)

      // Wait for game over screen
      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      // Restore the mock to allow normal behavior after restart
      mockUpdateGameState.mockRestore()

      // Press 'R' key (uppercase) to restart
      await user.keyboard('R')

      // After restart, game over should be gone
      await waitFor(() => {
        expect(screen.queryByText('Game Over')).toBeNull()
      }, { timeout: 1000 })
    })
  })

  describe('Restart Functionality', () => {
    it('should restart game when restart button is clicked', async () => {
      const user = userEvent.setup()

      // Mock updateGameState to return game over state
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 123,
      })

      render(<App />)

      // Wait for game over screen
      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      expect(screen.getByText(/Final Distance: 123/)).not.toBeNull()

      // Restore the mock to allow normal behavior after restart
      mockUpdateGameState.mockRestore()

      // Click restart button
      const restartButton = screen.getByText('Restart')
      await user.click(restartButton)

      // After restart, game over should be gone
      await waitFor(() => {
        expect(screen.queryByText('Game Over')).toBeNull()
      }, { timeout: 1000 })
    })

    it('should reset game state when restarting', async () => {
      const user = userEvent.setup()

      // Mock updateGameState to return game over state
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 50,
      })

      render(<App />)

      // Wait for game over
      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      // Restore mock before restart so game can run normally
      mockUpdateGameState.mockRestore()

      // Click restart
      const restartButton = screen.getByText('Restart')
      await user.click(restartButton)

      // After restart, should show initial distance
      await waitFor(() => {
        expect(screen.queryByText('Game Over')).toBeNull()
      }, { timeout: 1000 })

      // Initial distance should be shown
      expect(screen.getByText(/Distance: 0/)).not.toBeNull()
    })
  })

  describe('Responsive Scaling', () => {
    it('should render game area with proper dimensions', () => {
      render(<App />)

      const gameArea = document.querySelector('.border.border-black.relative.overflow-hidden')
      expect(gameArea).not.toBeNull()
      expect(gameArea).toHaveProperty('style')
    })

    it('should handle window resize events', async () => {
      render(<App />)

      // Trigger resize event
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 400, writable: true })

      window.dispatchEvent(new Event('resize'))

      // Wait for resize to be processed
      await waitFor(() => {
        const gameArea = document.querySelector('.border.border-black.relative.overflow-hidden')
        expect(gameArea).not.toBeNull()
      }, { timeout: 500 })
    })
  })

  describe('Component Integration', () => {
    it('should show score display in game screen', () => {
      render(<App />)

      // Score should be visible
      const scoreElement = screen.getByText(/Distance:/)
      expect(scoreElement).not.toBeNull()
      expect(scoreElement.classList.contains('absolute')).toBe(true)
    })

    it('should render game over screen with all elements', async () => {
      // Mock updateGameState to return game over state
      const mockUpdateGameState = vi.spyOn(gameLogic, 'updateGameState')
      mockUpdateGameState.mockReturnValue({
        ...gameLogic.createInitialGameState(),
        gameOver: true,
        scrollOffset: 75,
      })

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Game Over')).not.toBeNull()
      }, { timeout: 1000 })

      expect(screen.getByText(/Final Distance: 75/)).not.toBeNull()
      expect(screen.getByText(/Press R to restart/)).not.toBeNull()
      expect(screen.getByText('Restart')).not.toBeNull()
    })
  })
})
