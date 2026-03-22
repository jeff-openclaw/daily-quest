import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
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

  useEffect(() => {
    ensureToday();
  }, []);

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
          <Text style={styles.greeting}>{greeting}</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
          </View>
        </View>

        {/* Level & XP */}
        <View style={styles.levelSection}>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>Level {stats.level}</Text>
            <Text style={styles.xpText}>{stats.totalXp} XP</Text>
          </View>
          <ProgressBar progress={levelInfo.progress} color={Colors.accent} height={6} />
        </View>

        {/* Daily Progress */}
        <View style={styles.dailyProgress}>
          <ProgressBar
            progress={xpProgress}
            label="Daily Goal"
            sublabel={`${xp} / ${settings.dailyXpGoal} XP`}
            color={xpProgress >= 1 ? Colors.success : Colors.xpGold}
            height={14}
          />
          {multiplier > 1 && (
            <View style={styles.multiplierBadge}>
              <Text style={styles.multiplierText}>🔥 {multiplier.toFixed(1)}x streak bonus!</Text>
            </View>
          )}
          {xpProgress >= 1 && (
            <View style={styles.goalMetBadge}>
              <Text style={styles.goalMetText}>✨ Daily goal reached!</Text>
            </View>
          )}
        </View>

        {/* Empty State - Big CTA when nothing to do */}
        {hasNoContent && (
          <View style={styles.emptyHero}>
            <Text style={styles.emptyHeroEmoji}>🗡️</Text>
            <Text style={styles.emptyHeroTitle}>Your quest board is empty!</Text>
            <Text style={styles.emptyHeroSubtitle}>
              {goals.length === 0
                ? 'Head to Goals to pick some daily challenges and we\'ll suggest quests for you.'
                : 'All suggestions cleared! Add a custom quest or create a recurring one.'}
            </Text>
            {goals.length === 0 ? (
              <Pressable style={styles.emptyHeroBtn} onPress={() => router.push('/(tabs)/goals')}>
                <Text style={styles.emptyHeroBtnText}>🎯 Set Up Goals</Text>
              </Pressable>
            ) : (
              <View style={styles.emptyBtnRow}>
                <Pressable style={styles.emptyHeroBtn} onPress={() => setShowAddModal(true)}>
                  <Text style={styles.emptyHeroBtnText}>+ Add Quest</Text>
                </Pressable>
                <Pressable style={[styles.emptyHeroBtn, styles.emptyHeroBtnSecondary]} onPress={() => setShowRecurringModal(true)}>
                  <Text style={[styles.emptyHeroBtnText, { color: Colors.accent }]}>🔄 Recurring</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Suggestions */}
        {activeSuggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Suggested Quests</Text>
            <Text style={styles.sectionSubtitle}>Based on your goals</Text>
            {activeSuggestions.map(s => (
              <SuggestionCard key={s.templateId} templateId={s.templateId} categoryId={s.categoryId} />
            ))}
          </View>
        )}

        {/* Tasks */}
        {(todayTasks.length > 0 || !hasNoContent) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>⚔️ Today's Quests</Text>
                {totalCount > 0 && (
                  <Text style={styles.sectionSubtitle}>{completedCount}/{totalCount} completed</Text>
                )}
              </View>
              <View style={styles.addBtnRow}>
                <Pressable style={styles.addButton} onPress={() => setShowRecurringModal(true)}>
                  <Text style={styles.addButtonText}>🔄</Text>
                </Pressable>
                <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </Pressable>
              </View>
            </View>

            {todayTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🗡️</Text>
                <Text style={styles.emptyTitle}>No quests yet!</Text>
                <Text style={styles.emptySubtitle}>
                  {goals.length === 0
                    ? 'Set some goals first, or add a custom quest'
                    : 'Accept a suggestion above or add your own quest'}
                </Text>
              </View>
            ) : (
              <>
                {todayTasks.filter(t => !t.completed).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {todayTasks.filter(t => t.completed).length > 0 && (
                  <>
                    <Text style={styles.completedHeader}>Completed</Text>
                    {todayTasks.filter(t => t.completed).map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* Recurring Tasks Info */}
        {recurringTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Recurring Quests</Text>
            <Text style={styles.sectionSubtitle}>{recurringTasks.length} set up</Text>
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
    case 'weekdays': return 'Weekdays (Mon-Fri)';
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
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.streak + '22', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, gap: Spacing.xs },
  streakIcon: { fontSize: 18 },
  streakNumber: { color: Colors.streak, fontSize: FontSize.lg, fontWeight: '800' },
  levelSection: { marginBottom: Spacing.lg },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  levelText: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '700' },
  xpText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  dailyProgress: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.surfaceBorder },
  multiplierBadge: { marginTop: Spacing.sm, backgroundColor: Colors.streak + '22', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.sm, alignSelf: 'flex-start' },
  multiplierText: { color: Colors.streak, fontSize: FontSize.xs, fontWeight: '700' },
  goalMetBadge: { marginTop: Spacing.sm, backgroundColor: Colors.success + '22', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.sm, alignSelf: 'flex-start' },
  goalMetText: { color: Colors.success, fontSize: FontSize.sm, fontWeight: '700' },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  sectionTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  sectionSubtitle: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2, marginBottom: Spacing.sm },
  addBtnRow: { flexDirection: 'row', gap: Spacing.sm },
  addButton: { backgroundColor: Colors.accent + '22', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  addButtonText: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '700' },
  completedHeader: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptySubtitle: { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center', paddingHorizontal: Spacing.lg },
  // Big empty hero
  emptyHero: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.accent + '33' },
  emptyHeroEmoji: { fontSize: 64, marginBottom: Spacing.md },
  emptyHeroTitle: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.sm, textAlign: 'center' },
  emptyHeroSubtitle: { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 22, paddingHorizontal: Spacing.sm },
  emptyHeroBtn: { backgroundColor: Colors.accent, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full },
  emptyHeroBtnSecondary: { backgroundColor: Colors.accent + '22' },
  emptyHeroBtnText: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
  emptyBtnRow: { flexDirection: 'row', gap: Spacing.md },
  // Recurring cards
  recurringCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder, flexDirection: 'row', alignItems: 'center' },
  recurringTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  recurringSchedule: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
});
