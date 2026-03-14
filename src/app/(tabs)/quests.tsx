import { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuestStore } from '../../stores/questStore';
import { useProfileStore } from '../../stores/profileStore';
import { QuestCard } from '../../components/quests/QuestCard';
import { CampaignProgress } from '../../components/quests/CampaignProgress';
import { COLORS, SPACING, FONT_SIZES } from '../../lib/constants';
import type { Quest } from '../../types/game';

export default function QuestsScreen() {
  const { quests, campaigns, isLoading, fetchTodayQuests, completeQuest, fetchCampaigns } = useQuestStore();
  const { fetchAll } = useProfileStore();
  const [sleepModalQuest, setSleepModalQuest] = useState<Quest | null>(null);
  const [sleepHours, setSleepHours] = useState('');

  useEffect(() => {
    fetchTodayQuests();
    fetchCampaigns();
  }, []);

  const onRefresh = useCallback(async () => {
    await Promise.all([fetchTodayQuests(), fetchCampaigns()]);
  }, []);

  const handleComplete = async (quest: Quest) => {
    if (quest.category === 'sleep') {
      setSleepModalQuest(quest);
      setSleepHours('');
      return;
    }
    const result = await completeQuest(quest.id);
    if (result) {
      await fetchAll();
    }
  };

  const handleSleepSubmit = async () => {
    if (!sleepModalQuest) return;
    const hours = parseFloat(sleepHours) || 0;
    const result = await completeQuest(sleepModalQuest.id, { hours_slept: hours });
    setSleepModalQuest(null);
    if (result) {
      await fetchAll();
    }
  };

  const dailyQuests = quests.filter((q) => !q.isCampaign);
  const campaignQuests = quests.filter((q) => q.isCampaign);
  const completedCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={dailyQuests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestCard quest={item} onComplete={() => handleComplete(item)} />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Daily Quests</Text>
              <Text style={styles.counter}>
                {completedCount}/{dailyQuests.length}
              </Text>
            </View>

            {campaigns.length > 0 && (
              <View style={styles.campaignSection}>
                <Text style={styles.sectionTitle}>Active Campaigns</Text>
                {campaigns.filter((c) => !c.isComplete).map((c) => (
                  <CampaignProgress key={c.id} campaign={c} />
                ))}
              </View>
            )}

            {campaignQuests.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Campaign Quests</Text>
                {campaignQuests.map((q) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    onComplete={() => handleComplete(q)}
                  />
                ))}
              </View>
            )}

            {dailyQuests.length > 0 && (
              <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>
                Today's Quests
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No quests today</Text>
              <Text style={styles.emptySubtitle}>
                Pull down to refresh, or check back tomorrow!
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      <Modal
        visible={sleepModalQuest !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSleepModalQuest(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How many hours did you sleep?</Text>
            <Text style={styles.modalSubtitle}>
              {sleepModalQuest?.titleRpg}
            </Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="decimal-pad"
              placeholder="e.g. 7.5"
              placeholderTextColor={COLORS.textMuted}
              value={sleepHours}
              onChangeText={setSleepHours}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setSleepModalQuest(null)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleSleepSubmit}
              >
                <Text style={styles.modalButtonConfirmText}>Log Sleep</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  counter: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  campaignSection: {
    marginBottom: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    width: '85%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalButtonCancel: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
