import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { PlayerClass } from '../types/game';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  hasProfile: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  selectClass: (username: string, playerClass: PlayerClass) => Promise<{ error: string | null }>;
  checkProfile: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  hasProfile: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      if (session?.user) {
        await get().checkProfile();
      }

      supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          await get().checkProfile();
        } else {
          set({ hasProfile: false });
        }
      });
    } catch (e) {
      console.error('[Habitus] Auth initialization failed:', e);
      set({ isLoading: false });
    }
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, hasProfile: false });
  },

  selectClass: async (username, playerClass) => {
    const user = get().user;
    if (!user) return { error: 'Not authenticated' };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username,
      class: playerClass,
    } as any);

    if (profileError) return { error: profileError.message };

    const { error: statsError } = await supabase.from('stats_live').insert({
      user_id: user.id,
    } as any);

    if (statsError) return { error: statsError.message };

    set({ hasProfile: true });

    // Seed today's quests for the new user (don't block on failure)
    try {
      await supabase.functions.invoke('seed-daily-quests');
    } catch (e) {
      console.warn('Failed to seed initial quests:', e);
    }

    return { error: null };
  },

  checkProfile: async () => {
    const user = get().user;
    if (!user) return false;

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    const hasProfile = !!data;
    set({ hasProfile });
    return hasProfile;
  },
}));
