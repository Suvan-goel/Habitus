import { FlatList, View, Text, StyleSheet } from 'react-native';
import { QuestCard } from './QuestCard';
import type { Quest } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES } from '../../lib/constants';

interface QuestListProps {
  quests: Quest[];
  onComplete: (quest: Quest) => void;
}

export function QuestList({ quests, onComplete }: QuestListProps) {
  if (quests.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No quests available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={quests}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <QuestCard quest={item} onComplete={() => onComplete(item)} />
      )}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
});
