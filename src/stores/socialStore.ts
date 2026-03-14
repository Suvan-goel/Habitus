import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { PlayerClass } from '../types/game';

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

interface SocialState {
  friends: Friend[];
  pendingRequests: Friend[];
  isLoading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  sendFriendRequest: (username: string) => Promise<{ error: string | null }>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  challengeFriend: (friendId: string) => Promise<DuelResult | null>;
  clear: () => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  friends: [],
  pendingRequests: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get friendships where I'm the sender (accepted)
      const { data: sent } = await supabase
        .from('friendships')
        .select('id, friend_id, status')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      // Get friendships where I'm the receiver (accepted)
      const { data: received } = await supabase
        .from('friendships')
        .select('id, user_id, status')
        .eq('friend_id', user.id)
        .eq('status', 'accepted');

      // Get pending requests I received
      const { data: pending } = await supabase
        .from('friendships')
        .select('id, user_id, status')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      // Collect friend IDs
      const friendIds = [
        ...(sent ?? []).map((f: any) => f.friend_id),
        ...(received ?? []).map((f: any) => f.user_id),
      ];
      const pendingIds = (pending ?? []).map((f: any) => f.user_id);
      const allIds = [...new Set([...friendIds, ...pendingIds])];

      // Fetch profiles for all
      let profiles: any[] = [];
      if (allIds.length > 0) {
        // Fetch one by one since .in() may not be available in mock
        for (const id of allIds) {
          const { data } = await supabase.from('profiles').select('id, username, level, class').eq('id', id).single();
          if (data) profiles.push(data);
        }
      }

      const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

      const friends: Friend[] = [];
      for (const f of (sent ?? [])) {
        const p = profileMap.get(f.friend_id);
        if (p) friends.push({ friendshipId: f.id, userId: p.id, username: p.username, level: p.level, class: p.class, status: 'accepted' });
      }
      for (const f of (received ?? [])) {
        const p = profileMap.get(f.user_id);
        if (p) friends.push({ friendshipId: f.id, userId: p.id, username: p.username, level: p.level, class: p.class, status: 'accepted' });
      }

      const pendingRequests: Friend[] = [];
      for (const f of (pending ?? [])) {
        const p = profileMap.get(f.user_id);
        if (p) pendingRequests.push({ friendshipId: f.id, userId: p.id, username: p.username, level: p.level, class: p.class, status: 'pending' });
      }

      set({ friends, pendingRequests, isLoading: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to fetch friends', isLoading: false });
    }
  },

  sendFriendRequest: async (username) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'Not authenticated' };

      // Find user by username
      const { data: target } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!target) return { error: 'User not found' };
      if (target.id === user.id) return { error: 'Cannot friend yourself' };

      const { error } = await supabase.from('friendships').insert({
        user_id: user.id,
        friend_id: target.id,
        status: 'pending',
      } as any);

      if (error) return { error: error.message };
      await get().fetchFriends();
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  acceptFriendRequest: async (friendshipId) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    await get().fetchFriends();
  },

  challengeFriend: async (friendId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch both players' stats
      const { data: myStats } = await supabase.from('stats_live').select('*').eq('user_id', user.id).single();
      const { data: theirStats } = await supabase.from('stats_live').select('*').eq('user_id', friendId).single();
      const { data: theirProfile } = await supabase.from('profiles').select('username').eq('id', friendId).single();

      if (!myStats || !theirStats || !theirProfile) return null;

      // Score = sum of all stats + random factor (0-20)
      const myScore = (myStats.str + myStats.con + myStats.sta + myStats.wis + myStats.cha) + Math.floor(Math.random() * 21);
      const theirScore = (theirStats.str + theirStats.con + theirStats.sta + theirStats.wis + theirStats.cha) + Math.floor(Math.random() * 21);
      const winnerId = myScore >= theirScore ? user.id : friendId;

      const { data: duel } = await supabase.from('duels').insert({
        challenger_id: user.id,
        defender_id: friendId,
        challenger_score: myScore,
        defender_score: theirScore,
        winner_id: winnerId,
        resolved_at: new Date().toISOString(),
      } as any).select().single();

      return {
        id: duel?.id ?? '',
        winnerId,
        challengerScore: myScore,
        defenderScore: theirScore,
        opponentUsername: theirProfile.username,
      };
    } catch (e: any) {
      set({ error: e.message });
      return null;
    }
  },

  clear: () => set({ friends: [], pendingRequests: [], isLoading: false, error: null }),
}));
