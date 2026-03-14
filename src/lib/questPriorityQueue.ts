import type { QuestPriority, Quest } from '../types/game';

const PRIORITY_ORDER: Record<QuestPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
};

export function sortQuestsByPriority(quests: Quest[]): Quest[] {
  return [...quests].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Within same priority, incomplete first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });
}
