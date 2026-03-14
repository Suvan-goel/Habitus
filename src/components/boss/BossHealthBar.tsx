import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface BossHealthBarProps {
  currentHp: number;
  maxHp: number;
}

export function BossHealthBar({ currentHp, maxHp }: BossHealthBarProps) {
  const hpPercent = Math.max(0, currentHp / maxHp);
  const barColor = hpPercent > 0.5 ? COLORS.danger : hpPercent > 0.25 ? COLORS.warning : COLORS.success;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Boss HP</Text>
        <Text style={styles.hpText}>
          {Math.max(0, currentHp)} / {maxHp}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${hpPercent * 100}%`, backgroundColor: barColor },
          ]}
        />
      </View>
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  hpText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  barBackground: {
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
});
