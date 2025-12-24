# TextDrive - React Native

A simple ASCII-based driving game built with React Native, Expo, and TypeScript. Navigate your car (車) through a scrolling course by avoiding walls (■).

This is the React Native version of TextDrive, ported from the web version to work on iOS and Android devices.

## Features

- 🎮 **Simple Controls**: Touch controls to move left/right
- 📱 **Cross-Platform**: Runs on iOS, Android, and Web
- ⌨️ **Touch Input**: Optimized touch control interface for mobile
- 🎨 **Clean Architecture**: Modular components and custom hooks
- 🚀 **Fast Performance**: Built with Expo and optimized with React.memo
- ♻️ **Shared Game Logic**: Core game logic shared with React web version

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript 5.9
- **Build Tool**: Expo SDK
- **State Management**: React Hooks
- **Platform**: iOS, Android, Web

## Project Structure

```
src/
├── hooks/                    # Custom React hooks
│   ├── useResponsiveScale.ts    # Responsive scaling logic
│   ├── useGameLoop.ts           # Game loop management
│   └── useTouchControls.ts      # Touch control handling
├── components/               # UI components
│   ├── CourseRow.tsx            # Course row rendering
│   ├── Player.tsx               # Player character
│   ├── ScoreDisplay.tsx         # Score display
│   ├── GameOverScreen.tsx       # Game over screen
│   ├── ControlButtons.tsx       # Touch control buttons
│   └── GameScreen.tsx           # Main game screen
└── gameLogic.ts              # Core game logic
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (installed automatically)

For iOS development:
- macOS
- Xcode
- iOS Simulator

For Android development:
- Android Studio
- Android Emulator or physical device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yukiharada1228/text-drive.git
cd textdrive-reactnative
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

**Physical Device:**
- Install the Expo Go app on your iOS or Android device
- Scan the QR code displayed in the terminal

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## How to Play

### Objective
Drive your car (車) as far as possible without hitting the walls (■).

### Controls

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

## Architecture Highlights

### Custom Hooks
- **useResponsiveScale**: Handles responsive scaling across different screen sizes using React Native Dimensions API
- **useGameLoop**: Controls the game loop using requestAnimationFrame with FPS throttling
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

## Differences from Web Version

- **No Keyboard Support**: Mobile version uses touch controls only
- **Native Components**: Uses React Native View, Text, TouchableOpacity instead of HTML elements
- **Responsive Scaling**: Uses Dimensions API instead of window object
- **Platform-Specific**: Optimized for mobile devices

## Building for Production

### iOS

1. Build the app:
```bash
eas build --platform ios
```

2. Submit to App Store:
```bash
eas submit --platform ios
```

### Android

1. Build the app:
```bash
eas build --platform android
```

2. Submit to Google Play:
```bash
eas submit --platform android
```

Note: You'll need to set up EAS (Expo Application Services) account for production builds.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Powered by [Expo](https://expo.dev/)
- Ported from the web version at [textdrive-react](../textdrive-react)
