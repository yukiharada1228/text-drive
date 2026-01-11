// ========================
// Game Constants
// ========================
export const CONFIG = {
  SCREEN_WIDTH: 360,
  SCREEN_HEIGHT: 600,
  CELL_SIZE: 40,
  COLS: 9,
  FPS: 60,
  SCROLL_SPEED: 166.67, // milliseconds (10 frames at 60fps = 10/60 * 1000)
  KEY_REPEAT_DELAY: 83.33, // milliseconds (5 frames at 60fps = 5/60 * 1000)
};

const ROWS = Math.floor(CONFIG.SCREEN_HEIGHT / CONFIG.CELL_SIZE);

// ========================
// Course Patterns
// ========================
const COURSE_PATTERNS = [
  "■■■   ■■■",
  "■■■■   ■■",
  "■■■■■   ■",
  "■■■■■■   ",
  "■■■■■   ■",
  "■■■■   ■■",
  "■■■   ■■■",
  "■■   ■■■■",
  "■   ■■■■■",
  "   ■■■■■■",
  "■   ■■■■■",
  "■■   ■■■■",
];

// ========================
// Type Definitions
// ========================
export interface GameState {
  playerX: number;
  playerRow: number;
  scrollOffset: number;
  currentPattern: number;
  scrollTimer: number;
  keyTimer: number;
  courseRows: string[][];
  gameOver: boolean;
}

// ========================
// Utilities
// ========================
const nextPatternIndex = (current: number): number => {
  const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
  return (current + change + COURSE_PATTERNS.length) % COURSE_PATTERNS.length;
};

const rowFromPattern = (patternIndex: number): string[] =>
  COURSE_PATTERNS[patternIndex].split("");

// ========================
// Course Generation
// ========================
const generateNewRow = (currentPattern: number): { row: string[]; newPattern: number } => {
  const newPattern = nextPatternIndex(currentPattern);
  return { row: rowFromPattern(newPattern), newPattern };
};

// ========================
// Collision Detection
// ========================
const checkCollision = (x: number, row: number, courseRows: string[][]): boolean => {
  if (row >= courseRows.length || x < 0 || x >= courseRows[row].length) return false;
  return courseRows[row][x] === "■";
};

// ========================
// Initial State
// ========================
export const createInitialGameState = (): GameState => ({
  playerX: Math.floor(CONFIG.COLS / 2),
  playerRow: ROWS - 2,
  scrollOffset: 0,
  currentPattern: 0,
  scrollTimer: 0,
  keyTimer: 0,
  courseRows: [],
  gameOver: false,
});

// ========================
// Input Handling
// ========================
const handleInput = (state: GameState, keys: { [key: string]: boolean }, deltaTime: number): GameState => {
  const newKeyTimer = state.keyTimer - deltaTime;
  if (newKeyTimer > 0) return { ...state, keyTimer: newKeyTimer };

  let dx = 0;
  if (keys["ArrowLeft"] || keys["left"]) dx = -1;
  if (keys["ArrowRight"] || keys["right"]) dx = 1;

  if (dx === 0) return { ...state, keyTimer: Math.max(0, newKeyTimer) };

  const newX = state.playerX + dx;
  if (newX < 0 || newX >= CONFIG.COLS) return state; // Out of bounds

  const newState = { ...state, playerX: newX, keyTimer: CONFIG.KEY_REPEAT_DELAY };
  if (checkCollision(newX, newState.playerRow, newState.courseRows)) {
    newState.gameOver = true;
  }
  return newState;
};

// ========================
// Scroll Handling
// ========================
const handleScroll = (state: GameState, deltaTime: number): GameState => {
  const newState = { ...state, scrollTimer: state.scrollTimer + deltaTime };

  if (newState.scrollTimer < CONFIG.SCROLL_SPEED) return newState;
  newState.scrollTimer = newState.scrollTimer - CONFIG.SCROLL_SPEED;

  const { row, newPattern } = generateNewRow(newState.currentPattern);
  newState.currentPattern = newPattern;
  newState.courseRows = [row, ...newState.courseRows].slice(0, ROWS);
  newState.scrollOffset++;

  if (checkCollision(newState.playerX, newState.playerRow, newState.courseRows)) {
    newState.gameOver = true;
  }

  return newState;
};

// ========================
// Game Update
// ========================
export const updateGameState = (currentState: GameState, keys: { [key: string]: boolean }, deltaTime: number): GameState => {
  if (currentState.gameOver) return currentState;

  let newState = handleInput(currentState, keys, deltaTime);
  newState = handleScroll(newState, deltaTime);
  return newState;
};
