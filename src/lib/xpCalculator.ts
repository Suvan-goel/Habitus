import {
  XP_BASE,
  XP_SCALING_FACTOR,
  CLASS_MULTIPLIERS,
  ATTRIBUTE_MAP,
  SECONDARY_XP_RATIO,
  type PlayerClass,
  type QuestCategory,
  type Attribute,
  type DebuffType,
  type ActiveDebuff,
  DEBUFF_RULES,
} from '../types/game';

export function xpRequiredForLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(level, XP_SCALING_FACTOR));
}

export function getLevelFromTotalXp(totalXp: number): { level: number; currentLevelXp: number; xpForNextLevel: number } {
  let level = 1;
  let remaining = totalXp;
  let xpRequired = xpRequiredForLevel(level);

  while (remaining >= xpRequired) {
    remaining -= xpRequired;
    level++;
    xpRequired = xpRequiredForLevel(level);
  }

  return {
    level,
    currentLevelXp: remaining,
    xpForNextLevel: xpRequired,
  };
}

export function calculateQuestXp(
  baseXp: number,
  questCategory: QuestCategory,
  playerClass: PlayerClass,
  activeDebuffs: ActiveDebuff[]
): number {
  let xp = baseXp;

  // Apply class multiplier
  const classMultiplier = CLASS_MULTIPLIERS[playerClass]?.[questCategory] ?? 1;
  xp = xp * classMultiplier;

  // Apply debuff penalties
  for (const debuff of activeDebuffs) {
    if (!debuff.isActive) continue;
    const rule = DEBUFF_RULES[debuff.debuffType as DebuffType];
    if (rule && (rule.affectedCategory === questCategory || debuff.debuffType === 'malnourished')) {
      xp = Math.floor(xp / 2);
    }
  }

  return Math.max(1, xp);
}

export function getAttributeForCategory(category: QuestCategory): { primary: Attribute; secondary: Attribute | null } {
  return ATTRIBUTE_MAP[category];
}

export function calculateStatGains(xp: number, category: QuestCategory): Partial<Record<Attribute, number>> {
  const { primary, secondary } = ATTRIBUTE_MAP[category];
  const gains: Partial<Record<Attribute, number>> = {
    [primary]: Math.ceil(xp / 10),
  };
  if (secondary) {
    gains[secondary] = Math.ceil(xp * SECONDARY_XP_RATIO / 10);
  }
  return gains;
}
