export interface CompleteQuestRequest {
  journalEntryId: string;
  value?: Record<string, unknown>;
}

export interface CompleteQuestResponse {
  success: boolean;
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  statUpdated: string;
  statNewValue: number;
  secondaryStatUpdated?: string;
  secondaryStatNewValue?: number;
  lootAwarded?: {
    itemName: string;
    itemType: string;
    rarity: string;
  };
  leveledUp: boolean;
}

export interface EvaluateBossRequest {
  userId: string;
  weekStart: string;
}

export interface EvaluateBossResponse {
  success: boolean;
  bossName: string;
  damageDealt: number;
  bossMaxHp: number;
  isDefeated: boolean;
  sleepBonus: boolean;
  breakdown: Record<string, number>;
}
