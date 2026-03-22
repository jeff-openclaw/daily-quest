import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Layout } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';
import { goalCategories } from '../../src/data/taskLibrary';

const CATEGORY_ACCENTS: Record<string, string> = {
  health: '#00E676',
  learning: '#448AFF',
  productivity: '#FF6D00',
  mindfulness: '#AA00FF',
  social: '#FF4081',
  creative: '#FFD740',
  finance: '#00BFA5',
};

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
        <Text style={styles.heading}>Your Goals</Text>
        <Text style={styles.subtitle}>
          Choose goals and we'll suggest daily quests to help you level up
        </Text>

        {/* Active Goals */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Active</Text>
            {goals.map(goal => {
              const category = goalCategories.find(c => c.id === goal.categoryId);
              const accent = CATEGORY_ACCENTS[goal.categoryId] || Colors.accent;
              return (
                <View key={goal.id} style={[styles.activeCard, { borderColor: accent + '33' }]}>
                  <View style={[styles.activeIconWrap, { backgroundColor: accent + '1A' }]}>
                    <Text style={styles.activeIcon}>{goal.icon}</Text>
                  </View>
                  <View style={styles.activeInfo}>
                    <Text style={styles.activeTitle}>{goal.title}</Text>
                    <Text style={styles.activeSub}>
                      {category?.tasks.length || 0} quests available
                    </Text>
                  </View>
                  <Pressable
                    style={styles.removeBtn}
                    onPress={() => removeGoal(goal.id)}
                  >
                    <Ionicons name="close" size={16} color={Colors.danger} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {/* Category Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {goals.length === 0 ? 'Pick your goals' : 'Add more'}
          </Text>
          <View style={styles.grid}>
            {goalCategories.map(category => {
              const isActive = activeGoalCategoryIds.has(category.id);
              const accent = CATEGORY_ACCENTS[category.id] || Colors.accent;
              return (
                <Pressable
                  key={category.id}
                  style={[
                    styles.card,
                    isActive && { borderColor: accent + '55', backgroundColor: accent + '08' },
                  ]}
                  onPress={() => {
                    if (isActive) {
                      const goal = goals.find(g => g.categoryId === category.id);
                      if (goal) removeGoal(goal.id);
                    } else {
                      addGoal(category.id, category.title, category.icon);
                    }
                  }}
                >
                  {isActive && (
                    <View style={[styles.checkCircle, { backgroundColor: accent }]}>
                      <Ionicons name="checkmark" size={12} color="#000" />
                    </View>
                  )}
                  <Text style={styles.cardIcon}>{category.icon}</Text>
                  <Text style={styles.cardTitle}>{category.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{category.description}</Text>
                  <Text style={[styles.cardCount, isActive && { color: accent }]}>
                    {category.tasks.length} quests
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {goals.length === 0 && (
          <View style={styles.hint}>
            <Ionicons name="bulb" size={16} color={Colors.xpGold} />
            <Text style={styles.hintText}>
              Tap a goal to activate it. We'll suggest daily quests from your active goals!
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  section: { marginBottom: Spacing.lg },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },

  // Active goal cards
  activeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: { fontSize: 22 },
  activeInfo: { flex: 1 },
  activeTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  activeSub: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: '48.5%',
    flexGrow: 0,
    minHeight: 140,
  },
  checkCircle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardCount: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },

  // Hint
  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.06)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  hintText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
});
