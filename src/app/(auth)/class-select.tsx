import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { CLASS_INFO, type PlayerClass } from '../../types/game';
import { COLORS, SPACING, FONT_SIZES } from '../../lib/constants';
import { mediumHaptic, successHaptic } from '../../utils/haptics';

const CLASSES: PlayerClass[] = ['warrior', 'monk', 'bard'];

export default function ClassSelectScreen() {
  const [username, setUsername] = useState('');
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [loading, setLoading] = useState(false);
  const { selectClass } = useAuthStore();

  const handleSelect = (cls: PlayerClass) => {
    mediumHaptic();
    setSelectedClass(cls);
  };

  const handleConfirm = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }

    setLoading(true);
    const { error } = await selectClass(username.trim(), selectedClass);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error);
    } else {
      successHaptic();
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose Your Path</Text>
        <Text style={styles.subtitle}>Pick a class and enter your adventurer name</Text>

        <TextInput
          style={styles.input}
          placeholder="Adventurer Name"
          placeholderTextColor={COLORS.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          maxLength={20}
        />

        <View style={styles.classGrid}>
          {CLASSES.map((cls) => {
            const info = CLASS_INFO[cls];
            const isSelected = selectedClass === cls;
            return (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classCard,
                  { borderColor: isSelected ? info.color : COLORS.border },
                  isSelected && { backgroundColor: info.color + '20' },
                ]}
                onPress={() => handleSelect(cls)}
              >
                <Text style={[styles.classIcon, { color: info.color }]}>
                  {cls === 'warrior' ? '  ' : cls === 'monk' ? '  ' : '  '}
                </Text>
                <Text style={[styles.className, { color: info.color }]}>
                  {info.label}
                </Text>
                <Text style={styles.classDesc}>{info.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedClass || loading) && styles.buttonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedClass || loading}
        >
          <Text style={styles.confirmText}>
            {loading ? 'Creating character...' : 'Begin Your Adventure'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 80,
    paddingBottom: SPACING.lg,
  },
  bottomBar: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  classGrid: {
    gap: SPACING.md,
  },
  classCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  classIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  className: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  classDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});
