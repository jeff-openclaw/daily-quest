import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { Difficulty, RecurrenceType } from '../types';
import { useStore } from '../store/useStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; color: string }[] = [
  { key: 'easy', label: 'Easy (+10)', color: Colors.easy },
  { key: 'medium', label: 'Medium (+25)', color: Colors.medium },
  { key: 'hard', label: 'Hard (+50)', color: Colors.hard },
];

const RECURRENCE_TYPES: { key: RecurrenceType; label: string }[] = [
  { key: 'daily', label: '📅 Daily' },
  { key: 'weekdays', label: '💼 Weekdays' },
  { key: 'weekly', label: '🔄 Weekly' },
  { key: 'custom', label: '⚙️ Custom' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function RecurringTaskModal({ visible, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([0]); // for weekly/custom
  const addRecurringTask = useStore(s => s.addRecurringTask);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    const recurrence = {
      type: recurrenceType,
      days: recurrenceType === 'weekly' || recurrenceType === 'custom' ? selectedDays : undefined,
    };
    addRecurringTask(title.trim(), difficulty, recurrence);
    setTitle('');
    setDifficulty('medium');
    setRecurrenceType('daily');
    setSelectedDays([0]);
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
          <Text style={styles.heading}>🔄 Recurring Quest</Text>

          <TextInput
            style={styles.input}
            placeholder="Quest name..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.row}>
            {DIFFICULTIES.map(d => (
              <Pressable
                key={d.key}
                style={[styles.chip, difficulty === d.key && { backgroundColor: d.color + '33', borderColor: d.color }]}
                onPress={() => setDifficulty(d.key)}
              >
                <Text style={[styles.chipText, difficulty === d.key && { color: d.color }]}>{d.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Repeat</Text>
          <View style={styles.row}>
            {RECURRENCE_TYPES.map(r => (
              <Pressable
                key={r.key}
                style={[styles.chip, recurrenceType === r.key && styles.chipActive]}
                onPress={() => setRecurrenceType(r.key)}
              >
                <Text style={[styles.chipText, recurrenceType === r.key && styles.chipTextActive]}>{r.label}</Text>
              </Pressable>
            ))}
          </View>

          {(recurrenceType === 'weekly' || recurrenceType === 'custom') && (
            <>
              <Text style={styles.label}>{recurrenceType === 'weekly' ? 'Which day?' : 'Which days?'}</Text>
              <View style={styles.row}>
                {DAY_NAMES.map((name, i) => {
                  const selected = selectedDays.includes(i);
                  return (
                    <Pressable
                      key={i}
                      style={[styles.dayChip, selected && styles.dayChipActive]}
                      onPress={() => {
                        if (recurrenceType === 'weekly') {
                          setSelectedDays([i]);
                        } else {
                          toggleDay(i);
                        }
                      }}
                    >
                      <Text style={[styles.dayChipText, selected && styles.dayChipTextActive]}>{name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.btnRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!title.trim()}
            >
              <Text style={styles.addBtnText}>Create</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.textMuted, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  heading: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.lg },
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.surfaceLight,
  },
  chipActive: { backgroundColor: Colors.accent + '22', borderColor: Colors.accent },
  chipText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  chipTextActive: { color: Colors.accent },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  dayChipActive: { backgroundColor: Colors.accent + '33', borderColor: Colors.accent },
  dayChipText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
  dayChipTextActive: { color: Colors.accent },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  cancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', backgroundColor: Colors.surfaceLight },
  cancelText: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '600' },
  addBtn: { flex: 2, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', backgroundColor: Colors.accent },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
});
