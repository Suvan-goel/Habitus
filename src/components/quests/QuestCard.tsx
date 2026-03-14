import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { Quest } from '../../types/game';
import { CATEGORY_LABELS, ATTRIBUTE_LABELS } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';
import { successHaptic } from '../../utils/haptics';

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: COLORS.danger,
  high: COLORS.warning,
  normal: COLORS.textMuted,
};

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const handlePress = () => {
    if (!quest.completed) {
      successHaptic();
      onComplete();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, quest.completed && styles.cardCompleted]}
      onPress={handlePress}
      disabled={quest.completed}
      activeOpacity={0.7}
    >
      <View style={styles.leftBorder}>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: PRIORITY_COLORS[quest.priority] },
          ]}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, quest.completed && styles.titleCompleted]}
          numberOfLines={1}
        >
          {quest.titleRpg}
        </Text>
        <Text style={styles.subtitle}>{quest.titlePlain}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: COLORS[quest.attribute] + '30' }]}>
            <Text style={[styles.badgeText, { color: COLORS[quest.attribute] }]}>
              {ATTRIBUTE_LABELS[quest.attribute]}
            </Text>
          </View>
          <Text style={styles.category}>{CATEGORY_LABELS[quest.category]}</Text>
          <Text style={styles.xp}>+{quest.completed ? quest.xpAwarded : quest.baseXp} XP</Text>
        </View>
      </View>

      <View style={styles.checkContainer}>
        <View style={[styles.checkbox, quest.completed && styles.checkboxChecked]}>
          {quest.completed && <Text style={styles.checkmark}>{'✓'}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  leftBorder: {
    width: 4,
  },
  priorityIndicator: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  xp: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  checkContainer: {
    justifyContent: 'center',
    paddingRight: SPACING.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
