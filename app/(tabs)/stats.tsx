import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';
import { getXpForNextLevel, LEVEL_THRESHOLDS } from '../../src/types';
import { ProgressBar } from '../../src/components/ProgressBar';
import { CalendarHeatmap } from '../../src/components/CalendarHeatmap';
import { AchievementsList } from '../../src/components/AchievementsList';

export default function StatsScreen() {
  const stats = useStore(s => s.stats);
  const levelInfo = getXpForNextLevel(stats.totalXp);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>📊 Your Stats</Text>

        {/* Level Card */}
        <View style={styles.levelCard}>
          <Text style={styles.levelNumber}>{stats.level}</Text>
          <Text style={styles.levelLabel}>Level</Text>
          <View style={styles.levelProgressWrap}>
            <ProgressBar progress={levelInfo.progress} color={Colors.accent} height={10} />
            <Text style={styles.levelProgressText}>
              {levelInfo.current} / {levelInfo.needed} XP to next level
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox icon="⚡" value={stats.totalXp.toLocaleString()} label="Total XP" color={Colors.xpGold} />
          <StatBox icon="🔥" value={stats.currentStreak.toString()} label="Current Streak" color={Colors.streak} />
          <StatBox icon="🏆" value={stats.longestStreak.toString()} label="Best Streak" color={Colors.warning} />
          <StatBox icon="✅" value={stats.totalTasksCompleted.toString()} label="Tasks Done" color={Colors.success} />
          <StatBox icon="📅" value={stats.totalDaysActive.toString()} label="Days Active" color={Colors.accent} />
          <StatBox icon="❄️" value={stats.streakFreezes.toString()} label="Streak Freezes" color="#00BCD4" />
        </View>

        {/* Calendar Heatmap */}
        <View style={styles.sectionGap}>
          <CalendarHeatmap />
        </View>

        {/* Achievements */}
        <View style={styles.sectionGap}>
          <AchievementsList />
        </View>

        {/* Motivational */}
        <View style={styles.motivational}>
          <Text style={styles.motivationalEmoji}>
            {stats.currentStreak >= 7 ? '🌟' : stats.currentStreak >= 3 ? '💪' : '🌱'}
          </Text>
          <Text style={styles.motivationalText}>
            {stats.currentStreak >= 7
              ? 'Incredible streak! You\'re on fire!'
              : stats.currentStreak >= 3
              ? 'Great momentum! Keep it going!'
              : stats.totalTasksCompleted > 0
              ? 'Every quest counts. Keep going!'
              : 'Your adventure begins now!'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <View style={[styles.statBox, { borderColor: color + '33' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: 120 },
  heading: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.lg },
  levelCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.accent + '33',
  },
  levelNumber: { color: Colors.accent, fontSize: FontSize.hero, fontWeight: '900' },
  levelLabel: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.lg, textTransform: 'uppercase', letterSpacing: 2 },
  levelProgressWrap: { width: '100%' },
  levelProgressText: { color: Colors.textMuted, fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md,
    width: '48%', flexGrow: 1, alignItems: 'center', borderWidth: 1,
  },
  statIcon: { fontSize: 24, marginBottom: Spacing.xs },
  statValue: { fontSize: FontSize.xl, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
  sectionGap: { marginBottom: Spacing.lg },
  motivational: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  motivationalEmoji: { fontSize: 48, marginBottom: Spacing.md },
  motivationalText: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600', textAlign: 'center' },
});
