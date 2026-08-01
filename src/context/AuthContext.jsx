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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        // Local storage purge is handled by logout() or manually if signed out from another tab
        localStorage.removeItem('tuskee_records');
        localStorage.removeItem('tuskee_goals');
        localStorage.removeItem('tuskee_bg_pattern');
        setProfile(null);
        setGameStats({});
        setLoading(false);
      } else if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setGameStats({});
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async (reason = null) => {
    // Purge local storage caches
    localStorage.removeItem('tuskee_records');
    localStorage.removeItem('tuskee_goals');
    localStorage.removeItem('tuskee_bg_pattern');

    // Sign out from Supabase
    await supabase.auth.signOut();

    if (reason === 'session_expired') {
      window.dispatchEvent(new CustomEvent('session_expired'));
    }
  };

  const checkErrorAndLogout = (error) => {
    if (error && (error.code === 'PGRST301' || error.status === 401 || error.message?.includes('JWT'))) {
      logout('session_expired');
      return true;
    }
    return false;
  };

  const fetchUserData = async (userId) => {
    // Fetch profile
    const { data: profileData, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkErrorAndLogout(pError)) return;
    
    setProfile(profileData || {});

    // Fetch game stats
    const { data: statsData, error: sError } = await supabase
      .from('game_stats')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkErrorAndLogout(sError)) return;

    setGameStats(statsData?.stats || {});
    setLoading(false);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    // Upsert to Supabase
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...updates
    });
    checkErrorAndLogout(error);
  };

  const updateGameStats = async (updates) => {
    if (!user) return;
    const newStats = { ...gameStats, ...updates };
    setGameStats(newStats);

    // Upsert to Supabase
    const { error } = await supabase.from('game_stats').upsert({
      id: user.id,
      stats: newStats
    });
    checkErrorAndLogout(error);
  };

  const value = {
    session,
    user,
    profile,
    gameStats,
    updateProfile,
    updateGameStats,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
