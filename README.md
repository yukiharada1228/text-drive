# TextDrive - ASCII-Based Driving Game

TextDrive is a minimalist driving game where the entire course is drawn with ASCII blocks. Navigate your car (車) through the scrolling course by avoiding walls (■) and see how far you can go!

**[Play Now](https://text-drive.vercel.app/)** | [How to Play](#how-to-play) | [Versions](#versions)

---

## Versions

| Version | Description | Directory |
|---------|-------------|-----------|
| [React (Web)](#react-version) | Browser-based version with React | `textdrive-react/` |
| [Rust (Terminal)](#rust-version) | Terminal-based version with Q-learning AI | `textdrive-rust/` |

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

## Rust Version

### Quick Start

```bash
# 1. Clone and navigate to the project
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-rust

# 2. Train the AI
cargo run --release --bin train

# 3. Play with AI
cargo run --release --bin textdrive ai
```

> **Note:** Requires [Rust](https://rustup.rs/) toolchain.

### Features

- Q-learning AI for autonomous driving
- Manual and AI play modes
- Toggle between modes with `M` key

See [textdrive-rust/README.md](textdrive-rust/README.md) for more details.

---

## How to Play

**Goal:** Drive your car (車) as far as possible without hitting the walls (■).

### React Version Controls

| Control | Keyboard | Touch/Mobile |
|---------|----------|--------------|
| Move Left | `←` Arrow | Tap `←` button |
| Move Right | `→` Arrow | Tap `→` button |
| Restart | `R` key | Tap `Restart` button |

### Rust Version Controls

| Control | Keys |
|---------|------|
| Move Left | `←` Arrow or `A` |
| Move Right | `→` Arrow or `D` |
| Toggle AI/Manual | `M` |
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

### Rust Version

#### Prerequisites

- **Rust** - [Install via rustup](https://rustup.rs/)

#### Installation

```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd text-drive/textdrive-rust
cargo build --release
```

#### Available Commands

| Command | Description |
|---------|-------------|
| `cargo run --release --bin textdrive` | Play manually |
| `cargo run --release --bin textdrive ai` | Play with AI |
| `cargo run --release --bin train` | Train the AI |
| `cargo doc --open` | View documentation |

---

## Features

- **ASCII Art Graphics** - Courses made entirely with the `■` character
- **Simple Controls** - Arrow keys to move
- **Distance Scoring** - Track how far you can go
- **Two Versions** - Play in browser (React) or terminal with AI (Rust)
- **Q-Learning AI** - Watch an AI learn to drive (Rust version)

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

### Rust Version

| Category | Technology |
|----------|------------|
| Language | Rust |
| UI Library | pancurses |
| AI | Q-learning |

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
└── textdrive-rust/           # Rust (Terminal) version
    ├── src/
    │   ├── game.rs           # Game logic
    │   ├── qlearning.rs      # Q-learning AI
    │   └── bin/              # Executables
    └── Cargo.toml            # Rust dependencies
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Links

- [Live Demo](https://text-drive.vercel.app/)
- [Report a Bug](https://github.com/yukiharada1228/text-drive/issues)
- [Node.js Download](https://nodejs.org/)
- [Rust Installation](https://rustup.rs/)
