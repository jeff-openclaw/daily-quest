import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { Difficulty } from '../types';
import { useStore } from '../store/useStore';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; color: string }[] = [
  { key: 'easy', label: 'Easy (+10 XP)', color: Colors.easy },
  { key: 'medium', label: 'Medium (+25 XP)', color: Colors.medium },
  { key: 'hard', label: 'Hard (+50 XP)', color: Colors.hard },
];

export function AddTaskModal({ visible, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const addTask = useStore(s => s.addTask);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title.trim(), difficulty);
    setTitle('');
    setDifficulty('medium');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>New Quest</Text>

          <TextInput
            style={styles.input}
            placeholder="What do you want to do?"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.diffRow}>
            {DIFFICULTIES.map(d => (
              <Pressable
                key={d.key}
                style={[
                  styles.diffBtn,
                  difficulty === d.key && { backgroundColor: d.color + '33', borderColor: d.color },
                ]}
                onPress={() => setDifficulty(d.key)}
              >
                <Text style={[styles.diffBtnText, difficulty === d.key && { color: d.color }]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.btnRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!title.trim()}
            >
              <Text style={styles.addBtnText}>Add Quest</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  heading: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  diffRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
  },
  diffBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  addBtn: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.accent,
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
