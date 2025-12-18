# TextDrive - ASCII-Based Driving Game

TextDrive is a minimalist driving game where the entire course is drawn with ASCII blocks. Navigate your car (車) through the scrolling course by avoiding walls (■) and see how far you can go!

## 🎮 Live Demo

Play the game now: **[https://text-drive.vercel.app/](https://text-drive.vercel.app/)**

## ✨ Features

- 🎯 **ASCII Art Graphics**: Courses made entirely with the `■` character
- 🎮 **Simple Controls**: Arrow keys or on-screen touch buttons
- 📱 **Mobile-Friendly**: Responsive design that scales to any screen size
- ⌨️ **Multiple Input Methods**: Full keyboard and touch support
- 🧪 **Well Tested**: 37 comprehensive tests with 100% pass rate
- 🎨 **Clean Architecture**: Modular components and custom hooks
- 🚀 **Fast Performance**: Built with Vite and optimized with React.memo
- 📊 **Distance Scoring**: Track your best run

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **Testing**: Vitest 4.0 + React Testing Library
- **Code Quality**: ESLint 9.36
- **Deployment**: Vercel

## 📁 Project Structure

```
text-drive/
├── textdrive-react/          # React web application
│   ├── src/
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useResponsiveScale.ts
│   │   │   ├── useKeyboardInput.ts
│   │   │   ├── useGameLoop.ts
│   │   │   └── useTouchControls.ts
│   │   ├── components/       # UI components
│   │   │   ├── CourseRow.tsx
│   │   │   ├── Player.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── GameOverScreen.tsx
│   │   │   ├── ControlButtons.tsx
│   │   │   └── GameScreen.tsx
│   │   ├── App.tsx           # Main application
│   │   ├── gameLogic.ts      # Pure game logic
│   │   └── test/             # Test configuration
│   └── public/               # Static assets
├── create_favicon.py         # Favicon generation script
└── pyproject.toml            # Python dependencies (for favicon generation)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser to play

### Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎯 How to Play

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

## 🧪 Testing

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

## 📜 Available Scripts

In the `textdrive-react/` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## 🏗️ Architecture Highlights

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
Pure functions in `gameLogic.ts` handling:
- Course generation with randomized patterns
- Collision detection
- Input processing
- Scroll management
- State updates

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development Tools

### Favicon Generation

The project includes a Python script to generate the favicon:

```bash
# Install Python dependencies using uv
uv sync

# Generate favicon
uv run create_favicon.py
```

The script creates a favicon with the car character (車) using the same font as the game.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Contact

If you have any questions or suggestions, feel free to open an issue on GitHub.
