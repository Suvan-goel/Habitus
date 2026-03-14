import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Quest, Campaign, QuestPriority, QuestCategory, Attribute } from '../types/game';
import type { Database } from '../types/database';
import type { CompleteQuestResponse } from '../types/api';
import { sortQuestsByPriority } from '../lib/questPriorityQueue';
import { getTodayString } from '../utils/formatters';

interface QuestState {
  quests: Quest[];
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;

  fetchTodayQuests: () => Promise<void>;
  completeQuest: (journalEntryId: string, value?: Record<string, unknown>) => Promise<CompleteQuestResponse | null>;
  fetchCampaigns: () => Promise<void>;
  clear: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  campaigns: [],
  isLoading: false,
  error: null,

  fetchTodayQuests: async () => {
    set({ isLoading: true, error: null });
    try {
      const today = getTodayString();

      const { data, error } = await supabase
        .from('daily_journal')
        .select(`
          id,
          quest_def_id,
          date,
          completed,
          completed_at,
          xp_awarded,
          value,
          quest_definitions (
            id,
            title_plain,
            title_rpg,
            description,
            attribute,
            base_xp,
            priority,
            category,
            is_campaign
          )
        `)
        .eq('date', today)
        .order('completed', { ascending: true });

      if (error) throw error;

      if (data) {
        const quests: Quest[] = data.map((entry: any) => {
          const qd = entry.quest_definitions as unknown as {
            id: string;
            title_plain: string;
            title_rpg: string;
            description: string | null;
            attribute: string;
            base_xp: number;
            priority: string;
            category: string;
            is_campaign: boolean;
          };
          return {
            id: entry.id,
            questDefId: qd.id,
            titlePlain: qd.title_plain,
            titleRpg: qd.title_rpg,
            description: qd.description,
            attribute: qd.attribute as Attribute,
            baseXp: qd.base_xp,
            priority: qd.priority as QuestPriority,
            category: qd.category as QuestCategory,
            completed: entry.completed,
            completedAt: entry.completed_at,
            xpAwarded: entry.xp_awarded,
            date: entry.date,
            isCampaign: qd.is_campaign,
          };
        });

        set({ quests: sortQuestsByPriority(quests), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e: any) {
      set({ isLoading: false, error: e.message ?? 'Failed to fetch quests' });
    }
  },

  completeQuest: async (journalEntryId, value) => {
    try {
      const { data, error } = await supabase.functions.invoke('complete-quest', {
        body: { journalEntryId, value },
      });

      if (error) {
        set({ error: 'Failed to complete quest' });
        return null;
      }

      const response = data as CompleteQuestResponse;

      set((state) => ({
        quests: state.quests.map((q) =>
          q.id === journalEntryId
            ? { ...q, completed: true, completedAt: new Date().toISOString(), xpAwarded: response.xpAwarded }
            : q
        ),
        error: null,
      }));

      return response;
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to complete quest' });
      return null;
    }
  },

  fetchCampaigns: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
      const rows = (data ?? []) as CampaignRow[];
      set({
        campaigns: rows.map((c) => ({
          id: c.id,
          campaignName: c.campaign_name,
          startedAt: c.started_at,
          currentDay: c.current_day,
          isComplete: c.is_complete,
          completedDays: c.completed_days,
        })),
      });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch campaigns' });
    }
  },

  clear: () => {
    set({ quests: [], campaigns: [], isLoading: false, error: null });
  },
}));
