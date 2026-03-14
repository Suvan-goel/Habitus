import { DEBUFF_RULES, type DebuffType } from '../types/game';

export interface DailyLog {
  date: string;
  category: string;
  completed: boolean;
  value?: Record<string, unknown>;
}

export function checkDebuffCondition(
  debuffType: DebuffType,
  recentLogs: DailyLog[]
): boolean {
  const rule = DEBUFF_RULES[debuffType];

  // Filter logs for the relevant category over the window
  const relevantLogs = recentLogs
    .filter((log) => log.category === rule.category)
    .slice(0, rule.windowDays);

  if (relevantLogs.length < rule.windowDays) return false;

  // For sleep, check if hours are below threshold
  if (debuffType === 'exhausted') {
    return relevantLogs.every((log) => {
      const hours = (log.value as Record<string, number>)?.hours_slept ?? 0;
      return hours < rule.threshold;
    });
  }

  // For other categories, check if no tasks were completed
  return relevantLogs.every((log) => !log.completed);
}

export function getDebuffDescription(debuffType: DebuffType): string {
  return DEBUFF_RULES[debuffType].description;
}

export function getDebuffLabel(debuffType: DebuffType): string {
  return DEBUFF_RULES[debuffType].label;
}
