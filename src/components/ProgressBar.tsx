import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-1
  label?: string;
  sublabel?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  sublabel,
  color = Colors.accent,
  height = 12,
  showPercentage = false,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(Math.min(Math.max(progress, 0), 1), {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {(label || sublabel) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, height },
            animatedStyle,
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  sublabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  track: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
  percentage: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
