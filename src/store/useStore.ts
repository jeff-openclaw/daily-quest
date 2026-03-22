import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Task, Goal, DayRecord, UserStats, Settings, Difficulty, Achievement,
  RecurringTask, RecurrencePattern,
  XP_VALUES, getTodayString, getStreakMultiplier, getLevelFromXp,
  shouldRecurToday, ACHIEVEMENT_DEFS,
} from '../types';
import { goalCategories } from '../data/taskLibrary';

interface AppState {
  // Goals
  goals: Goal[];
  addGoal: (categoryId: string, title: string, icon: string) => void;
  removeGoal: (goalId: string) => void;

  // Tasks
  todayTasks: Task[];
  addTask: (title: string, difficulty: Difficulty, goalId?: string) => void;
  completeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  acceptSuggestion: (templateId: string, categoryId: string) => void;

  // Recurring tasks
  recurringTasks: RecurringTask[];
  addRecurringTask: (title: string, difficulty: Difficulty, recurrence: RecurrencePattern, goalId?: string) => void;
  removeRecurringTask: (id: string) => void;
  populateRecurringTasks: () => void;

  // Day tracking
  dayRecords: Record<string, DayRecord>;
  ensureToday: () => void;

  // Stats
  stats: UserStats;

  // Achievements
  achievements: Record<string, Achievement>;
  checkAchievements: () => string | null; // returns newly unlocked achievement id

  // Level up tracking
  lastLevelUp: number | null;
  clearLevelUp: () => void;

  // XP animation
  lastXpGain: { amount: number; timestamp: number } | null;

  // Settings
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  // Suggestions
  todaySuggestions: { templateId: string; categoryId: string; skipped: boolean }[];
  generateSuggestions: () => void;
  skipSuggestion: (templateId: string) => void;
  replaceSuggestion: (templateId: string) => void;

  // Streak freeze
  useStreakFreeze: () => void;

  // Computed
  todayXp: () => number;
  todayGoalMet: () => boolean;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      goals: [],
      todayTasks: [],
      dayRecords: {},
      recurringTasks: [],
      achievements: {},
      lastLevelUp: null,
      lastXpGain: null,
      stats: {
        level: 1,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        streakFreezes: 3,
        streakFreezesUsed: 0,
        totalTasksCompleted: 0,
        totalDaysActive: 0,
      },
      settings: {
        dailyXpGoal: 50,
        suggestionsPerDay: 5,
        hapticEnabled: true,
        onboardingComplete: false,
      },
      todaySuggestions: [],

      addGoal: (categoryId, title, icon) => {
        const goal: Goal = {
          id: generateId(),
          title,
          icon,
          categoryId,
          active: true,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ goals: [...state.goals, goal] }));
        setTimeout(() => get().generateSuggestions(), 0);
      },

      removeGoal: (goalId) => {
        set(state => ({
          goals: state.goals.filter(g => g.id !== goalId),
          todayTasks: state.todayTasks.filter(t => t.goalId !== goalId),
        }));
      },

      addTask: (title, difficulty, goalId) => {
        const task: Task = {
          id: generateId(),
          title,
          difficulty,
          completed: false,
          createdAt: new Date().toISOString(),
          goalId,
          isCustom: !goalId,
        };
        set(state => ({ todayTasks: [...state.todayTasks, task] }));
      },

      completeTask: (taskId) => {
        const state = get();
        const task = state.todayTasks.find(t => t.id === taskId);
        if (!task || task.completed) return;

        const multiplier = getStreakMultiplier(state.stats.currentStreak);
        const xpEarned = Math.round(XP_VALUES[task.difficulty] * multiplier);
        const newTotalXp = state.stats.totalXp + xpEarned;
        const oldLevel = state.stats.level;
        const newLevel = getLevelFromXp(newTotalXp);

        set(state => ({
          todayTasks: state.todayTasks.map(t =>
            t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
          ),
          stats: {
            ...state.stats,
            totalXp: newTotalXp,
            level: newLevel,
            totalTasksCompleted: state.stats.totalTasksCompleted + 1,
          },
          lastXpGain: { amount: xpEarned, timestamp: Date.now() },
          lastLevelUp: newLevel > oldLevel ? newLevel : state.lastLevelUp,
        }));

        // Check daily goal & achievements
        setTimeout(() => {
          const s = get();
          const todayXp = s.todayXp();
          if (todayXp >= s.settings.dailyXpGoal) {
            const today = getTodayString();
            const record = s.dayRecords[today];
            if (!record?.goalMet) {
              set(state => ({
                dayRecords: {
                  ...state.dayRecords,
                  [today]: {
                    date: today,
                    tasks: state.todayTasks,
                    xpEarned: todayXp,
                    goalMet: true,
                  },
                },
                stats: {
                  ...state.stats,
                  currentStreak: state.stats.currentStreak + 1,
                  longestStreak: Math.max(state.stats.longestStreak, state.stats.currentStreak + 1),
                  totalDaysActive: state.stats.totalDaysActive + 1,
                },
              }));
            }
          }
          s.checkAchievements();
        }, 0);
      },

      removeTask: (taskId) => {
        set(state => ({ todayTasks: state.todayTasks.filter(t => t.id !== taskId) }));
      },

      acceptSuggestion: (templateId, categoryId) => {
        const category = goalCategories.find(c => c.id === categoryId);
        const template = category?.tasks.find(t => t.id === templateId);
        if (!template) return;

        const goal = get().goals.find(g => g.categoryId === categoryId);
        const task: Task = {
          id: generateId(),
          title: template.title,
          difficulty: template.difficulty,
          completed: false,
          createdAt: new Date().toISOString(),
          goalId: goal?.id,
          isCustom: false,
          isSuggested: true,
        };

        set(state => ({
          todayTasks: [...state.todayTasks, task],
          todaySuggestions: state.todaySuggestions.filter(s => s.templateId !== templateId),
        }));
      },

      // Recurring tasks
      addRecurringTask: (title, difficulty, recurrence, goalId) => {
        const rt: RecurringTask = {
          id: generateId(),
          title,
          difficulty,
          recurrence,
          goalId,
          createdAt: new Date().toISOString(),
          active: true,
        };
        set(state => ({ recurringTasks: [...state.recurringTasks, rt] }));
        // Immediately add to today if applicable
        if (shouldRecurToday(recurrence)) {
          const task: Task = {
            id: generateId(),
            title,
            difficulty,
            completed: false,
            createdAt: new Date().toISOString(),
            goalId,
            isCustom: true,
            recurringTaskId: rt.id,
          };
          set(state => ({ todayTasks: [...state.todayTasks, task] }));
        }
      },

      removeRecurringTask: (id) => {
        set(state => ({
          recurringTasks: state.recurringTasks.filter(rt => rt.id !== id),
          todayTasks: state.todayTasks.filter(t => t.recurringTaskId !== id),
        }));
      },

      populateRecurringTasks: () => {
        const state = get();
        const existingRecurringIds = new Set(
          state.todayTasks.filter(t => t.recurringTaskId).map(t => t.recurringTaskId)
        );
        const newTasks: Task[] = [];
        for (const rt of state.recurringTasks) {
          if (!rt.active) continue;
          if (existingRecurringIds.has(rt.id)) continue;
          if (!shouldRecurToday(rt.recurrence)) continue;
          newTasks.push({
            id: generateId(),
            title: rt.title,
            difficulty: rt.difficulty,
            completed: false,
            createdAt: new Date().toISOString(),
            goalId: rt.goalId,
            isCustom: true,
            recurringTaskId: rt.id,
          });
        }
        if (newTasks.length > 0) {
          set(state => ({ todayTasks: [...newTasks, ...state.todayTasks] }));
        }
      },

      ensureToday: () => {
        const today = getTodayString();
        const state = get();
        const lastRecord = Object.keys(state.dayRecords).sort().pop();

        if (lastRecord && lastRecord !== today) {
          const yesterdayRecord = state.dayRecords[lastRecord];
          if (yesterdayRecord && !yesterdayRecord.goalMet) {
            if (state.stats.streakFreezes > 0) {
              set(s => ({
                stats: {
                  ...s.stats,
                  streakFreezes: s.stats.streakFreezes - 1,
                  streakFreezesUsed: s.stats.streakFreezesUsed + 1,
                },
                dayRecords: {
                  ...s.dayRecords,
                  [lastRecord]: { ...s.dayRecords[lastRecord], streakFreezeUsed: true },
                },
              }));
            } else {
              set(s => ({ stats: { ...s.stats, currentStreak: 0 } }));
            }
          }
          set({ todayTasks: [], todaySuggestions: [] });
          setTimeout(() => {
            get().generateSuggestions();
            get().populateRecurringTasks();
          }, 0);
        } else if (!lastRecord && state.todayTasks.length === 0) {
          get().generateSuggestions();
          get().populateRecurringTasks();
        } else {
          // Same day, still populate any missing recurring tasks
          get().populateRecurringTasks();
        }
      },

      // Achievements
      checkAchievements: () => {
        const state = get();
        const s = state.stats;
        const todayXp = state.todayXp();
        const todayTasks = state.todayTasks;
        const current = { ...state.achievements };
        let newlyUnlocked: string | null = null;

        const tryUnlock = (id: string) => {
          if (current[id]) return;
          const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
          if (!def) return;
          current[id] = { ...def, unlockedAt: new Date().toISOString() };
          if (!newlyUnlocked) newlyUnlocked = id;
        };

        if (s.totalTasksCompleted >= 1) tryUnlock('first_task');
        if (s.totalTasksCompleted >= 10) tryUnlock('tasks_10');
        if (s.totalTasksCompleted >= 50) tryUnlock('tasks_50');
        if (s.totalTasksCompleted >= 100) tryUnlock('tasks_100');
        if (s.currentStreak >= 7 || s.longestStreak >= 7) tryUnlock('streak_7');
        if (s.currentStreak >= 30 || s.longestStreak >= 30) tryUnlock('streak_30');
        if (todayXp >= 100) tryUnlock('xp_100_day');
        if (todayTasks.length > 0 && todayTasks.every(t => t.completed)) tryUnlock('all_daily');
        if (s.level >= 5) tryUnlock('level_5');
        if (s.level >= 10) tryUnlock('level_10');
        if (s.level >= 15) tryUnlock('level_15');
        if (s.level >= 20) tryUnlock('level_20');

        set({ achievements: current });
        return newlyUnlocked;
      },

      clearLevelUp: () => set({ lastLevelUp: null }),

      updateSettings: (s) => {
        set(state => ({ settings: { ...state.settings, ...s } }));
      },

      generateSuggestions: () => {
        const state = get();
        const activeGoals = state.goals.filter(g => g.active);
        if (activeGoals.length === 0) {
          set({ todaySuggestions: [] });
          return;
        }

        const existingTitles = new Set(state.todayTasks.map(t => t.title));
        const suggestions: { templateId: string; categoryId: string; skipped: boolean }[] = [];
        const perGoal = Math.max(1, Math.ceil(state.settings.suggestionsPerDay / activeGoals.length));

        for (const goal of activeGoals) {
          const category = goalCategories.find(c => c.id === goal.categoryId);
          if (!category) continue;
          const available = category.tasks.filter(t => !existingTitles.has(t.title));
          const shuffled = [...available].sort(() => Math.random() - 0.5);
          const picked = shuffled.slice(0, perGoal);
          for (const t of picked) {
            suggestions.push({ templateId: t.id, categoryId: category.id, skipped: false });
          }
        }

        set({ todaySuggestions: suggestions.slice(0, state.settings.suggestionsPerDay) });
      },

      skipSuggestion: (templateId) => {
        set(state => ({
          todaySuggestions: state.todaySuggestions.map(s =>
            s.templateId === templateId ? { ...s, skipped: true } : s
          ),
        }));
      },

      replaceSuggestion: (templateId) => {
        const state = get();
        const suggestion = state.todaySuggestions.find(s => s.templateId === templateId);
        if (!suggestion) return;

        const category = goalCategories.find(c => c.id === suggestion.categoryId);
        if (!category) return;

        const usedIds = new Set(state.todaySuggestions.map(s => s.templateId));
        const existingTitles = new Set(state.todayTasks.map(t => t.title));
        const available = category.tasks.filter(t => !usedIds.has(t.id) && !existingTitles.has(t.title));

        if (available.length === 0) {
          get().skipSuggestion(templateId);
          return;
        }

        const replacement = available[Math.floor(Math.random() * available.length)];
        set(state => ({
          todaySuggestions: state.todaySuggestions.map(s =>
            s.templateId === templateId
              ? { templateId: replacement.id, categoryId: suggestion.categoryId, skipped: false }
              : s
          ),
        }));
      },

      useStreakFreeze: () => {
        set(state => ({
          stats: {
            ...state.stats,
            streakFreezes: Math.max(0, state.stats.streakFreezes - 1),
            streakFreezesUsed: state.stats.streakFreezesUsed + 1,
          },
        }));
      },

      todayXp: () => {
        const state = get();
        return state.todayTasks
          .filter(t => t.completed)
          .reduce((sum, t) => {
            const multiplier = getStreakMultiplier(state.stats.currentStreak);
            return sum + Math.round(XP_VALUES[t.difficulty] * multiplier);
          }, 0);
      },

      todayGoalMet: () => {
        return get().todayXp() >= get().settings.dailyXpGoal;
      },
    }),
    {
      name: 'daily-quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
