import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../lib/constants';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  quests: { active: 'shield', inactive: 'shield-outline' },
  character: { active: 'person', inactive: 'person-outline' },
  boss: { active: 'flame', inactive: 'flame-outline' },
  leaderboard: { active: 'trophy', inactive: 'trophy-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 3,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quest Board',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? TAB_ICONS.quests.active : TAB_ICONS.quests.inactive} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? TAB_ICONS.character.active : TAB_ICONS.character.inactive} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="boss"
        options={{
          title: 'Boss Battle',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? TAB_ICONS.boss.active : TAB_ICONS.boss.inactive} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? TAB_ICONS.leaderboard.active : TAB_ICONS.leaderboard.inactive} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? TAB_ICONS.settings.active : TAB_ICONS.settings.inactive} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
