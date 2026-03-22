export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  completed: boolean;
  createdAt: string; // ISO date
  completedAt?: string;
  goalId?: string;
  isCustom: boolean;
  isSuggested?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  categoryId: string;
  active: boolean;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  difficulty: Difficulty;
  categoryId: string;
}

export interface GoalCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  tasks: TaskTemplate[];
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  tasks: Task[];
  xpEarned: number;
  goalMet: boolean;
}

export interface UserStats {
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  streakFreezesUsed: number;
  totalTasksCompleted: number;
  totalDaysActive: number;
}

export interface Settings {
  dailyXpGoal: number;
  suggestionsPerDay: number;
  hapticEnabled: boolean;
}

export const XP_VALUES: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9500, 11000, 13000, 15000, 17500, 20000,
];

export function getLevelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXp(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, progress: current / needed };
}

export function getStreakMultiplier(streak: number): number {
  if (streak <= 0) return 1;
  return Math.min(1 + streak * 0.1, 2);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
