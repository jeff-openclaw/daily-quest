import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
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
        <Text style={styles.heading}>⚙️ Settings</Text>

        {/* Daily XP Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily XP Goal</Text>
          <Text style={styles.sectionDesc}>How much XP to earn each day to keep your streak</Text>
          <View style={styles.optionRow}>
            {XP_GOALS.map(goal => (
              <Pressable
                key={goal}
                style={[
                  styles.optionChip,
                  settings.dailyXpGoal === goal && styles.optionChipActive,
                ]}
                onPress={() => updateSettings({ dailyXpGoal: goal })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    settings.dailyXpGoal === goal && styles.optionChipTextActive,
                  ]}
                >
                  {goal} XP
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Suggestions per day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Suggestions</Text>
          <Text style={styles.sectionDesc}>How many quest suggestions to show each day</Text>
          <View style={styles.optionRow}>
            {SUGGESTION_COUNTS.map(count => (
              <Pressable
                key={count}
                style={[
                  styles.optionChip,
                  settings.suggestionsPerDay === count && styles.optionChipActive,
                ]}
                onPress={() => updateSettings({ suggestionsPerDay: count })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    settings.suggestionsPerDay === count && styles.optionChipTextActive,
                  ]}
                >
                  {count}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Haptics */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Haptic Feedback</Text>
              <Text style={styles.sectionDesc}>Vibration when completing quests</Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={v => updateSettings({ hapticEnabled: v })}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accent + '66' }}
              thumbColor={settings.hapticEnabled ? Colors.accent : Colors.textMuted}
            />
          </View>
        </View>

        {/* Streak Freezes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❄️ Streak Freezes</Text>
          <Text style={styles.sectionDesc}>
            You have {stats.streakFreezes} streak freeze{stats.streakFreezes !== 1 ? 's' : ''} remaining.
            A freeze automatically protects your streak if you miss a day.
          </Text>
        </View>

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Daily Quest</Text>
          <Text style={styles.aboutVersion}>v1.0.0</Text>
          <Text style={styles.aboutDesc}>
            A gamified daily habit tracker.{'\n'}
            Built with ❤️ using React Native & Expo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  heading: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  optionChipActive: {
    backgroundColor: Colors.accent + '22',
    borderColor: Colors.accent,
  },
  optionChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: Colors.accent,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  aboutTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  aboutVersion: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  aboutDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 20,
  },
});
