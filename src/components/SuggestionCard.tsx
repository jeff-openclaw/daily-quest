import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { goalCategories } from '../data/taskLibrary';
import { useStore } from '../store/useStore';
import { Difficulty, XP_VALUES } from '../types';

const DIFF_COLORS: Record<Difficulty, string> = {
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

  const diffColor = DIFF_COLORS[template.difficulty];

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.catRow}>
          <Text style={styles.catIcon}>{category.icon}</Text>
          <Text style={styles.catName}>{category.title}</Text>
        </View>
        <View style={[styles.xpPill, { backgroundColor: diffColor + '1A' }]}>
          <Text style={[styles.xpText, { color: diffColor }]}>
            +{XP_VALUES[template.difficulty]} XP
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{template.title}</Text>
      <View style={styles.actions}>
        <Pressable
          style={styles.acceptBtn}
          onPress={() => acceptSuggestion(templateId, categoryId)}
        >
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.acceptText}>Accept</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => replaceSuggestion(templateId)}
        >
          <Ionicons name="refresh" size={14} color={Colors.accent} />
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => skipSuggestion(templateId)}
        >
          <Ionicons name="close" size={14} color={Colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.12)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catIcon: { fontSize: 14 },
  catName: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  xpPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  xpText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    flex: 1,
    justifyContent: 'center',
  },
  acceptText: {
    color: Colors.success,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
