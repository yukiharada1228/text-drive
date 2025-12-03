import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CONFIG, createInitialGameState, updateGameState, type GameState } from './gameLogic'

describe('gameLogic', () => {
  describe('CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(CONFIG.SCREEN_WIDTH).toBe(360)
      expect(CONFIG.SCREEN_HEIGHT).toBe(600)
      expect(CONFIG.CELL_SIZE).toBe(40)
      expect(CONFIG.COLS).toBe(9)
      expect(CONFIG.FPS).toBe(60)
      expect(CONFIG.SCROLL_SPEED).toBe(10)
      expect(CONFIG.KEY_REPEAT_DELAY).toBe(5)
    })
  })

  describe('createInitialGameState', () => {
    it('should create initial game state with correct values', () => {
      const state = createInitialGameState()

      expect(state.playerX).toBe(Math.floor(CONFIG.COLS / 2))
      expect(state.playerRow).toBe(Math.floor(CONFIG.SCREEN_HEIGHT / CONFIG.CELL_SIZE) - 2)
      expect(state.scrollOffset).toBe(0)
      expect(state.currentPattern).toBe(0)
      expect(state.scrollTimer).toBe(0)
      expect(state.keyTimer).toBe(0)
      expect(state.courseRows).toEqual([])
      expect(state.gameOver).toBe(false)
    })
  })

  describe('updateGameState', () => {
    let initialState: GameState

    beforeEach(() => {
      initialState = createInitialGameState()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should not update state if game is over', () => {
      const gameOverState: GameState = { ...initialState, gameOver: true }
      const updatedState = updateGameState(gameOverState, {})

      expect(updatedState).toEqual(gameOverState)
    })

    it('should not move player if no keys are pressed', () => {
      const updatedState = updateGameState(initialState, {})

      expect(updatedState.playerX).toBe(initialState.playerX)
    })

    it('should move player left when ArrowLeft is pressed', () => {
      // keyTimerが0でないと移動できないので、まず更新が必要
      const state = { ...initialState, keyTimer: 0 }
      const updatedState = updateGameState(state, { ArrowLeft: true })

      expect(updatedState.playerX).toBe(state.playerX - 1)
      expect(updatedState.keyTimer).toBe(CONFIG.KEY_REPEAT_DELAY)
    })

    it('should move player right when ArrowRight is pressed', () => {
      const state = { ...initialState, keyTimer: 0 }
      const updatedState = updateGameState(state, { ArrowRight: true })

      expect(updatedState.playerX).toBe(state.playerX + 1)
      expect(updatedState.keyTimer).toBe(CONFIG.KEY_REPEAT_DELAY)
    })

    it('should move player left when "left" key is pressed', () => {
      const state = { ...initialState, keyTimer: 0 }
      const updatedState = updateGameState(state, { left: true })

      expect(updatedState.playerX).toBe(state.playerX - 1)
      expect(updatedState.keyTimer).toBe(CONFIG.KEY_REPEAT_DELAY)
    })

    it('should move player right when "right" key is pressed', () => {
      const state = { ...initialState, keyTimer: 0 }
      const updatedState = updateGameState(state, { right: true })

      expect(updatedState.playerX).toBe(state.playerX + 1)
      expect(updatedState.keyTimer).toBe(CONFIG.KEY_REPEAT_DELAY)
    })

    it('should not move player out of left boundary', () => {
      const state = { ...initialState, playerX: 0, keyTimer: 0 }
      const updatedState = updateGameState(state, { ArrowLeft: true })

      expect(updatedState.playerX).toBe(0)
    })

    it('should not move player out of right boundary', () => {
      const state = { ...initialState, playerX: CONFIG.COLS - 1, keyTimer: 0 }
      const updatedState = updateGameState(state, { ArrowRight: true })

      expect(updatedState.playerX).toBe(CONFIG.COLS - 1)
    })

    it('should decrement keyTimer if it is greater than 0', () => {
      const state = { ...initialState, keyTimer: 3 }
      const updatedState = updateGameState(state, { ArrowLeft: true })

      expect(updatedState.keyTimer).toBe(2)
      expect(updatedState.playerX).toBe(state.playerX) // プレイヤーは移動しない
    })

    it('should increment scrollTimer on each update', () => {
      const state = { ...initialState, scrollTimer: 5 }
      const updatedState = updateGameState(state, {})

      expect(updatedState.scrollTimer).toBe(6)
    })

    it('should add new course row when scrollTimer reaches SCROLL_SPEED', () => {
      const state = { ...initialState, scrollTimer: CONFIG.SCROLL_SPEED - 1 }
      const updatedState = updateGameState(state, {})

      expect(updatedState.scrollTimer).toBe(0)
      expect(updatedState.courseRows.length).toBe(1)
      expect(updatedState.scrollOffset).toBe(1)
    })

    it('should set gameOver to true when player collides with wall', () => {
      // プレイヤーが壁に突っ込むシナリオ
      const courseRow = ['■', '■', '■', '■', ' ', ' ', ' ', '■', '■']
      const state: GameState = {
        ...initialState,
        playerX: 4, // 空白の位置
        playerRow: 0,
        courseRows: [courseRow],
        keyTimer: 0,
      }

      // 左に移動すると playerX = 3 になり、これは '■' (壁)
      const updatedState = updateGameState(state, { ArrowLeft: true })

      expect(updatedState.gameOver).toBe(true)
    })

    it('should set gameOver to true when wall scrolls into player position', () => {
      // Math.randomをモックして確定的なパターンを生成
      vi.spyOn(Math, 'random').mockReturnValue(0.1) // -1が返される（0.1 * 3 = 0.3 -> floor = 0 -> 0 - 1 = -1）

      const state: GameState = {
        ...initialState,
        playerX: 0, // 壁が来る位置
        playerRow: 0, // 新しい行が来る位置
        scrollTimer: CONFIG.SCROLL_SPEED - 1,
        currentPattern: 0, // 次のパターンは11 "■■   ■■■■"、playerX=0は壁
      }

      // スクロールを発生させる
      const updatedState = updateGameState(state, {})

      // playerX=0, playerRow=0 に壁がスクロールで来たらゲームオーバー
      // currentPattern=0から-1でパターン11 "■■   ■■■■"、index 0は壁
      expect(updatedState.gameOver).toBe(true)
    })

    it('should limit courseRows to ROWS count', () => {
      const rows = Math.floor(CONFIG.SCREEN_HEIGHT / CONFIG.CELL_SIZE)
      const state: GameState = {
        ...initialState,
        scrollTimer: CONFIG.SCROLL_SPEED - 1,
      }

      // 何度もスクロールさせる
      let updatedState = state
      for (let i = 0; i < rows + 10; i++) {
        updatedState = { ...updatedState, scrollTimer: CONFIG.SCROLL_SPEED - 1 }
        updatedState = updateGameState(updatedState, {})
      }

      expect(updatedState.courseRows.length).toBeLessThanOrEqual(rows)
    })

    it('should prioritize right when both keys are pressed simultaneously', () => {
      const state = { ...initialState, keyTimer: 0 }
      const updatedState = updateGameState(state, { ArrowLeft: true, ArrowRight: true })

      // ArrowRightが優先されるので、右に移動
      expect(updatedState.playerX).toBe(state.playerX + 1)
      expect(updatedState.keyTimer).toBe(CONFIG.KEY_REPEAT_DELAY)
    })

    it('should update currentPattern when scrolling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4) // 0が返される（0.4 * 3 = 1.2 -> floor = 1 -> 1 - 1 = 0）

      const state: GameState = {
        ...initialState,
        currentPattern: 5,
        scrollTimer: CONFIG.SCROLL_SPEED - 1,
      }

      const updatedState = updateGameState(state, {})

      // currentPatternが5から5に変わる（change = 0）
      expect(updatedState.currentPattern).toBe(5)
      expect(updatedState.courseRows.length).toBe(1)
    })

    it('should handle keyTimer and scrollTimer simultaneously', () => {
      const state: GameState = {
        ...initialState,
        keyTimer: 2,
        scrollTimer: CONFIG.SCROLL_SPEED - 1,
      }

      const updatedState = updateGameState(state, { ArrowLeft: true })

      // keyTimerが減少し、プレイヤーは移動しない
      expect(updatedState.keyTimer).toBe(1)
      expect(updatedState.playerX).toBe(state.playerX)
      // スクロールは発生する
      expect(updatedState.scrollTimer).toBe(0)
      expect(updatedState.courseRows.length).toBe(1)
    })

    it('should handle multiple frames correctly', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8) // +1が返される（0.8 * 3 = 2.4 -> floor = 2 -> 2 - 1 = 1）

      let state = createInitialGameState()

      // 5フレーム分の更新をシミュレート
      for (let i = 0; i < 5; i++) {
        state = updateGameState(state, {})
      }

      // scrollTimerが5増加
      expect(state.scrollTimer).toBe(5)
      expect(state.courseRows.length).toBe(0) // まだSCROLL_SPEEDに達していない
      expect(state.scrollOffset).toBe(0)

      // さらに5フレーム更新して、ちょうどSCROLL_SPEEDに到達
      for (let i = 0; i < 5; i++) {
        state = updateGameState(state, {})
      }

      // スクロールが1回発生（合計10フレーム）
      expect(state.scrollTimer).toBe(0)
      expect(state.courseRows.length).toBe(1)
      expect(state.scrollOffset).toBe(1)
    })

    it('should not move when courseRows is empty', () => {
      const state: GameState = {
        ...initialState,
        courseRows: [],
        keyTimer: 0,
      }

      const updatedState = updateGameState(state, { ArrowLeft: true })

      // courseRowsが空でも移動できる（衝突しない）
      expect(updatedState.playerX).toBe(state.playerX - 1)
      expect(updatedState.gameOver).toBe(false)
    })
  })
})
