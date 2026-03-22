import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        <Text style={styles.title}>🏆 Achievements</Text>
        <Text style={styles.count}>{unlocked}/{total}</Text>
      </View>
      <View style={styles.grid}>
        {ACHIEVEMENT_DEFS.map(def => {
          const isUnlocked = !!achievements[def.id];
          return (
            <View key={def.id} style={[styles.card, isUnlocked && styles.cardUnlocked]}>
              <Text style={[styles.icon, !isUnlocked && styles.iconLocked]}>
                {isUnlocked ? def.icon : '🔒'}
              </Text>
              <Text style={[styles.name, !isUnlocked && styles.nameLocked]} numberOfLines={1}>
                {def.title}
              </Text>
              <Text style={[styles.desc, !isUnlocked && styles.descLocked]} numberOfLines={2}>
                {def.description}
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
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardUnlocked: {
    borderColor: Colors.xpGold + '44',
    backgroundColor: Colors.xpGold + '0A',
  },
  icon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  iconLocked: {
    opacity: 0.4,
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  nameLocked: {
    color: Colors.textMuted,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  descLocked: {
    color: Colors.textMuted,
  },
});
