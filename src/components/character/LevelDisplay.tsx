import { View, Text, StyleSheet } from 'react-native';
import { getLevelFromTotalXp } from '../../lib/xpCalculator';
import { formatXp } from '../../utils/formatters';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface LevelDisplayProps {
  level: number;
  totalXp: number;
}

export function LevelDisplay({ level, totalXp }: LevelDisplayProps) {
  const { currentLevelXp, xpForNextLevel } = getLevelFromTotalXp(totalXp);
  const progress = xpForNextLevel > 0 ? currentLevelXp / xpForNextLevel : 0;

  return (
    <View style={styles.container}>
      <View style={styles.levelRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <View style={styles.xpInfo}>
          <Text style={styles.levelLabel}>Level {level}</Text>
          <Text style={styles.xpText}>
            {formatXp(currentLevelXp)} / {formatXp(xpForNextLevel)} XP
          </Text>
        </View>
        <Text style={styles.totalXp}>{formatXp(totalXp)} total</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...CARD_SHADOW,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  levelNumber: {
    color: '#fff',
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  xpInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  xpText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  totalXp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});
