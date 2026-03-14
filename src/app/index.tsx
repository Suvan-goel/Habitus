import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
  const { hasProfile } = useAuthStore();

  if (!hasProfile) {
    return <Redirect href="/(auth)/class-select" />;
  }

  return <Redirect href="/(tabs)/quests" />;
}
