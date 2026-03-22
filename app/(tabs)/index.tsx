import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, BorderRadius, Layout } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';
import { getStreakMultiplier, getXpForNextLevel } from '../../src/types';
import { TaskCard } from '../../src/components/TaskCard';
import { SuggestionCard } from '../../src/components/SuggestionCard';
import { ProgressBar } from '../../src/components/ProgressBar';
import { AddTaskModal } from '../../src/components/AddTaskModal';
import { RecurringTaskModal } from '../../src/components/RecurringTaskModal';
import { XpAnimation } from '../../src/components/XpAnimation';

export default function TodayScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const todayTasks = useStore(s => s.todayTasks);
  const todaySuggestions = useStore(s => s.todaySuggestions);
  const stats = useStore(s => s.stats);
  const settings = useStore(s => s.settings);
  const todayXp = useStore(s => s.todayXp);
  const ensureToday = useStore(s => s.ensureToday);
  const goals = useStore(s => s.goals);
  const recurringTasks = useStore(s => s.recurringTasks);
  const router = useRouter();

  useEffect(() => { ensureToday(); }, []);

  const xp = todayXp();
  const xpProgress = Math.min(xp / settings.dailyXpGoal, 1);
  const multiplier = getStreakMultiplier(stats.currentStreak);
  const levelInfo = getXpForNextLevel(stats.totalXp);
  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const activeSuggestions = todaySuggestions.filter(s => !s.skipped);
  const greeting = getGreeting();
  const hasNoContent = todayTasks.length === 0 && activeSuggestions.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <XpAnimation />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.levelSubtext}>Level {stats.level} Adventurer</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFireIcon}>🔥</Text>
            <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
          </View>
        </View>

        {/* Level Progress (subtle) */}
        <View style={styles.levelBar}>
          <ProgressBar progress={levelInfo.progress} color={Colors.accent} height={4} />
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>Lv. {stats.level}</Text>
            <Text style={styles.levelXp}>{levelInfo.current}/{levelInfo.needed} XP</Text>
          </View>
        </View>

        {/* Daily Progress Card */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyTitle}>Daily Goal</Text>
            {xpProgress >= 1 && (
              <View style={styles.goalMetPill}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.goalMetText}>Complete!</Text>
              </View>
            )}
          </View>
          <ProgressBar
            progress={xpProgress}
            sublabel={`${xp} / ${settings.dailyXpGoal} XP`}
            color={xpProgress >= 1 ? Colors.success : Colors.xpGold}
            height={12}
          />
          {multiplier > 1 && (
            <View style={styles.multiplierPill}>
              <Text style={styles.multiplierText}>🔥 {multiplier.toFixed(1)}x streak bonus</Text>
            </View>
          )}
        </View>

        {/* Empty State */}
        {hasNoContent && (
          <View style={styles.emptyHero}>
            <Text style={styles.emptyHeroEmoji}>⚔️</Text>
            <Text style={styles.emptyHeroTitle}>Your quest board is empty!</Text>
            <Text style={styles.emptyHeroSub}>
              {goals.length === 0
                ? 'Set up some goals and we\'ll suggest quests for you.'
                : 'All suggestions cleared! Add a custom quest or create a recurring one.'}
            </Text>
            {goals.length === 0 ? (
              <Pressable style={styles.ctaBtn} onPress={() => router.push('/(tabs)/goals')}>
                <Ionicons name="flag" size={18} color="#FFF" />
                <Text style={styles.ctaBtnText}>Set Up Goals</Text>
              </Pressable>
            ) : (
              <View style={styles.ctaRow}>
                <Pressable style={styles.ctaBtn} onPress={() => setShowAddModal(true)}>
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={styles.ctaBtnText}>Add Quest</Text>
                </Pressable>
                <Pressable style={[styles.ctaBtn, styles.ctaBtnSecondary]} onPress={() => setShowRecurringModal(true)}>
                  <Ionicons name="repeat" size={18} color={Colors.accent} />
                  <Text style={[styles.ctaBtnText, { color: Colors.accent }]}>Recurring</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Tasks — front and center */}
        {(todayTasks.length > 0 || !hasNoContent) && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="flash" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Today's Quests</Text>
              {totalCount > 0 && (
                <Text style={styles.countBadge}>{completedCount}/{totalCount}</Text>
              )}
              <View style={{ flex: 1 }} />
              <Pressable style={styles.recurringPill} onPress={() => setShowRecurringModal(true)}>
                <Ionicons name="repeat" size={14} color={Colors.textSecondary} />
                <Text style={styles.recurringPillText}>Recurring</Text>
              </Pressable>
              <Pressable style={styles.addPill} onPress={() => setShowAddModal(true)}>
                <Ionicons name="add" size={16} color={Colors.accent} />
                <Text style={styles.addPillText}>Add</Text>
              </Pressable>
            </View>

            {todayTasks.length === 0 ? (
              <View style={styles.emptyMini}>
                <Text style={styles.emptyMiniEmoji}>🗡️</Text>
                <Text style={styles.emptyMiniTitle}>No quests yet</Text>
                <Text style={styles.emptyMiniSub}>
                  {goals.length === 0
                    ? 'Set some goals first, or add a custom quest'
                    : 'Accept a suggestion below or add your own'}
                </Text>
              </View>
            ) : (
              <>
                {todayTasks.filter(t => !t.completed).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {todayTasks.filter(t => t.completed).length > 0 && (
                  <>
                    <View style={styles.completedDivider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.completedLabel}>Completed</Text>
                      <View style={styles.dividerLine} />
                    </View>
                    {todayTasks.filter(t => t.completed).map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* Suggestions — below tasks */}
        {activeSuggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="sparkles" size={18} color={Colors.xpGold} />
              <Text style={styles.sectionTitle}>Suggested Quests</Text>
            </View>
            <Text style={styles.sectionSub}>Based on your goals</Text>
            {activeSuggestions.map(s => (
              <SuggestionCard key={s.templateId} templateId={s.templateId} categoryId={s.categoryId} />
            ))}
          </View>
        )}

        {/* Recurring Tasks */}
        {recurringTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="repeat" size={18} color={Colors.textSecondary} />
              <Text style={styles.sectionTitle}>Recurring Quests</Text>
              <Text style={styles.countBadge}>{recurringTasks.length}</Text>
            </View>
            {recurringTasks.map(rt => (
              <View key={rt.id} style={styles.recurringCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recurringTitle}>{rt.title}</Text>
                  <Text style={styles.recurringSchedule}>{formatRecurrence(rt.recurrence)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <AddTaskModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
      <RecurringTaskModal visible={showRecurringModal} onClose={() => setShowRecurringModal(false)} />
    </SafeAreaView>
  );
}

function formatRecurrence(r: { type: string; days?: number[] }): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  switch (r.type) {
    case 'daily': return 'Every day';
    case 'weekdays': return 'Weekdays';
    case 'weekly': return `Every ${dayNames[r.days?.[0] ?? 0]}`;
    case 'custom': return r.days?.map(d => dayNames[d]).join(', ') || 'Custom';
    default: return '';
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  if (hour < 21) return 'Good evening 🌙';
  return 'Night owl? 🦉';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: Layout.tabBarHeight + 40 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  levelSubtext: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 109, 0, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 109, 0, 0.25)',
  },
  streakFireIcon: { fontSize: 20 },
  streakNumber: {
    color: Colors.streak,
    fontSize: FontSize.lg,
    fontWeight: '900',
  },

  // Level bar
  levelBar: { marginBottom: Spacing.md },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  levelLabel: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  levelXp: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },

  // Daily card
  dailyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dailyTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  goalMetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  goalMetText: {
    color: Colors.success,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  multiplierPill: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255, 109, 0, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  multiplierText: {
    color: Colors.streak,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },

  // Sections
  section: { marginBottom: Spacing.lg },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  sectionSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
    marginLeft: 26,
  },
  countBadge: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  recurringPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginRight: 6,
  },
  recurringPillText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  addPillText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },

  // Completed divider
  completedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  completedLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Empty hero
  emptyHero: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.2)',
  },
  emptyHeroEmoji: { fontSize: 56, marginBottom: Spacing.md },
  emptyHeroTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyHeroSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  ctaBtnSecondary: {
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
  },
  ctaBtnText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  ctaRow: { flexDirection: 'row', gap: Spacing.md },

  // Empty mini
  emptyMini: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyMiniEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  emptyMiniTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700', marginBottom: 4 },
  emptyMiniSub: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center' },

  // Recurring
  recurringCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurringTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  recurringSchedule: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
});
