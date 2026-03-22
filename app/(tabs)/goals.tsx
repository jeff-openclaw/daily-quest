import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';
import { goalCategories } from '../../src/data/taskLibrary';

export default function GoalsScreen() {
  const goals = useStore(s => s.goals);
  const addGoal = useStore(s => s.addGoal);
  const removeGoal = useStore(s => s.removeGoal);

  const activeGoalCategoryIds = new Set(goals.map(g => g.categoryId));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>🎯 Your Goals</Text>
        <Text style={styles.subtitle}>
          Choose goals and we'll suggest daily quests to help you achieve them
        </Text>

        {/* Active Goals */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            {goals.map(goal => {
              const category = goalCategories.find(c => c.id === goal.categoryId);
              return (
                <View key={goal.id} style={styles.activeGoalCard}>
                  <View style={styles.activeGoalInfo}>
                    <Text style={styles.activeGoalIcon}>{goal.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activeGoalTitle}>{goal.title}</Text>
                      <Text style={styles.activeGoalTasks}>
                        {category?.tasks.length || 0} quests available
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeGoal(goal.id)}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {/* Available Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {goals.length === 0 ? 'Pick your goals' : 'Add more goals'}
          </Text>
          <View style={styles.categoryGrid}>
            {goalCategories.map(category => {
              const isActive = activeGoalCategoryIds.has(category.id);
              return (
                <Pressable
                  key={category.id}
                  style={[styles.categoryCard, isActive && styles.categoryCardActive]}
                  onPress={() => {
                    if (isActive) {
                      const goal = goals.find(g => g.categoryId === category.id);
                      if (goal) removeGoal(goal.id);
                    } else {
                      addGoal(category.id, category.title, category.icon);
                    }
                  }}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDesc}>{category.description}</Text>
                  <Text style={styles.categoryTaskCount}>
                    {category.tasks.length} quests
                  </Text>
                  {isActive && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>✓ Active</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {goals.length === 0 && (
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              💡 Tap a goal category to activate it. We'll suggest daily quests from your active goals!
            </Text>
          </View>
        )}
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  activeGoalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent + '33',
  },
  activeGoalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  activeGoalIcon: {
    fontSize: 28,
  },
  activeGoalTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  activeGoalTasks: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  removeBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.danger + '22',
    borderRadius: BorderRadius.sm,
  },
  removeBtnText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  categoryGrid: {
    gap: Spacing.sm,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  categoryCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '0D',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  categoryDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  categoryTaskCount: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  activeBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.success + '22',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  activeBadgeText: {
    color: Colors.success,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  hint: {
    backgroundColor: Colors.accent + '11',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + '33',
  },
  hintText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});
