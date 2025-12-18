# TextDrive

A simple ASCII-based driving game built with React and TypeScript. Navigate your car (車) through a scrolling course by avoiding walls (■).

## Features

- 🎮 **Simple Controls**: Arrow keys or touch controls to move left/right
- 📱 **Responsive Design**: Automatically scales to fit any screen size
- ⌨️ **Multiple Input Methods**: Keyboard and touch support
- 🧪 **Well Tested**: 37 comprehensive tests with 100% pass rate
- 🎨 **Clean Architecture**: Modular components and custom hooks
- 🚀 **Fast Performance**: Built with Vite and optimized with React.memo

## Tech Stack

- **Frontend Framework**: React 19.1
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Testing**: Vitest 4.0 + React Testing Library
- **Code Quality**: ESLint 9.36

## Project Structure

```
src/
├── hooks/                    # Custom React hooks
│   ├── useResponsiveScale.ts    # Responsive scaling logic
│   ├── useKeyboardInput.ts      # Keyboard input handling
│   ├── useGameLoop.ts           # Game loop management
│   └── useTouchControls.ts      # Touch control handling
├── components/               # UI components
│   ├── CourseRow.tsx            # Course row rendering
│   ├── Player.tsx               # Player character
│   ├── ScoreDisplay.tsx         # Score display
│   ├── GameOverScreen.tsx       # Game over screen
│   ├── ControlButtons.tsx       # Touch control buttons
│   └── GameScreen.tsx           # Main game screen
├── App.tsx                   # Main application component
├── gameLogic.ts              # Core game logic
├── main.tsx                  # Application entry point
└── test/                     # Test configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd textdrive-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## How to Play

### Objective
Drive your car (車) as far as possible without hitting the walls (■).

### Controls

**Keyboard:**
- `←` or `ArrowLeft` - Move left
- `→` or `ArrowRight` - Move right
- `R` - Restart (when game over)

**Touch:**
- Tap the `←` button to move left
- Tap the `→` button to move right
- Tap the `Restart` button when game over

### Game Rules

1. Your car automatically scrolls forward
2. Avoid hitting the walls (■)
3. The course pattern changes dynamically as you progress
4. Your score is based on the distance traveled
5. Game ends when you hit a wall

## Testing

The project includes comprehensive tests covering:

- **Game Logic**: 21 unit tests for core game mechanics
- **Components**: 16 integration tests for React components
- **Total Coverage**: 37 tests with 100% pass rate

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate coverage report:
```bash
npm run test:coverage
```

## Development

### Code Quality

The project uses ESLint with strict TypeScript rules. Run the linter:
```bash
npm run lint
```

### Building for Production

Build the project:
```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build:
```bash
npm run preview
```

## Architecture Highlights

### Custom Hooks
- **useResponsiveScale**: Handles responsive scaling across different screen sizes
- **useKeyboardInput**: Manages keyboard event listeners and input state
- **useGameLoop**: Controls the game loop using requestAnimationFrame
- **useTouchControls**: Handles touch input for mobile devices

### Components
All components are memoized using `React.memo` for optimal performance:
- **GameScreen**: Renders the active game state
- **GameOverScreen**: Shows game over message and restart button
- **CourseRow**: Renders individual course rows with memoized cells
- **Player**: Renders the player character
- **ScoreDisplay**: Shows current distance
- **ControlButtons**: Touch control interface

### Game Logic
Pure functions handling:
- Course generation with randomized patterns
- Collision detection
- Input processing
- Scroll management
- State updates

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)
