import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Task, Goal, DayRecord, UserStats, Settings, Difficulty,
  XP_VALUES, getTodayString, getStreakMultiplier, getLevelFromXp,
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

  // Day tracking
  dayRecords: Record<string, DayRecord>;
  ensureToday: () => void;

  // Stats
  stats: UserStats;

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
        // Regenerate suggestions when goals change
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
        }));

        // Check if daily goal met and update streak
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

      ensureToday: () => {
        const today = getTodayString();
        const state = get();
        const lastRecord = Object.keys(state.dayRecords).sort().pop();

        if (lastRecord && lastRecord !== today) {
          // New day — save yesterday's tasks and reset
          const yesterday = lastRecord;
          const yesterdayRecord = state.dayRecords[yesterday];
          if (yesterdayRecord && !yesterdayRecord.goalMet) {
            // Streak broken unless freeze used
            if (state.stats.streakFreezes > 0) {
              // Auto-use freeze
              set(s => ({
                stats: {
                  ...s.stats,
                  streakFreezes: s.stats.streakFreezes - 1,
                  streakFreezesUsed: s.stats.streakFreezesUsed + 1,
                },
              }));
            } else {
              set(s => ({ stats: { ...s.stats, currentStreak: 0 } }));
            }
          }
          // Clear today's tasks
          set({ todayTasks: [], todaySuggestions: [] });
          setTimeout(() => get().generateSuggestions(), 0);
        } else if (!lastRecord && state.todayTasks.length === 0) {
          get().generateSuggestions();
        }
      },

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
          // Shuffle
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
