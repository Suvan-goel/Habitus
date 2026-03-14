import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { LootItem, LootRarity } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';

interface LootInventoryProps {
  loot: LootItem[];
  onEquip?: (lootId: string) => void;
}

const RARITY_COLORS: Record<LootRarity, string> = {
  common: '#8E8E93',
  uncommon: '#1B9E5A',
  rare: '#2471A3',
  epic: '#7D3C98',
  legendary: '#B8972F',
};

export function LootInventory({ loot, onEquip }: LootInventoryProps) {
  return (
    <View style={styles.grid}>
      {loot.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.item,
            { borderColor: RARITY_COLORS[item.rarity] },
            item.equipped && styles.equipped,
          ]}
          onPress={() => onEquip?.(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.itemName, { color: RARITY_COLORS[item.rarity] }]}>
            {item.itemName}
          </Text>
          <Text style={styles.itemType}>{item.itemType}</Text>
          <Text style={item.equipped ? styles.equippedLabel : styles.equipHint}>
            {item.equipped ? 'Equipped' : 'Tap to equip'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  item: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.sm,
    borderWidth: 1,
    minWidth: 100,
    ...CARD_SHADOW,
  },
  equipped: {
    backgroundColor: COLORS.surfaceLight,
  },
  itemName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  equippedLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 2,
  },
  equipHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
