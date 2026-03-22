import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { Task, XP_VALUES, Difficulty } from '../types';
import { useStore } from '../store/useStore';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.easy,
  medium: Colors.medium,
  hard: Colors.hard,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const completeTask = useStore(s => s.completeTask);
  const removeTask = useStore(s => s.removeTask);
  const hapticEnabled = useStore(s => s.settings.hapticEnabled);

  const scale = useSharedValue(1);
  const checkScale = useSharedValue(task.completed ? 1 : 0);
  const opacity = useSharedValue(1);
  const strikethrough = useSharedValue(task.completed ? 1 : 0);

  const handleComplete = useCallback(() => {
    if (task.completed) return;

    if (hapticEnabled && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    scale.value = withSequence(
      withSpring(1.05, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    strikethrough.value = withTiming(1, { duration: 300 });

    completeTask(task.id);
    onComplete?.();
  }, [task.id, task.completed, hapticEnabled]);

  const handleRemove = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => removeTask(task.id), 200);
  }, [task.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const difficultyColor = DIFFICULTY_COLORS[task.difficulty];
  const xp = XP_VALUES[task.difficulty];

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, task.completed && styles.completedContainer]}
      onPress={handleComplete}
      onLongPress={handleRemove}
    >
      <View style={styles.leftSection}>
        <View style={[styles.checkbox, task.completed && { backgroundColor: Colors.success, borderColor: Colors.success }]}>
          {task.completed && (
            <Animated.Text style={[styles.checkmark, checkAnimatedStyle]}>✓</Animated.Text>
          )}
        </View>
        <View style={styles.textSection}>
          <Text style={[styles.title, task.completed && styles.completedTitle]} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '22' }]}>
              <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                {DIFFICULTY_LABELS[task.difficulty]}
              </Text>
            </View>
            <Text style={styles.xpText}>+{xp} XP</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  completedContainer: {
    opacity: 0.6,
    borderColor: Colors.success + '33',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  checkmark: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  textSection: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  xpText: {
    color: Colors.xpGold,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
