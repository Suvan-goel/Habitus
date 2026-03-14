import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { BossRaid } from '../types/game';
import type { Database } from '../types/database';
import { getWeekStart } from '../utils/formatters';

type BossRow = Database['public']['Tables']['boss_raids']['Row'];

function rowToBoss(row: BossRow): BossRaid {
  return {
    id: row.id,
    weekStart: row.week_start,
    bossName: row.boss_name,
    bossMaxHp: row.boss_max_hp,
    damageDealt: row.damage_dealt,
    isDefeated: row.is_defeated,
    sleepBonus: row.sleep_bonus,
    breakdown: (row.breakdown as Record<string, number>) ?? {},
    evaluatedAt: row.evaluated_at,
  };
}

interface BossState {
  currentBoss: BossRaid | null;
  history: BossRaid[];
  isLoading: boolean;

  fetchCurrentBoss: () => Promise<void>;
  fetchBossHistory: () => Promise<void>;
  evaluateBoss: () => Promise<BossRaid | null>;
  clear: () => void;
}

export const useBossStore = create<BossState>((set) => ({
  currentBoss: null,
  history: [],
  isLoading: false,

  fetchCurrentBoss: async () => {
    set({ isLoading: true });
    const weekStart = getWeekStart();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoading: false });
      return;
    }

    const { data } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .single();

    const row = data as BossRow | null;
    set({
      currentBoss: row ? rowToBoss(row) : null,
      isLoading: false,
    });
  },

  fetchBossHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('boss_raids')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(10);

    const rows = (data ?? []) as BossRow[];
    set({ history: rows.map(rowToBoss) });
  },

  evaluateBoss: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-boss', {
        body: { weekStart: getWeekStart() },
      });

      if (error || !data) {
        set({ isLoading: false });
        return null;
      }

      const boss: BossRaid = {
        id: data.id,
        weekStart: data.weekStart,
        bossName: data.bossName,
        bossMaxHp: data.bossMaxHp,
        damageDealt: data.damageDealt,
        isDefeated: data.isDefeated,
        sleepBonus: data.sleepBonus,
        breakdown: data.breakdown,
        evaluatedAt: data.evaluatedAt,
      };

      set({ currentBoss: boss, isLoading: false });
      return boss;
    } catch {
      set({ isLoading: false });
      return null;
    }
  },

  clear: () => {
    set({ currentBoss: null, history: [], isLoading: false });
  },
}));
