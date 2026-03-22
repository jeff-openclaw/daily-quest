import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius, Layout } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';
import { getXpForNextLevel } from '../../src/types';
import { ProgressBar } from '../../src/components/ProgressBar';
import { CalendarHeatmap } from '../../src/components/CalendarHeatmap';
import { AchievementsList } from '../../src/components/AchievementsList';

export default function StatsScreen() {
  const stats = useStore(s => s.stats);
  const levelInfo = getXpForNextLevel(stats.totalXp);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Stats</Text>

        {/* Level Hero */}
        <View style={styles.levelHero}>
          <View style={styles.levelCircle}>
            <Text style={styles.levelNum}>{stats.level}</Text>
          </View>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <View style={styles.levelProgress}>
            <ProgressBar progress={levelInfo.progress} color={Colors.accent} height={8} />
            <Text style={styles.levelProgressText}>
              {levelInfo.current} / {levelInfo.needed} XP to next level
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox icon="⚡" value={stats.totalXp.toLocaleString()} label="Total XP" accent={Colors.xpGold} />
          <StatBox icon="🔥" value={stats.currentStreak.toString()} label="Current Streak" accent={Colors.streak} />
          <StatBox icon="🏆" value={stats.longestStreak.toString()} label="Best Streak" accent={Colors.warning} />
          <StatBox icon="✅" value={stats.totalTasksCompleted.toString()} label="Tasks Done" accent={Colors.success} />
          <StatBox icon="📅" value={stats.totalDaysActive.toString()} label="Days Active" accent={Colors.accent} />
          <StatBox icon="❄️" value={stats.streakFreezes.toString()} label="Freezes Left" accent="#00BCD4" />
        </View>

        {/* Calendar */}
        <View style={styles.sectionGap}>
          <CalendarHeatmap />
        </View>

        {/* Achievements */}
        <View style={styles.sectionGap}>
          <AchievementsList />
        </View>

        {/* Motivational */}
        <View style={styles.motCard}>
          <Text style={styles.motEmoji}>
            {stats.currentStreak >= 7 ? '🌟' : stats.currentStreak >= 3 ? '💪' : '🌱'}
          </Text>
          <Text style={styles.motText}>
            {stats.currentStreak >= 7
              ? 'Incredible streak! You\'re on fire!'
              : stats.currentStreak >= 3
              ? 'Great momentum! Keep it going!'
              : stats.totalTasksCompleted > 0
              ? 'Every quest counts. Keep going!'
              : 'Your adventure begins now!'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon, value, label, accent }: { icon: string; value: string; label: string; accent: string }) {
  return (
    <View style={[styles.statBox, { borderColor: accent + '22' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: Layout.tabBarHeight + 40 },
  heading: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
  },

  // Level hero
  levelHero: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.2)',
  },
  levelCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.accent,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  levelNum: {
    color: Colors.accent,
    fontSize: FontSize.hero,
    fontWeight: '900',
    lineHeight: FontSize.hero + 4,
  },
  levelLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: Spacing.lg,
  },
  levelProgress: { width: '100%' },
  levelProgressText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: 6,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    width: '31.5%',
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: FontSize.xl, fontWeight: '800' },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },

  sectionGap: { marginBottom: Spacing.lg },

  // Motivational
  motCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  motEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  motText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
