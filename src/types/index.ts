export type Difficulty = 'easy' | 'medium' | 'hard';

export type RecurrenceType = 'daily' | 'weekdays' | 'weekly' | 'custom';

export interface RecurrencePattern {
  type: RecurrenceType;
  days?: number[]; // 0=Sun, 1=Mon, ... 6=Sat (for 'custom' type)
}

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  goalId?: string;
  isCustom: boolean;
  isSuggested?: boolean;
  recurrence?: RecurrencePattern;
  recurringTaskId?: string; // links back to the recurring template
}

export interface RecurringTask {
  id: string;
  title: string;
  difficulty: Difficulty;
  recurrence: RecurrencePattern;
  goalId?: string;
  createdAt: string;
  active: boolean;
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
  date: string;
  tasks: Task[];
  xpEarned: number;
  goalMet: boolean;
  streakFreezeUsed?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
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
  onboardingComplete: boolean;
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

export function shouldRecurToday(recurrence: RecurrencePattern): boolean {
  const today = new Date().getDay(); // 0=Sun
  switch (recurrence.type) {
    case 'daily':
      return true;
    case 'weekdays':
      return today >= 1 && today <= 5;
    case 'weekly':
      return today === (recurrence.days?.[0] ?? 0);
    case 'custom':
      return recurrence.days?.includes(today) ?? false;
    default:
      return false;
  }
}

// Achievement definitions
export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first_task', title: 'First Steps', description: 'Complete your first task', icon: '🌱' },
  { id: 'streak_7', title: 'On Fire', description: 'Reach a 7-day streak', icon: '🔥' },
  { id: 'streak_30', title: 'Unstoppable', description: 'Reach a 30-day streak', icon: '⚡' },
  { id: 'xp_100_day', title: 'XP Machine', description: 'Earn 100 XP in a single day', icon: '💰' },
  { id: 'all_daily', title: 'Perfect Day', description: 'Complete all daily quests', icon: '✨' },
  { id: 'level_5', title: 'Rising Star', description: 'Reach Level 5', icon: '⭐' },
  { id: 'level_10', title: 'Veteran', description: 'Reach Level 10', icon: '🏅' },
  { id: 'level_15', title: 'Elite', description: 'Reach Level 15', icon: '👑' },
  { id: 'level_20', title: 'Legend', description: 'Reach Level 20', icon: '🏆' },
  { id: 'tasks_10', title: 'Getting Going', description: 'Complete 10 tasks total', icon: '📋' },
  { id: 'tasks_50', title: 'Dedicated', description: 'Complete 50 tasks total', icon: '💪' },
  { id: 'tasks_100', title: 'Centurion', description: 'Complete 100 tasks total', icon: '🗡️' },
];
