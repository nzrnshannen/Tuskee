import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [gameStats, setGameStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error('Supabase getSession error:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setGameStats({});
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    setProfile(profileData || {});

    // Fetch game stats
    const { data: statsData } = await supabase
      .from('game_stats')
      .select('*')
      .eq('id', userId)
      .single();

    setGameStats(statsData?.stats || {});
    setLoading(false);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    // Upsert to Supabase
    await supabase.from('profiles').upsert({
      id: user.id,
      ...updates
    });
  };

  const updateGameStats = async (updates) => {
    if (!user) return;
    const newStats = { ...gameStats, ...updates };
    setGameStats(newStats);

    // Upsert to Supabase
    await supabase.from('game_stats').upsert({
      id: user.id,
      stats: newStats
    });
  };

  const value = {
    session,
    user,
    profile,
    gameStats,
    updateProfile,
    updateGameStats,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
