import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useStore } from '../store/useStore';
import { goalCategories } from '../data/taskLibrary';

const SCREENS = [
  {
    emoji: '⚔️',
    title: 'Welcome to\nDaily Quest!',
    subtitle: 'Turn your daily habits into an epic adventure. Complete quests, earn XP, and level up!',
  },
  {
    emoji: '🎮',
    title: 'How It Works',
    subtitle: '• Complete tasks to earn XP\n• Meet your daily XP goal to build streaks 🔥\n• Streaks give you bonus XP multipliers\n• Level up as you earn more XP\n• Unlock achievements along the way!',
  },
];

export function OnboardingFlow() {
  const [screen, setScreen] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const addGoal = useStore(s => s.addGoal);
  const updateSettings = useStore(s => s.updateSettings);

  const isGoalScreen = screen === 2;
  const isLastScreen = screen === 2;

  const toggleGoal = (categoryId: string) => {
    setSelectedGoals(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const handleFinish = () => {
    selectedGoals.forEach(catId => {
      const cat = goalCategories.find(c => c.id === catId);
      if (cat) addGoal(cat.id, cat.title, cat.icon);
    });
    updateSettings({ onboardingComplete: true });
  };

  const handleNext = () => {
    if (isLastScreen) {
      handleFinish();
    } else {
      setScreen(s => s + 1);
    }
  };

  if (!isGoalScreen) {
    const s = SCREENS[screen];
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{s.emoji}</Text>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.subtitle}>{s.subtitle}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.dot, screen === i && styles.dotActive]} />
            ))}
          </View>
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next →</Text>
          </Pressable>
          {screen === 0 && (
            <Pressable style={styles.skipBtn} onPress={() => { updateSettings({ onboardingComplete: true }); }}>
              <Text style={styles.skipBtnText}>Skip intro</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // Goal selection screen
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.goalScrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.goalTitle}>🎯 Pick Your Goals</Text>
        <Text style={styles.goalSubtitle}>Choose what you want to work on. You can change these anytime.</Text>
        <View style={styles.goalGrid}>
          {goalCategories.map(cat => {
            const selected = selectedGoals.has(cat.id);
            return (
              <Pressable
                key={cat.id}
                style={[styles.goalCard, selected && styles.goalCardSelected]}
                onPress={() => toggleGoal(cat.id)}
              >
                <Text style={styles.goalIcon}>{cat.icon}</Text>
                <Text style={styles.goalName}>{cat.title}</Text>
                {selected && <Text style={styles.goalCheck}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, screen === i && styles.dotActive]} />
          ))}
        </View>
        <Pressable style={styles.nextBtn} onPress={handleFinish}>
          <Text style={styles.nextBtnText}>
            {selectedGoals.size > 0 ? 'Start Your Adventure! ⚔️' : 'Skip for now'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  nextBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  skipBtn: {
    paddingVertical: Spacing.sm,
  },
  skipBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  goalScrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  goalTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xxl,
  },
  goalSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  goalGrid: {
    gap: Spacing.sm,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  goalCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '11',
  },
  goalIcon: {
    fontSize: 28,
  },
  goalName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  goalCheck: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
});
