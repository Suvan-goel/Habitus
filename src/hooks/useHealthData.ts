import { useState, useEffect } from 'react';
import {
  isHealthAvailable,
  initializeHealth,
  getStepCount,
  getSleepHours,
  getExerciseMinutes,
} from '../lib/healthService';

interface HealthDataState {
  steps: number;
  sleepHours: number;
  exerciseMinutes: number;
  isAvailable: boolean;
  isConnected: boolean;
  connect: () => Promise<boolean>;
}

export function useHealthData(date: string): HealthDataState {
  const [steps, setSteps] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const available = isHealthAvailable();

  const connect = async (): Promise<boolean> => {
    const ok = await initializeHealth();
    setIsConnected(ok);
    return ok;
  };

  useEffect(() => {
    if (!isConnected || !date) return;

    let cancelled = false;
    (async () => {
      const [s, sl, ex] = await Promise.all([
        getStepCount(date),
        getSleepHours(date),
        getExerciseMinutes(date),
      ]);
      if (cancelled) return;
      setSteps(s);
      setSleepHours(sl);
      setExerciseMinutes(ex);
    })();

    return () => { cancelled = true; };
  }, [date, isConnected]);

  return { steps, sleepHours, exerciseMinutes, isAvailable: available, isConnected, connect };
}
