# TextDrive - ASCII-Based Driving Game

TextDrive is a minimalist driving game where the entire course is drawn with ASCII blocks. Navigate your car (車) through the scrolling course by avoiding walls (■) and see how far you can go!

**[Play Now](https://text-drive.vercel.app/)** | [How to Play](#how-to-play) | [Versions](#versions)

---

## Versions

| Version | Description | Directory |
|---------|-------------|-----------|
| [React (Web)](#react-version) | Browser-based version with React | `textdrive-react/` |
| [C (Terminal)](#c-version) | Terminal-based version using ncurses | `textdrive-c/` |

---

## React Version

### Quick Start

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

> **Note:** You need [Node.js](https://nodejs.org/) version 24 or higher (LTS).

---

## C Version

### Quick Start

```bash
# 1. Clone and navigate to the project
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-c

# 2. Build and run
make run
```

> **Note:** Requires `gcc` and `ncurses` library. On macOS, ncurses is pre-installed. On Ubuntu/Debian: `sudo apt install libncurses-dev`

---

## How to Play

**Goal:** Drive your car (車) as far as possible without hitting the walls (■).

### React Version Controls

| Control | Keyboard | Touch/Mobile |
|---------|----------|--------------|
| Move Left | `←` Arrow | Tap `←` button |
| Move Right | `→` Arrow | Tap `→` button |
| Restart | `R` key | Tap `Restart` button |

### C Version Controls

| Control | Keys |
|---------|------|
| Move Left | `←` Arrow or `A` |
| Move Right | `→` Arrow or `D` |
| Restart | `R` |
| Quit | `Q` |

---

## Getting Started

### React Version

#### Prerequisites

- **Node.js 24+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

#### Installation

```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-react
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

#### Building for Production

```bash
npm run build    # Create production build
npm run preview  # Preview locally
```

### C Version

#### Prerequisites

- **gcc** - C compiler
- **ncurses** - Terminal UI library
  - macOS: Pre-installed
  - Ubuntu/Debian: `sudo apt install libncurses-dev`
  - Fedora: `sudo dnf install ncurses-devel`

#### Installation

```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-c
make run
```

#### Available Make Commands

| Command | Description |
|---------|-------------|
| `make` | Build the game |
| `make run` | Build and run |
| `make test` | Run unit tests |
| `make clean` | Remove build files |

---

## Features

- **ASCII Art Graphics** - Courses made entirely with the `■` character
- **Simple Controls** - Arrow keys to move
- **Distance Scoring** - Track how far you can go
- **Two Versions** - Play in browser (React) or terminal (C)

---

## Tech Stack

### React Version

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Testing | Vitest + React Testing Library |

### C Version

| Category | Technology |
|----------|------------|
| Language | C |
| UI Library | ncurses |
| Build Tool | Make |

---

## Project Structure

```
text-drive/
├── textdrive-react/          # React (Web) version
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom hooks
│   │   ├── gameLogic.ts      # Core game logic
│   │   └── App.tsx           # Main application
│   └── public/               # Static assets
│
└── textdrive-c/              # C (Terminal) version
    ├── main.c                # Main game loop and rendering
    ├── game.h                # Game logic (header-only)
    ├── test_game.c           # Unit tests
    └── Makefile              # Build configuration
```

---

## License

MIT License - feel free to use this project for learning or building your own games!

---

## Links

- [Live Demo](https://text-drive.vercel.app/)
- [Report a Bug](https://github.com/yukiharada1228/text-drive/issues)
- [Node.js Download](https://nodejs.org/)
