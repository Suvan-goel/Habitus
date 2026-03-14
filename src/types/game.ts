export type PlayerClass = 'warrior' | 'monk' | 'bard';

export type Attribute = 'str' | 'con' | 'sta' | 'wis' | 'cha';

export type QuestCategory = 'exercise' | 'diet' | 'sleep' | 'mental_health' | 'recreation';

export type QuestPriority = 'critical' | 'high' | 'normal';

export type DebuffType = 'exhausted' | 'malnourished' | 'stressed' | 'isolated' | 'stagnant';

export type LootRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type LootSlot = 'helmet' | 'armor' | 'weapon' | 'aura' | 'title' | 'pet';

export const CLASS_MULTIPLIERS: Record<PlayerClass, Partial<Record<QuestCategory, number>>> = {
  warrior: { exercise: 2 },
  monk: { mental_health: 2, sleep: 2 },
  bard: { recreation: 2 },
};

export const ATTRIBUTE_MAP: Record<QuestCategory, { primary: Attribute; secondary: Attribute | null }> = {
  exercise: { primary: 'str', secondary: 'con' },
  diet: { primary: 'con', secondary: 'str' },
  sleep: { primary: 'sta', secondary: 'con' },
  mental_health: { primary: 'wis', secondary: null },
  recreation: { primary: 'cha', secondary: 'wis' },
};

export const SECONDARY_XP_RATIO = 0.5;

export const CATEGORY_LABELS: Record<QuestCategory, string> = {
  exercise: 'Exercise',
  diet: 'Diet',
  sleep: 'Sleep',
  mental_health: 'Mental Health',
  recreation: 'Recreation',
};

export const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  str: 'Strength',
  con: 'Constitution',
  sta: 'Stamina',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const CLASS_INFO: Record<PlayerClass, { label: string; description: string; color: string }> = {
  warrior: {
    label: 'Warrior',
    description: 'Gains double XP from Exercise tasks. Focus on physical fitness.',
    color: '#C0392B',
  },
  monk: {
    label: 'Monk',
    description: 'Gains double XP from Mental Health & Sleep. Focus on stress management.',
    color: '#7D3C98',
  },
  bard: {
    label: 'Bard',
    description: 'Gains double XP from Recreation & Social. Focus on work-life balance.',
    color: '#C9A834',
  },
};

export const DEBUFF_RULES: Record<
  DebuffType,
  { category: QuestCategory; threshold: number; windowDays: number; affectedCategory: QuestCategory; label: string; description: string }
> = {
  exhausted: {
    category: 'sleep',
    threshold: 6,
    windowDays: 3,
    affectedCategory: 'exercise',
    label: 'Exhausted',
    description: 'Poor sleep halves Exercise XP',
  },
  malnourished: {
    category: 'diet',
    threshold: 1,
    windowDays: 3,
    affectedCategory: 'diet',
    label: 'Malnourished',
    description: 'Poor diet halves all XP gains',
  },
  stressed: {
    category: 'mental_health',
    threshold: 0,
    windowDays: 3,
    affectedCategory: 'recreation',
    label: 'Stressed',
    description: 'Neglected mental health halves Recreation XP',
  },
  isolated: {
    category: 'recreation',
    threshold: 0,
    windowDays: 3,
    affectedCategory: 'mental_health',
    label: 'Isolated',
    description: 'No recreation halves Mental Health XP',
  },
  stagnant: {
    category: 'exercise',
    threshold: 0,
    windowDays: 3,
    affectedCategory: 'diet',
    label: 'Stagnant',
    description: 'No exercise halves Diet XP',
  },
};

// Leveling curve: xp_required = XP_BASE * (level ^ XP_SCALING_FACTOR)
export const XP_BASE = 100;
export const XP_SCALING_FACTOR = 1.5;

export interface PlayerStats {
  str: number;
  con: number;
  sta: number;
  wis: number;
  cha: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  class: PlayerClass;
  level: number;
  totalXp: number;
  stats: PlayerStats;
  avatarConfig: Record<string, string>;
}

export interface Quest {
  id: string;
  questDefId: string;
  titlePlain: string;
  titleRpg: string;
  description: string | null;
  attribute: Attribute;
  baseXp: number;
  priority: QuestPriority;
  category: QuestCategory;
  completed: boolean;
  completedAt: string | null;
  xpAwarded: number;
  date: string;
  isCampaign: boolean;
}

export interface BossRaid {
  id: string;
  weekStart: string;
  bossName: string;
  bossMaxHp: number;
  damageDealt: number;
  isDefeated: boolean;
  sleepBonus: boolean;
  breakdown: Record<string, number>;
  evaluatedAt: string | null;
}

export interface ActiveDebuff {
  id: string;
  debuffType: DebuffType;
  cause: string;
  appliedAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export interface LootItem {
  id: string;
  itemName: string;
  itemType: LootSlot;
  rarity: LootRarity;
  earnedAt: string;
  source: string;
  equipped: boolean;
}

export interface Campaign {
  id: string;
  campaignName: string;
  startedAt: string;
  currentDay: number;
  isComplete: boolean;
  completedDays: number;
}

export interface Friend {
  friendshipId: string;
  userId: string;
  username: string;
  level: number;
  class: PlayerClass;
  status: string;
}

export interface DuelResult {
  id: string;
  winnerId: string | null;
  challengerScore: number;
  defenderScore: number;
  opponentUsername: string;
}
