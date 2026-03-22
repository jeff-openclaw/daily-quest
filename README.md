# ⚔️ Daily Quest

A gamified daily habit tracker built with React Native & Expo. Set goals, complete quests, earn XP, and level up!

## Features

- 🎯 **Goal-Based System** — Pick goals like "Get healthier" or "Learn something", and get daily quest suggestions from a curated library of 120+ tasks
- ⚔️ **Quest Management** — Accept suggestions, add custom quests, check them off with satisfying animations
- ⚡ **XP & Leveling** — Earn XP (Easy 10, Medium 25, Hard 50) and progress through 20 levels
- 🔥 **Streaks** — Build consecutive-day streaks with a multiplier that caps at 2x
- ❄️ **Streak Freezes** — Miss a day without losing your streak (3 freezes to start)
- 📊 **Stats Dashboard** — Track your level, XP, streaks, and completion history
- 🖤 **True Black OLED Theme** — #000000 background, easy on your eyes and battery

## Tech Stack

- **React Native + Expo** (SDK 55)
- **Expo Router** (file-based routing)
- **Zustand** (state management)
- **AsyncStorage** (local-first persistence)
- **react-native-reanimated** (animations)
- **expo-haptics** (haptic feedback)
- **TypeScript**

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go, or press `w` for web, `i` for iOS simulator, `a` for Android emulator.

## Goal Categories

| Category | Icon | Tasks |
|----------|------|-------|
| Health & Fitness | 💪 | 18 |
| Learning & Growth | 📚 | 18 |
| Productivity | 🚀 | 17 |
| Mindfulness | 🧘 | 17 |
| Social | 💬 | 16 |
| Creative | 🎨 | 16 |
| Finance | 💰 | 16 |

## License

MIT
