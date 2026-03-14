import { View, Text, StyleSheet } from 'react-native';
import type { BossRaid } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

const BREAKDOWN_LABELS: Record<string, string> = {
  exercise: 'Exercise',
  diet: 'Diet',
  sleep: 'Sleep',
  mental_health: 'Mental Health',
  recreation: 'Recreation',
  sleep_bonus: 'Sleep Bonus',
  debuff_penalty: 'Debuff Penalty',
};

interface DamageBreakdownProps {
  boss: BossRaid;
}

export function DamageBreakdown({ boss }: DamageBreakdownProps) {
  const breakdown = boss.breakdown;
  const entries = Object.entries(breakdown);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Damage Breakdown</Text>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Damage</Text>
        <Text style={styles.totalValue}>{boss.damageDealt}</Text>
      </View>

      {entries.length > 0 ? (
        entries.map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.rowLabel}>{BREAKDOWN_LABELS[key] ?? key}</Text>
            <Text style={[styles.rowValue, (value as number) < 0 && { color: COLORS.danger }]}>
              {value}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>
          Damage details will appear after the boss is evaluated on Sunday.
        </Text>
      )}

      {boss.sleepBonus && (
        <View style={styles.bonusRow}>
          <Text style={styles.bonusLabel}>Sleep Bonus (1.5x)</Text>
          <Text style={styles.bonusValue}>Applied!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    ...CARD_SHADOW,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  rowLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  rowValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  bonusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bonusLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.sta,
    fontWeight: '600',
  },
  bonusValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  noData: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});
