import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Layout } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';

export default function SettingsScreen() {
  const settings = useStore(s => s.settings);
  const updateSettings = useStore(s => s.updateSettings);
  const stats = useStore(s => s.stats);

  const XP_GOALS = [30, 50, 75, 100, 150];
  const SUGGESTION_COUNTS = [3, 5, 7, 10];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Settings</Text>

        {/* Daily XP Goal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash" size={18} color={Colors.xpGold} />
            <Text style={styles.cardTitle}>Daily XP Goal</Text>
          </View>
          <Text style={styles.cardDesc}>Earn this much XP each day to keep your streak</Text>
          <View style={styles.chipRow}>
            {XP_GOALS.map(goal => (
              <Pressable
                key={goal}
                style={[styles.chip, settings.dailyXpGoal === goal && styles.chipActive]}
                onPress={() => updateSettings({ dailyXpGoal: goal })}
              >
                <Text style={[styles.chipText, settings.dailyXpGoal === goal && styles.chipTextActive]}>
                  {goal}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Suggestions per day */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={18} color={Colors.accent} />
            <Text style={styles.cardTitle}>Daily Suggestions</Text>
          </View>
          <Text style={styles.cardDesc}>How many quest suggestions per day</Text>
          <View style={styles.chipRow}>
            {SUGGESTION_COUNTS.map(count => (
              <Pressable
                key={count}
                style={[styles.chip, settings.suggestionsPerDay === count && styles.chipActive]}
                onPress={() => updateSettings({ suggestionsPerDay: count })}
              >
                <Text style={[styles.chipText, settings.suggestionsPerDay === count && styles.chipTextActive]}>
                  {count}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Haptics Toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name="phone-portrait" size={18} color={Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Haptic Feedback</Text>
                <Text style={styles.cardDesc}>Vibration on task completion</Text>
              </View>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={v => updateSettings({ hapticEnabled: v })}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accent + '55' }}
              thumbColor={settings.hapticEnabled ? Colors.accent : '#555'}
            />
          </View>
        </View>

        {/* Streak Freezes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={{ fontSize: 18 }}>❄️</Text>
            <Text style={styles.cardTitle}>Streak Freezes</Text>
          </View>
          <Text style={styles.cardDesc}>
            {stats.streakFreezes} freeze{stats.streakFreezes !== 1 ? 's' : ''} remaining.
            Automatically protects your streak if you miss a day.
          </Text>
          <View style={styles.freezeIndicator}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  styles.freezeDot,
                  i < stats.streakFreezes ? styles.freezeDotActive : styles.freezeDotUsed,
                ]}
              >
                <Text style={{ fontSize: 16 }}>{i < stats.streakFreezes ? '❄️' : '💨'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>Daily Quest</Text>
          <Text style={styles.aboutVersion}>v1.0.0</Text>
          <Text style={styles.aboutDesc}>
            A gamified daily habit tracker.{'\n'}
            Built with ❤️ using React Native & Expo.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: Layout.tabBarHeight + 40, maxWidth: Layout.maxAppWidth, alignSelf: 'center' as const, width: '100%' },
  heading: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minWidth: 48,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(124, 77, 255, 0.15)',
    borderColor: Colors.accent,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.accent,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  freezeIndicator: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  freezeDot: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeDotActive: {
    backgroundColor: 'rgba(0, 188, 212, 0.12)',
  },
  freezeDotUsed: {
    backgroundColor: Colors.surfaceLight,
    opacity: 0.5,
  },

  about: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.md,
  },
  aboutTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  aboutVersion: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  aboutDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
