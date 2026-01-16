# TextDrive - ASCII-Based Driving Game

TextDrive is a minimalist driving game where the entire course is drawn with ASCII blocks. Navigate your car (車) through the scrolling course by avoiding walls (■) and see how far you can go!

**[Play Now](https://text-drive.vercel.app/)** | [How to Play](#how-to-play) | [Development](#getting-started)

---

## Quick Start (3 steps)

```bash
# 1. Clone and navigate to the project
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-react

# 2. Install dependencies
npm install

# 3. Start the game
npm run dev
```

Then open http://localhost:5173 in your browser.

> **Note:** You need [Node.js](https://nodejs.org/) version 24 or higher (LTS). Download it from https://nodejs.org/ if you don't have it installed.

---

## How to Play

| Control | Keyboard | Touch/Mobile |
|---------|----------|--------------|
| Move Left | `←` Arrow | Tap `←` button |
| Move Right | `→` Arrow | Tap `→` button |
| Restart | `R` key | Tap `Restart` button |

**Goal:** Drive your car (車) as far as possible without hitting the walls (■).

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js 24+** - [Download here](https://nodejs.org/)
  - To check your version: `node --version`
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yukiharada1228/text-drive.git
   cd text-drive/textdrive-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the game:**

   Go to http://localhost:5173 in your browser

### Troubleshooting

| Problem | Solution |
|---------|----------|
| `node: command not found` | Install Node.js from https://nodejs.org/ |
| `npm install` fails | Try deleting `node_modules` folder and run `npm install` again |
| Port 5173 already in use | Stop other dev servers or use `npm run dev -- --port 3000` |

### Building for Production

```bash
# Create production build
npm run build

# Preview the build locally
npm run preview
```

---

## Features

- **ASCII Art Graphics** - Courses made entirely with the `■` character
- **Simple Controls** - Arrow keys or on-screen touch buttons
- **Mobile-Friendly** - Responsive design that scales to any screen size
- **Distance Scoring** - Track how far you can go

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Testing | Vitest + React Testing Library |

---

## Project Structure

```
textdrive-react/
├── src/
│   ├── components/    # UI components (GameScreen, Player, etc.)
│   ├── hooks/         # Custom hooks (useGameLoop, useKeyboardInput, etc.)
│   ├── gameLogic.ts   # Core game logic
│   └── App.tsx        # Main application
└── public/            # Static assets
```

---

## License

MIT License - feel free to use this project for learning or building your own games!

---

## Links

- [Live Demo](https://text-drive.vercel.app/)
- [Report a Bug](https://github.com/yukiharada1228/text-drive/issues)
- [Node.js Download](https://nodejs.org/)
