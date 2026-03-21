# 🎮 Daily Quest

**A gamified daily todo & habit tracker that makes productivity feel like a game.**

Inspired by Duolingo's addictive engagement mechanics — streaks, XP, levels, and daily goals — applied to your real-life tasks and habits.

## 🎯 Concept

Most todo apps are boring. You check a box, it disappears. No dopamine, no motivation to come back tomorrow. Daily Quest fixes this by wrapping your daily tasks in RPG-like progression mechanics:

- **Complete tasks → Earn XP** — every todo and habit gives experience points
- **Build streaks** — don't break the chain, earn streak multipliers
- **Level up** — watch your avatar grow as you stay consistent
- **Daily goals** — hit your XP target each day to maintain your streak
- **Achievements** — unlock badges for milestones (7-day streak, 100 tasks, etc.)

## 🏆 What Makes This Different

| App | Strength | Gap |
|-----|----------|-----|
| **Habitica** | Deep RPG system | Overwhelming complexity, dated UI |
| **Todoist** | Clean task management | Zero gamification |
| **Streaks** | Simple streak tracking | No XP/leveling, iOS only |
| **TickTick** | Feature-rich | Gamification is an afterthought |

**Daily Quest's angle:** Duolingo-level polish and engagement mechanics, but for your real life. Simple enough for casual users, deep enough to be addictive. True black OLED theme. No AI gimmicks — just solid gamification psychology.

## 🛠 Tech Stack

- **Framework:** React Native + Expo (SDK 52+)
- **Navigation:** Expo Router (file-based)
- **State:** Zustand + MMKV (local-first, blazing fast)
- **Database:** SQLite (expo-sqlite) for structured data
- **Animations:** React Native Reanimated 3 + Moti
- **Icons:** Phosphor Icons
- **Theme:** True black OLED (#000000 background)
- **No backend required for MVP** — everything local-first

## 🎮 Gamification System

### XP & Levels
- Tasks award XP based on difficulty: Easy (10), Medium (25), Hard (50)
- Habits award XP each time completed (scaling with streak)
- Daily XP goal: 50 XP (adjustable)
- Levels: 0→1 at 100 XP, exponential curve (level × 150 XP per level)

### Streaks
- Maintain by hitting daily XP goal
- Streak freeze: 1 free per week (earned)
- Streak multiplier: +10% XP per 7-day milestone (cap at 2x)
- Visual: 🔥 flame icon with day count, animated on milestones

### Achievements
- **First Quest** — Complete your first task
- **Week Warrior** — 7-day streak
- **Centurion** — 100 tasks completed
- **Month Master** — 30-day streak
- **Early Bird** — Complete all daily tasks before noon
- More unlocked progressively

## 📱 Core Screens (MVP)

1. **Today** — Daily quest board with tasks/habits, XP progress bar, streak counter
2. **Quests** — Manage recurring habits and one-off tasks
3. **Profile** — Level, total XP, achievements, streak history
4. **Add Quest** — Create new task/habit with difficulty, recurrence, category

## 📊 Data Model

```typescript
interface Quest {
  id: string;
  title: string;
  type: 'task' | 'habit';
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  recurrence: 'daily' | 'weekly' | 'weekdays' | 'custom' | 'once';
  category: string;
  createdAt: number;
}

interface Completion {
  id: string;
  questId: string;
  completedAt: number;
  xpEarned: number;
}

interface UserStats {
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  achievements: string[];
}

interface DayLog {
  date: string; // YYYY-MM-DD
  xpEarned: number;
  xpGoal: number;
  goalMet: boolean;
  completions: string[];
}
```

## 🗓 MVP Sprint Plan

### Sprint 1 — Foundation (Week 1)
- [ ] Expo project setup with file-based routing
- [ ] OLED theme system (true black)
- [ ] SQLite database setup with migrations
- [ ] Zustand stores (quests, stats, day log)
- [ ] Bottom tab navigation (Today, Quests, Profile)

### Sprint 2 — Core Loop (Week 2)
- [ ] Add/edit quest screen
- [ ] Today screen with quest list
- [ ] Complete quest → XP animation
- [ ] Daily XP progress bar
- [ ] Streak counter logic

### Sprint 3 — Gamification (Week 3)
- [ ] Level-up system with celebration animation
- [ ] Achievement system (unlock + toast)
- [ ] Streak freeze mechanic
- [ ] XP multiplier for streaks
- [ ] Profile screen with stats

### Sprint 4 — Polish (Week 4)
- [ ] Haptic feedback on completions
- [ ] Notification reminders (daily goal)
- [ ] Onboarding flow (3 screens)
- [ ] App icon and splash screen
- [ ] Bug fixes and performance

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/jeff-openclaw/daily-quest.git
cd daily-quest

# Install
npx expo install

# Run
npx expo start
```

## 📄 License

MIT

---

Built with 🔥 by Cătălin & Jeff
