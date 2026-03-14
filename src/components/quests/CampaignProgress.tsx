import { View, Text, StyleSheet } from 'react-native';
import type { Campaign } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface CampaignProgressProps {
  campaign: Campaign;
}

export function CampaignProgress({ campaign }: CampaignProgressProps) {
  const progress = campaign.completedDays / 30;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{campaign.campaignName}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]}
          />
        </View>
        <Text style={styles.dayText}>
          Day {campaign.currentDay}/30
        </Text>
      </View>
      <Text style={styles.completedText}>
        {campaign.completedDays} days completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...CARD_SHADOW,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  dayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  completedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
