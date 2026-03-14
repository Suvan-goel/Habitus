import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';
import type { BossRaid } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface BossArenaProps {
  boss: BossRaid;
}

export function BossArena({ boss }: BossArenaProps) {
  const hpPercent = Math.max(0, (boss.bossMaxHp - boss.damageDealt) / boss.bossMaxHp);
  const isDefeated = boss.isDefeated || boss.damageDealt >= boss.bossMaxHp;

  return (
    <View style={styles.container}>
      <View style={styles.bossVisual}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          {/* Boss body */}
          <Circle
            cx={60}
            cy={55}
            r={35}
            fill={isDefeated ? COLORS.textMuted : COLORS.danger}
            opacity={isDefeated ? 0.4 : 0.8 + hpPercent * 0.2}
          />
          {/* Eyes */}
          <Circle cx={48} cy={48} r={5} fill={isDefeated ? '#C0C0C0' : '#fff'} />
          <Circle cx={72} cy={48} r={5} fill={isDefeated ? '#C0C0C0' : '#fff'} />
          <Circle cx={48} cy={48} r={2.5} fill={isDefeated ? '#D0D0D0' : COLORS.danger} />
          <Circle cx={72} cy={48} r={2.5} fill={isDefeated ? '#D0D0D0' : COLORS.danger} />
          {/* Horns */}
          <Polygon
            points="35,30 25,5 40,25"
            fill={isDefeated ? COLORS.textMuted : COLORS.warning}
          />
          <Polygon
            points="85,30 95,5 80,25"
            fill={isDefeated ? COLORS.textMuted : COLORS.warning}
          />
          {/* Mouth */}
          <Rect
            x={45}
            y={62}
            width={30}
            height={6}
            rx={3}
            fill={isDefeated ? '#C0C0C0' : '#fff'}
          />
        </Svg>
      </View>

      <Text style={[styles.bossName, isDefeated && styles.defeatedText]}>
        {boss.bossName}
      </Text>

      {isDefeated && (
        <Text style={styles.defeatedBanner}>DEFEATED!</Text>
      )}

      {boss.sleepBonus && (
        <View style={styles.bonusBadge}>
          <Text style={styles.bonusText}>Sleep Bonus Active (1.5x)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  bossVisual: {
    marginBottom: SPACING.md,
  },
  bossName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.danger,
    textAlign: 'center',
  },
  defeatedText: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  defeatedBanner: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: SPACING.sm,
  },
  bonusBadge: {
    backgroundColor: COLORS.sta + '30',
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.sm,
  },
  bonusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.sta,
    fontWeight: '600',
  },
});
