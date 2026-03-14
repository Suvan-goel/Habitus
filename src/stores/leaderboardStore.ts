import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { PlayerClass } from '../types/game';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  level: number;
  totalXp: number;
  class: PlayerClass;
}

interface LeaderboardState {
  neighbors: LeaderboardEntry[];
  userRank: number | null;
  isLoading: boolean;
  error: string | null;

  fetchLeaderboard: () => Promise<void>;
  clear: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  neighbors: [],
  userRank: null,
  isLoading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('get_leaderboard_neighbors', {
        target_user_id: user.id,
        radius: 2,
      });

      if (error) throw error;

      const entries: LeaderboardEntry[] = (data ?? []).map((row: any) => ({
        rank: Number(row.rank),
        userId: row.user_id,
        username: row.username,
        level: row.level,
        totalXp: Number(row.total_xp),
        class: row.class as PlayerClass,
      }));

      const userEntry = entries.find((e) => e.userId === user.id);

      set({ neighbors: entries, userRank: userEntry?.rank ?? null, isLoading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch leaderboard', isLoading: false });
    }
  },

  clear: () => set({ neighbors: [], userRank: null, isLoading: false, error: null }),
}));
