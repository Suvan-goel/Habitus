import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { useQuestStore } from '../../stores/questStore';
import { useBossStore } from '../../stores/bossStore';
import { COLORS, SPACING, FONT_SIZES, CARD_SHADOW } from '../../lib/constants';
import { CLASS_INFO } from '../../types/game';
import { formatXp } from '../../utils/formatters';
import { isHealthAvailable, initializeHealth } from '../../lib/healthService';

export default function SettingsScreen() {
  const { signOut, user } = useAuthStore();
  const { profile, debuffs, clear: profileClear } = useProfileStore();
  const questClear = useQuestStore((s) => s.clear);
  const bossClear = useBossStore((s) => s.clear);
  const [healthConnected, setHealthConnected] = useState(false);

  const handleConnectHealth = async () => {
    const ok = await initializeHealth();
    setHealthConnected(ok);
    if (ok) {
      Alert.alert('Connected', 'Health data is now connected. Exercise and sleep quests can auto-detect data.');
    } else {
      Alert.alert('Error', 'Could not connect to health data. Please check permissions.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          profileClear();
          questClear();
          bossClear();
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  const classInfo = profile ? CLASS_INFO[profile.class] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email ?? 'Unknown'}</Text>
        </View>
      </View>

      {profile && classInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class</Text>
            <Text style={[styles.infoValue, { color: classInfo.color }]}>
              {classInfo.label}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{profile.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total XP</Text>
            <Text style={styles.infoValue}>{formatXp(profile.totalXp)}</Text>
          </View>
        </View>
      )}

      {debuffs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Debuffs</Text>
          {debuffs.map((d) => (
            <View key={d.id} style={styles.debuffRow}>
              <Text style={styles.debuffLabel}>{d.debuffType}</Text>
              <Text style={styles.debuffCause}>{d.cause}</Text>
            </View>
          ))}
        </View>
      )}

      {isHealthAvailable() && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Data</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: healthConnected ? COLORS.success : COLORS.textMuted }]}>
              {healthConnected ? 'Connected' : 'Not connected'}
            </Text>
          </View>
          {!healthConnected && (
            <TouchableOpacity style={styles.connectButton} onPress={handleConnectHealth}>
              <Text style={styles.connectButtonText}>Connect Health Data</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.section}
        onPress={() => router.push('/friends' as any)}
        activeOpacity={0.7}
      >
        <View style={styles.friendsRow}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <Text style={styles.friendsArrow}>{'>'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Project</Text>
          <Text style={styles.infoValue}>ENGF0034 Coursework</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...CARD_SHADOW,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  debuffRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  debuffLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  debuffCause: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  logoutText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  friendsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendsArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textMuted,
  },
});
