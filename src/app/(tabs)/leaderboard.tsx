import { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useLeaderboardStore, type LeaderboardEntry } from '../../stores/leaderboardStore';
import { useAuthStore } from '../../stores/authStore';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';
import { CLASS_INFO } from '../../types/game';
import { formatXp } from '../../utils/formatters';

export default function LeaderboardScreen() {
  const { neighbors, userRank, isLoading, fetchLeaderboard } = useLeaderboardStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const renderItem = ({ item }: { item: LeaderboardEntry }) => {
    const isMe = item.userId === user?.id;
    const classInfo = CLASS_INFO[item.class];

    return (
      <View style={[styles.card, isMe && styles.cardHighlight]}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{item.rank}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.username, isMe && styles.usernameHighlight]}>
            {item.username} {isMe ? '(You)' : ''}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.classLabel, { color: classInfo?.color ?? COLORS.text }]}>
              {classInfo?.label ?? item.class}
            </Text>
            <Text style={styles.level}>Lv. {item.level}</Text>
          </View>
        </View>
        <View style={styles.xpContainer}>
          <Text style={styles.xpValue}>{formatXp(item.totalXp)}</Text>
          <Text style={styles.xpLabel}>XP</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={neighbors}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.subtitle}>
              Your position and nearby adventurers
            </Text>
            {userRank && (
              <View style={styles.rankDisplay}>
                <Text style={styles.rankDisplayText}>Your Rank: #{userRank}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No rankings available yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchLeaderboard}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.lg,
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
  },
  rankDisplay: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 10,
    padding: SPACING.md,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  rankDisplayText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  cardHighlight: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rankText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  usernameHighlight: {
    color: COLORS.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 2,
  },
  classLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  level: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  xpLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textMuted,
  },
});
