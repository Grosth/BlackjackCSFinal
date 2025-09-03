import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/game';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          id: profile.id,
          email: '', // We don't store email in profiles
          username: profile.username,
          chips: profile.chips,
          wins: profile.wins,
          losses: profile.losses,
          ties: profile.ties,
          created_at: profile.created_at
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Error al cargar el perfil');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          chips: updatedUser.chips,
          wins: updatedUser.wins,
          losses: updatedUser.losses,
          ties: updatedUser.ties
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      setUser(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error al actualizar datos');
    }
  };

  const saveGameRecord = async (betAmount: number, result: 'win' | 'loss' | 'tie', playerScore: number, dealerScore: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('game_records')
        .insert({
          user_id: user.id,
          bet_amount: betAmount,
          result,
          player_score: playerScore,
          dealer_score: dealerScore
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving game record:', err);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    saveGameRecord
  };
};