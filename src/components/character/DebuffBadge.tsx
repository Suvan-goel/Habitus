import { View, Text, StyleSheet } from 'react-native';
import type { ActiveDebuff, DebuffType } from '../../types/game';
import { DEBUFF_RULES } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES } from '../../lib/constants';

interface DebuffBadgeProps {
  debuff: ActiveDebuff;
}

const DEBUFF_ICONS: Record<DebuffType, string> = {
  exhausted: 'ZZZ',
  malnourished: '!!',
  stressed: '~',
  isolated: '...',
  stagnant: '--',
};

export function DebuffBadge({ debuff }: DebuffBadgeProps) {
  const rule = DEBUFF_RULES[debuff.debuffType];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{DEBUFF_ICONS[debuff.debuffType]}</Text>
      <View>
        <Text style={styles.label}>{rule.label}</Text>
        <Text style={styles.description}>{rule.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger + '20',
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.danger + '40',
  },
  icon: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});
