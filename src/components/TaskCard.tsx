import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { Task, XP_VALUES, Difficulty } from '../types';
import { useStore } from '../store/useStore';

const DIFF_COLORS: Record<Difficulty, string> = {
  easy: Colors.easy,
  medium: Colors.medium,
  hard: Colors.hard,
};

const DIFF_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Med',
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
  const opacity = useSharedValue(1);

  const handleComplete = useCallback(() => {
    if (task.completed) return;
    if (hapticEnabled && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    scale.value = withSequence(
      withSpring(0.97, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    completeTask(task.id);
    onComplete?.();
  }, [task.id, task.completed, hapticEnabled]);

  const handleRemove = useCallback(() => {
    if (hapticEnabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => removeTask(task.id), 200);
  }, [task.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const diffColor = DIFF_COLORS[task.difficulty];
  const xp = XP_VALUES[task.difficulty];

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, task.completed && styles.containerDone]}
      onPress={handleComplete}
      onLongPress={handleRemove}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed && (
          <Ionicons name="checkmark" size={14} color={Colors.background} />
        )}
      </View>

      {/* Text + meta */}
      <View style={styles.center}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </View>

      {/* Right side: difficulty + XP */}
      <View style={styles.right}>
        <View style={[styles.diffPill, { backgroundColor: diffColor + '1A' }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>
            {DIFF_LABELS[task.difficulty]}
          </Text>
        </View>
        <Text style={[styles.xpText, task.completed && styles.xpDone]}>
          +{xp} XP
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  containerDone: {
    opacity: 0.55,
    borderColor: 'rgba(0, 230, 118, 0.15)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  center: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  diffPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  diffText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpText: {
    color: Colors.xpGold,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  xpDone: {
    color: Colors.textMuted,
  },
});
