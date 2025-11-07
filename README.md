# TextDrive - ASCII-Only Driving Game

TextDrive is a minimalist driving game where the entire course is drawn with ASCII blocks. Steer the car through the gaps and see how far you can go without crashing.

## Project Structure

- **React Edition (`textdrive-react/`)**: Web implementation built with React, TypeScript, and Tailwind CSS (primary target)
- **Python Edition (`main.py`)**: pygame version refactored with a React-style component architecture

## Game Features

- Courses made entirely of the `■` character
- Control the car with arrow keys or on-screen touch buttons
- Colliding with a wall ends the run
- Distance-based scoring for pick-up-and-play sessions
- Mobile-friendly layout with responsive scaling
- Component-driven architecture for easy customization

## Getting Started

Clone the repository:

```bash
git clone https://github.com/yukiharada1228/TextDrive.git
cd TextDrive
```

### React Edition (Recommended)

Install dependencies:

```bash
cd textdrive-react
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to play.

Create a production build:

```bash
npm run build
```

### Python Edition

Install dependencies:

```bash
uv sync
```

Run the game:

```bash
uv run main.py
```

## Deployment

The project is deployed on Vercel.

- **Production**: [https://text-drive.vercel.app/](https://text-drive.vercel.app/)

Play the browser version directly at the URL above.

## Development Environment

- **Node.js**: 18.x or newer
- **Python**: 3.12 or newer
- **Package managers**:
  - Python edition: `uv`
  - React edition: `npm`

## Controls

### Web (React)
- **Keyboard**
  - Left Arrow: Move left
  - Right Arrow: Move right
  - `R`: Restart after game over
- **Touch**
  - Left button: Move left
  - Right button: Move right
  - Restart button: Restart after game over

### Python
- Left Arrow: Move left
- Right Arrow: Move right
- `R`: Restart after game over

## Rules

- Black squares (`■`) are walls—hitting one ends the run
- Follow the gaps to advance
- The course starts empty and gradually spawns new rows
- Push for the longest distance possible

## Technical Notes

### Python Edition (`main.py`)
- **Framework**: pygame
- **Architecture**: React-inspired component system
- **Key components**:
  - `GameState`: State container similar to React state
  - `CourseComponent`: Renders the ASCII course
  - `PlayerComponent`: Renders the player car
  - `UIComponent`: Handles in-game HUD
  - `GameOverComponent`: Displays the end screen
  - `App`: Main application orchestrator
- **Custom hooks**:
  - `use_scroll()`: Scroll management
  - `use_input()`: Keyboard handling
- **Pure functions**:
  - `generate_course_row()`: Creates new course rows
  - `check_collision()`: Collision detection

### React Edition (`textdrive-react/`)
- **Framework**: React 19 + TypeScript
- **Build tool**: Vite (rolldown)
- **Styling**: Tailwind CSS v4
- **State management**: React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useMemo`)
- **Architecture**: Component-based design with memoization
- **Key components**:
  - `App`: Main application wrapper
  - `GameScreen`: Layout of the main playfield
  - `CourseRow`: Renders each ASCII row (memoized)
  - `Player`: Renders the car (memoized)
  - `ScoreDisplay`: Shows distance (memoized)
  - `GameOverScreen`: End-of-run overlay (memoized)
  - `ControlButtons`: On-screen controls (memoized)
- **Custom hooks**:
  - `useKeyboardInput`: Keyboard event handling
  - `useGameLoop`: Frame timing and updates
  - `useTouchControls`: Touch button interactions
- **Game logic**: Pure functions in `gameLogic.ts`
- **Performance**: Heavy use of `React.memo`, `useMemo`, and `useCallback`
