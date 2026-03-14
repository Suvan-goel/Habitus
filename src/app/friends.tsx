import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSocialStore, type Friend, type DuelResult } from '../stores/socialStore';
import { useAuthStore } from '../stores/authStore';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../lib/constants';
import { CLASS_INFO } from '../types/game';

export default function FriendsScreen() {
  const { friends, pendingRequests, isLoading, fetchFriends, sendFriendRequest, acceptFriendRequest, challengeFriend } = useSocialStore();
  const user = useAuthStore((s) => s.user);
  const [searchUsername, setSearchUsername] = useState('');
  const [duelResult, setDuelResult] = useState<DuelResult | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    if (!searchUsername.trim()) return;
    const { error } = await sendFriendRequest(searchUsername.trim());
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Sent!', `Friend request sent to ${searchUsername}`);
      setSearchUsername('');
    }
  };

  const handleAccept = async (friendshipId: string) => {
    await acceptFriendRequest(friendshipId);
  };

  const handleChallenge = async (friendId: string) => {
    const result = await challengeFriend(friendId);
    if (result) {
      setDuelResult(result);
    }
  };

  const renderFriend = ({ item }: { item: Friend }) => {
    const classInfo = CLASS_INFO[item.class];
    return (
      <View style={styles.friendCard}>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.username}</Text>
          <View style={styles.friendMeta}>
            <Text style={[styles.friendClass, { color: classInfo?.color ?? COLORS.text }]}>
              {classInfo?.label ?? item.class}
            </Text>
            <Text style={styles.friendLevel}>Lv. {item.level}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.challengeButton}
          onPress={() => handleChallenge(item.userId)}
        >
          <Text style={styles.challengeButtonText}>Duel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPending = ({ item }: { item: Friend }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.pendingLabel}>Wants to be your friend</Text>
      </View>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAccept(item.friendshipId)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Friends', headerStyle: { backgroundColor: COLORS.background } }} />

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username..."
            placeholderTextColor={COLORS.textMuted}
            value={searchUsername}
            onChangeText={setSearchUsername}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {duelResult && (
          <View style={styles.duelResult}>
            <Text style={styles.duelTitle}>Duel Result</Text>
            <Text style={styles.duelScore}>
              You: {duelResult.challengerScore} vs {duelResult.opponentUsername}: {duelResult.defenderScore}
            </Text>
            <Text style={[
              styles.duelOutcome,
              { color: duelResult.winnerId === user?.id ? COLORS.success : COLORS.danger },
            ]}>
              {duelResult.winnerId === user?.id ? 'VICTORY!' : 'DEFEAT!'}
            </Text>
            <TouchableOpacity onPress={() => setDuelResult(null)}>
              <Text style={styles.duelDismiss}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.friendshipId}
              renderItem={renderPending}
              scrollEnabled={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Friends ({friends.length})
          </Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : friends.length === 0 ? (
            <Text style={styles.emptyText}>No friends yet. Search for a username above!</Text>
          ) : (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.friendshipId}
              renderItem={renderFriend}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  searchSection: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  friendMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 2,
  },
  friendClass: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  friendLevel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  pendingLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  challengeButton: {
    backgroundColor: COLORS.danger + '20',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  challengeButtonText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  duelResult: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  duelTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  duelScore: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  duelOutcome: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  duelDismiss: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
