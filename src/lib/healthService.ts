/**
 * Health data integration service.
 * Reads step count, sleep hours, and exercise minutes from native health APIs.
 *
 * Currently stubbed — the native packages (react-native-health, react-native-health-connect)
 * are not installed. When ready to enable:
 * 1. Install: npx expo install react-native-health react-native-health-connect
 * 2. Replace the stub implementations below with the real API calls.
 * 3. Build a dev client (expo prebuild / eas build) since these require native modules.
 */

import { Platform } from 'react-native';

export interface HealthData {
  steps: number;
  sleepHours: number;
  exerciseMinutes: number;
}

let _initialized = false;

export function isHealthAvailable(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export async function initializeHealth(): Promise<boolean> {
  if (_initialized) return true;

  // Stub: native health packages are not yet installed.
  // When installed, add permission request logic here.
  console.log('[Health] Health integration not yet installed — returning stub.');
  return false;
}

export async function getStepCount(_date: string): Promise<number> {
  if (!_initialized) return 0;
  return 0;
}

export async function getSleepHours(_date: string): Promise<number> {
  if (!_initialized) return 0;
  return 0;
}

export async function getExerciseMinutes(_date: string): Promise<number> {
  if (!_initialized) return 0;
  return 0;
}
