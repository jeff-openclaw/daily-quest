import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useStore } from '../store/useStore';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CalendarHeatmap() {
  const dayRecords = useStore(s => s.dayRecords);

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const days: { date: string; status: 'completed' | 'missed' | 'freeze' | 'future' | 'empty' }[] = [];

    // Go back ~16 weeks (112 days)
    const start = new Date(today);
    start.setDate(start.getDate() - 111);
    // Align to Sunday
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay())); // to Saturday

    const cursor = new Date(start);
    while (cursor <= end) {
      const dateStr = cursor.toISOString().split('T')[0];
      const record = dayRecords[dateStr];
      const isFuture = cursor > today;

      let status: typeof days[0]['status'];
      if (isFuture) {
        status = 'future';
      } else if (record?.goalMet) {
        status = 'completed';
      } else if (record?.streakFreezeUsed) {
        status = 'freeze';
      } else if (record) {
        status = 'missed';
      } else {
        status = 'empty';
      }

      days.push({ date: dateStr, status });
      cursor.setDate(cursor.getDate() + 1);
    }

    // Group into weeks (columns)
    const weeks: typeof days[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Month labels
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], weekIndex: wi });
        lastMonth = month;
      }
    });

    return { weeks, monthLabels };
  }, [dayRecords]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Activity Calendar</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Month labels */}
          <View style={styles.monthRow}>
            <View style={styles.dayLabelCol} />
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.weekIndex === wi);
              return (
                <View key={wi} style={styles.cellContainer}>
                  <Text style={styles.monthLabel}>{ml?.label || ''}</Text>
                </View>
              );
            })}
          </View>

          {/* Grid */}
          {DAYS.map((dayLabel, di) => (
            <View key={di} style={styles.row}>
              <View style={styles.dayLabelCol}>
                <Text style={styles.dayLabel}>{di % 2 === 1 ? dayLabel : ''}</Text>
              </View>
              {weeks.map((week, wi) => {
                const day = week[di];
                if (!day) return <View key={wi} style={styles.cellContainer} />;
                return (
                  <View key={wi} style={styles.cellContainer}>
                    <View style={[styles.cell, getCellStyle(day.status)]} />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color={Colors.success} label="Completed" />
        <LegendItem color="#FFD700" label="Freeze" />
        <LegendItem color={Colors.danger + '66'} label="Missed" />
        <LegendItem color={Colors.surfaceLight} label="No data" />
      </View>
    </View>
  );
}

function getCellStyle(status: string) {
  switch (status) {
    case 'completed': return { backgroundColor: Colors.success };
    case 'freeze': return { backgroundColor: '#FFD700' };
    case 'missed': return { backgroundColor: Colors.danger + '66' };
    case 'future': return { backgroundColor: Colors.surfaceBorder, opacity: 0.3 };
    default: return { backgroundColor: Colors.surfaceLight };
  }
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
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
  title: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  monthRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayLabelCol: {
    width: 16,
    justifyContent: 'center',
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
  monthLabel: {
    color: Colors.textMuted,
    fontSize: 9,
  },
  row: {
    flexDirection: 'row',
  },
  cellContainer: {
    width: 14,
    height: 14,
    padding: 1,
  },
  cell: {
    flex: 1,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});
