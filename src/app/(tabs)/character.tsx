import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useProfileStore } from '../../stores/profileStore';
import { StatRadar } from '../../components/character/StatRadar';
import { LevelDisplay } from '../../components/character/LevelDisplay';
import { AvatarRenderer } from '../../components/avatar/AvatarRenderer';
import { DebuffBadge } from '../../components/character/DebuffBadge';
import { LootInventory } from '../../components/character/LootInventory';
import { COLORS, SPACING, FONT_SIZES } from '../../lib/constants';
import { CLASS_INFO } from '../../types/game';

export default function CharacterScreen() {
  const { profile, stats, debuffs, loot, isLoading, fetchAll, equipLoot } = useProfileStore();

  useEffect(() => {
    fetchAll();
  }, []);

  if (!profile || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading character...</Text>
      </View>
    );
  }

  const classInfo = CLASS_INFO[profile.class];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchAll}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.avatarSection}>
        <AvatarRenderer stats={stats} playerClass={profile.class} />
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={[styles.classLabel, { color: classInfo.color }]}>
          {classInfo.label}
        </Text>
      </View>

      <LevelDisplay
        level={profile.level}
        totalXp={profile.totalXp}
      />

      {debuffs.length > 0 && (
        <View style={styles.debuffSection}>
          <Text style={styles.sectionTitle}>Active Effects</Text>
          <View style={styles.debuffRow}>
            {debuffs.map((d) => (
              <DebuffBadge key={d.id} debuff={d} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Attributes</Text>
        <StatRadar stats={stats} />
      </View>

      {loot.length > 0 && (
        <View style={styles.lootSection}>
          <Text style={styles.sectionTitle}>Loot</Text>
          <LootInventory loot={loot} onEquip={equipLoot} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    marginTop: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  username: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  classLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  debuffSection: {
    marginBottom: SPACING.lg,
  },
  debuffRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statsSection: {
    marginBottom: SPACING.lg,
  },
  lootSection: {
    marginBottom: SPACING.lg,
  },
});
