export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          class: string;
          level: number;
          total_xp: number;
          created_at: string;
          avatar_config: Record<string, string>;
          push_token: string | null;
        };
        Insert: {
          id: string;
          username: string;
          class: string;
          level?: number;
          total_xp?: number;
          avatar_config?: Record<string, string>;
          push_token?: string | null;
        };
        Update: {
          username?: string;
          class?: string;
          level?: number;
          total_xp?: number;
          avatar_config?: Record<string, string>;
          push_token?: string | null;
        };
        Relationships: [];
      };
      stats_live: {
        Row: {
          id: string;
          user_id: string;
          str: number;
          con: number;
          sta: number;
          wis: number;
          cha: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          str?: number;
          con?: number;
          sta?: number;
          wis?: number;
          cha?: number;
        };
        Update: {
          str?: number;
          con?: number;
          sta?: number;
          wis?: number;
          cha?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stats_live_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      quest_definitions: {
        Row: {
          id: string;
          title_plain: string;
          title_rpg: string;
          description: string | null;
          attribute: string;
          base_xp: number;
          priority: string;
          is_campaign: boolean;
          campaign_day: number | null;
          category: string;
        };
        Insert: {
          title_plain: string;
          title_rpg: string;
          description?: string | null;
          attribute: string;
          base_xp?: number;
          priority?: string;
          is_campaign?: boolean;
          campaign_day?: number | null;
          category: string;
        };
        Update: {
          title_plain?: string;
          title_rpg?: string;
          description?: string | null;
          attribute?: string;
          base_xp?: number;
          priority?: string;
          is_campaign?: boolean;
          campaign_day?: number | null;
          category?: string;
        };
        Relationships: [];
      };
      daily_journal: {
        Row: {
          id: string;
          user_id: string;
          quest_def_id: string;
          date: string;
          completed: boolean;
          completed_at: string | null;
          xp_awarded: number;
          value: Record<string, unknown> | null;
        };
        Insert: {
          user_id: string;
          quest_def_id: string;
          date?: string;
          completed?: boolean;
          completed_at?: string | null;
          xp_awarded?: number;
          value?: Record<string, unknown> | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          xp_awarded?: number;
          value?: Record<string, unknown> | null;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_journal_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'daily_journal_quest_def_id_fkey';
            columns: ['quest_def_id'];
            referencedRelation: 'quest_definitions';
            referencedColumns: ['id'];
          },
        ];
      };
      boss_raids: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          boss_name: string;
          boss_max_hp: number;
          damage_dealt: number;
          is_defeated: boolean;
          sleep_bonus: boolean;
          breakdown: Record<string, number>;
          evaluated_at: string | null;
        };
        Insert: {
          user_id: string;
          week_start: string;
          boss_name: string;
          boss_max_hp: number;
          damage_dealt?: number;
          is_defeated?: boolean;
          sleep_bonus?: boolean;
          breakdown?: Record<string, number>;
        };
        Update: {
          damage_dealt?: number;
          is_defeated?: boolean;
          sleep_bonus?: boolean;
          breakdown?: Record<string, number>;
          evaluated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'boss_raids_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      active_debuffs: {
        Row: {
          id: string;
          user_id: string;
          debuff_type: string;
          cause: string;
          applied_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          user_id: string;
          debuff_type: string;
          cause: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          is_active?: boolean;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'active_debuffs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          campaign_name: string;
          started_at: string;
          current_day: number;
          is_complete: boolean;
          completed_days: number;
        };
        Insert: {
          user_id: string;
          campaign_name: string;
          started_at?: string;
          current_day?: number;
          is_complete?: boolean;
          completed_days?: number;
        };
        Update: {
          current_day?: number;
          is_complete?: boolean;
          completed_days?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      loot: {
        Row: {
          id: string;
          user_id: string;
          item_name: string;
          item_type: string;
          rarity: string;
          earned_at: string;
          source: string;
          equipped: boolean;
        };
        Insert: {
          user_id: string;
          item_name: string;
          item_type: string;
          rarity?: string;
          source: string;
          equipped?: boolean;
        };
        Update: {
          equipped?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'loot_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          friend_id: string;
          status?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friendships_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friendships_friend_id_fkey';
            columns: ['friend_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      duels: {
        Row: {
          id: string;
          challenger_id: string;
          defender_id: string;
          winner_id: string | null;
          challenger_score: number;
          defender_score: number;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          challenger_id: string;
          defender_id: string;
          winner_id?: string | null;
          challenger_score?: number;
          defender_score?: number;
        };
        Update: {
          winner_id?: string | null;
          challenger_score?: number;
          defender_score?: number;
          resolved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'duels_challenger_id_fkey';
            columns: ['challenger_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'duels_defender_id_fkey';
            columns: ['defender_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_leaderboard_neighbors: {
        Args: { target_user_id: string; radius?: number };
        Returns: { rank: number; user_id: string; username: string; level: number; total_xp: number; class: string }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
