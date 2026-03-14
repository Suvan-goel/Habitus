import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useBossStore } from '../../stores/bossStore';
import { BossArena } from '../../components/boss/BossArena';
import { BossHealthBar } from '../../components/boss/BossHealthBar';
import { DamageBreakdown } from '../../components/boss/DamageBreakdown';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';
import { formatDate } from '../../utils/formatters';

export default function BossScreen() {
  const { currentBoss, history, isLoading, fetchCurrentBoss, fetchBossHistory } = useBossStore();

  useEffect(() => {
    fetchCurrentBoss();
    fetchBossHistory();
  }, []);

  const onRefresh = async () => {
    await Promise.all([fetchCurrentBoss(), fetchBossHistory()]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <Text style={styles.title}>Weekly Boss Battle</Text>
      <Text style={styles.subtitle}>
        Complete quests throughout the week to deal damage!
      </Text>

      {currentBoss ? (
        <View style={styles.currentBoss}>
          <BossArena boss={currentBoss} />
          <BossHealthBar
            currentHp={Math.max(0, currentBoss.bossMaxHp - currentBoss.damageDealt)}
            maxHp={currentBoss.bossMaxHp}
          />
          <DamageBreakdown boss={currentBoss} />
        </View>
      ) : (
        <View style={styles.noBoss}>
          <Text style={styles.noBossTitle}>No Boss This Week</Text>
          <Text style={styles.noBossSubtitle}>
            A new boss will appear at the start of next week. Keep completing quests!
          </Text>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Past Battles</Text>
          {history.map((boss) => (
            <View key={boss.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyBossName}>{boss.bossName}</Text>
                <Text
                  style={[
                    styles.historyResult,
                    { color: boss.isDefeated ? COLORS.success : COLORS.danger },
                  ]}
                >
                  {boss.isDefeated ? 'DEFEATED' : 'SURVIVED'}
                </Text>
              </View>
              <Text style={styles.historyDate}>
                Week of {formatDate(boss.weekStart)}
              </Text>
              <Text style={styles.historyDamage}>
                Damage: {boss.damageDealt}/{boss.bossMaxHp}
                {boss.sleepBonus ? ' (Sleep Bonus!)' : ''}
              </Text>
            </View>
          ))}
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
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  currentBoss: {
    gap: SPACING.md,
  },
  noBoss: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  noBossTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  noBossSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  historySection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...CARD_SHADOW,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyBossName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  historyResult: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  historyDamage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
