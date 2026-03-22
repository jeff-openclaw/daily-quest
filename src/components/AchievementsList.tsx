import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useStore } from '../store/useStore';
import { ACHIEVEMENT_DEFS } from '../types';

export function AchievementsList() {
  const achievements = useStore(s => s.achievements);
  const unlocked = Object.keys(achievements).length;
  const total = ACHIEVEMENT_DEFS.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.count}>{unlocked}/{total}</Text>
      </View>
      <View style={styles.grid}>
        {ACHIEVEMENT_DEFS.map(def => {
          const isUnlocked = !!achievements[def.id];
          return (
            <View key={def.id} style={[styles.badge, isUnlocked && styles.badgeUnlocked]}>
              <View style={[styles.circle, isUnlocked && styles.circleUnlocked]}>
                {isUnlocked ? (
                  <Text style={styles.badgeEmoji}>{def.icon}</Text>
                ) : (
                  <Ionicons name="lock-closed" size={18} color={Colors.textMuted} />
                )}
              </View>
              <Text style={[styles.name, !isUnlocked && styles.nameLocked]} numberOfLines={1}>
                {def.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  count: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  badge: {
    width: 72,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  badgeUnlocked: {},
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleUnlocked: {
    borderColor: Colors.xpGold + '66',
    backgroundColor: Colors.xpGold + '12',
  },
  badgeEmoji: { fontSize: 22 },
  name: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  nameLocked: {
    color: Colors.textMuted,
  },
});
