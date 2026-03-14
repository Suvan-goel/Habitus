import type { PlayerStats, PlayerClass } from '../../types/game';

export type VisualTier = 'base' | 'tier1' | 'tier2' | 'tier3';

export interface AvatarConfig {
  bodyBuild: VisualTier;
  aura: VisualTier;
  complexion: VisualTier;
  energy: VisualTier;
  social: VisualTier;
  classOverlay: PlayerClass;
}

export function getVisualTier(statValue: number): VisualTier {
  if (statValue >= 75) return 'tier3';
  if (statValue >= 40) return 'tier2';
  if (statValue >= 15) return 'tier1';
  return 'base';
}

export function getAvatarConfig(stats: PlayerStats, playerClass: PlayerClass): AvatarConfig {
  return {
    bodyBuild: getVisualTier(stats.str),
    aura: getVisualTier(stats.wis),
    complexion: getVisualTier(stats.con),
    energy: getVisualTier(stats.sta),
    social: getVisualTier(stats.cha),
    classOverlay: playerClass,
  };
}

export const TIER_SIZES: Record<VisualTier, number> = {
  base: 80,
  tier1: 90,
  tier2: 100,
  tier3: 110,
};

export const AURA_OPACITY: Record<VisualTier, number> = {
  base: 0,
  tier1: 0.15,
  tier2: 0.3,
  tier3: 0.5,
};
