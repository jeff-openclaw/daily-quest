import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { goalCategories } from '../data/taskLibrary';
import { useStore } from '../store/useStore';
import { Difficulty, XP_VALUES } from '../types';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.easy,
  medium: Colors.medium,
  hard: Colors.hard,
};

interface SuggestionCardProps {
  templateId: string;
  categoryId: string;
}

export function SuggestionCard({ templateId, categoryId }: SuggestionCardProps) {
  const acceptSuggestion = useStore(s => s.acceptSuggestion);
  const skipSuggestion = useStore(s => s.skipSuggestion);
  const replaceSuggestion = useStore(s => s.replaceSuggestion);

  const category = goalCategories.find(c => c.id === categoryId);
  const template = category?.tasks.find(t => t.id === templateId);

  if (!template || !category) return null;

  const diffColor = DIFFICULTY_COLORS[template.difficulty];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryName}>{category.title}</Text>
        <View style={[styles.diffBadge, { backgroundColor: diffColor + '22' }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>
            +{XP_VALUES[template.difficulty]} XP
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{template.title}</Text>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.acceptBtn]}
          onPress={() => acceptSuggestion(templateId, categoryId)}
        >
          <Text style={styles.acceptText}>✓ Accept</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.replaceBtn]}
          onPress={() => replaceSuggestion(templateId)}
        >
          <Text style={styles.replaceText}>↻ Replace</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.skipBtn]}
          onPress={() => skipSuggestion(templateId)}
        >
          <Text style={styles.skipText}>✕ Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent + '33',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryName: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    flex: 1,
  },
  diffBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  diffText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: Colors.success + '22',
  },
  acceptText: {
    color: Colors.success,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  replaceBtn: {
    backgroundColor: Colors.accent + '22',
  },
  replaceText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  skipBtn: {
    backgroundColor: Colors.textMuted + '22',
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
