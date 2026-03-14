import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  PlayerProfile,
  PlayerStats,
  ActiveDebuff,
  LootItem,
  PlayerClass,
} from '../types/game';
import type { Database } from '../types/database';
import { getLevelFromTotalXp } from '../lib/xpCalculator';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type StatsRow = Database['public']['Tables']['stats_live']['Row'];
type DebuffRow = Database['public']['Tables']['active_debuffs']['Row'];
type LootRow = Database['public']['Tables']['loot']['Row'];

interface ProfileState {
  profile: PlayerProfile | null;
  stats: PlayerStats | null;
  debuffs: ActiveDebuff[];
  loot: LootItem[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDebuffs: () => Promise<void>;
  fetchLoot: () => Promise<void>;
  fetchAll: () => Promise<void>;
  equipLoot: (lootId: string) => Promise<void>;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  stats: null,
  debuffs: [],
  loot: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const row = data as ProfileRow | null;
      if (row) {
        const totalXp = row.total_xp ?? 0;
        const levelInfo = getLevelFromTotalXp(totalXp);
        set({
          profile: {
            id: row.id,
            username: row.username,
            class: row.class as PlayerClass,
            level: levelInfo.level,
            totalXp,
            stats: { str: 0, con: 0, sta: 0, wis: 0, cha: 0 },
            avatarConfig: (row.avatar_config as Record<string, string>) ?? {},
          },
          error: null,
        });
      }
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch profile' });
    }
  },

  fetchStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('stats_live')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const row = data as StatsRow | null;
      if (row) {
        const stats: PlayerStats = {
          str: row.str ?? 0,
          con: row.con ?? 0,
          sta: row.sta ?? 0,
          wis: row.wis ?? 0,
          cha: row.cha ?? 0,
        };
        set((state) => ({
          stats,
          profile: state.profile ? { ...state.profile, stats } : null,
          error: null,
        }));
      }
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch stats' });
    }
  },

  fetchDebuffs: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('active_debuffs')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      const rows = (data ?? []) as DebuffRow[];
      set({
        debuffs: rows.map((d) => ({
          id: d.id,
          debuffType: d.debuff_type as ActiveDebuff['debuffType'],
          cause: d.cause,
          appliedAt: d.applied_at,
          expiresAt: d.expires_at,
          isActive: d.is_active,
        })),
      });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch debuffs' });
    }
  },

  fetchLoot: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('loot')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as LootRow[];
      set({
        loot: rows.map((l) => ({
          id: l.id,
          itemName: l.item_name,
          itemType: l.item_type as LootItem['itemType'],
          rarity: l.rarity as LootItem['rarity'],
          earnedAt: l.earned_at,
          source: l.source,
          equipped: l.equipped,
        })),
      });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch loot' });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const store = useProfileStore.getState();
      await Promise.all([
        store.fetchProfile(),
        store.fetchStats(),
        store.fetchDebuffs(),
        store.fetchLoot(),
      ]);
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch profile data' });
    }
    set({ isLoading: false });
  },

  equipLoot: async (lootId: string) => {
    const currentLoot = get().loot;
    const item = currentLoot.find((l) => l.id === lootId);
    if (!item) return;

    const newEquipped = !item.equipped;

    // Optimistic update
    set({
      loot: currentLoot.map((l) =>
        l.id === lootId ? { ...l, equipped: newEquipped } : l
      ),
    });

    const { error } = await supabase
      .from('loot')
      .update({ equipped: newEquipped } as any)
      .eq('id', lootId);

    if (error) {
      // Rollback on failure
      set({ loot: currentLoot });
    }
  },

  clear: () => {
    set({ profile: null, stats: null, debuffs: [], loot: [], isLoading: false, error: null });
  },
}));
