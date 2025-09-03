import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          chips: number;
          wins: number;
          losses: number;
          ties: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          chips?: number;
          wins?: number;
          losses?: number;
          ties?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          chips?: number;
          wins?: number;
          losses?: number;
          ties?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      game_records: {
        Row: {
          id: string;
          user_id: string;
          bet_amount: number;
          result: 'win' | 'loss' | 'tie';
          player_score: number;
          dealer_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bet_amount: number;
          result: 'win' | 'loss' | 'tie';
          player_score: number;
          dealer_score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bet_amount?: number;
          result?: 'win' | 'loss' | 'tie';
          player_score?: number;
          dealer_score?: number;
          created_at?: string;
        };
      };
    };
  };
};