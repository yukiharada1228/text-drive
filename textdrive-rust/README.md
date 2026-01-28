# TextDrive - Rust Version

A Rust reimplementation of the C version of TextDrive. Features AI autonomous driving using Q-learning.

## Features

- ASCII character-based vertical scrolling driving game
- Manual play mode
- AI auto-play mode using Q-learning
- AI training functionality

## Project Structure

```
textdrive-rust/
├── src/
│   ├── lib.rs           # Library entry point
│   ├── game.rs          # Game logic
│   ├── qlearning.rs     # Q-learning implementation
│   ├── error.rs         # Custom error types
│   └── bin/
│       ├── textdrive.rs # Main game
│       └── train.rs     # Training program
├── Cargo.toml
└── README.md
```

## Build

```bash
cargo build --release
```

## Usage

### Train the AI

```bash
cargo run --release --bin train
```

Trains for 50,000 episodes and saves Q-values to `qtable.bin`.

### Play the Game

#### Manual Play
```bash
cargo run --release --bin textdrive
```

#### AI Play
```bash
cargo run --release --bin textdrive ai
```

## Controls

- **Arrow Keys** or **A/D**: Move player left/right
- **M**: Toggle between AI mode and manual mode (requires qtable.bin)
- **R**: Restart game
- **Q**: Quit

## Architecture Highlights

### Type Safety

- `Cell` enum: Type-safe representation of cell states (empty or wall)
- `Direction` enum: Type-safe representation of movement direction
- `Action` enum: Type-safe representation of AI actions

### Error Handling

- Clear error handling with custom `GameError` type
- Use of `Result<T>` type alias

### Modular Design

- Separation of game logic and Q-learning implementation
- Each module can be tested independently

### Documentation

- Documentation comments on all public APIs
- Generate and view docs with `cargo doc --open`

## Q-Learning Parameters

- **Learning Rate (α)**: 0.2
- **Discount Factor (γ)**: 0.95
- **ε Decay Rate**: 0.9995
- **State Space Size**: 32,768 (2^15)
- **Number of Actions**: 3 (left, stay, right)
- **Vision**: 3 rows ahead, 2 columns left/right of player

## Reward Design

- **Survival**: +1
- **Collision**: -100

## Dependencies

- `rand`: Random number generation
- `pancurses`: Terminal UI

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
