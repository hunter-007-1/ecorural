import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  username: string | null;
  points: number;
  carbon_saved: number;
  email: string | null;
}

export interface UserActivity {
  id: bigint;
  user_id: string;
  activity_type: string;
  steps: number;
  distance_km: number;
  carbon_saved: number;
  calories_burned: number;
  duration_seconds: number;
  created_at: string;
}

export interface UserMedal {
  id: bigint;
  user_id: string;
  medal_id: string;
  medal_name: string;
  medal_icon: string;
  medal_description: string;
  current_progress: number;
  requirement: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
}

export interface DailyStat {
  id: bigint;
  user_id: string;
  stats_date: string;
  total_steps: number;
  total_carbon_saved: number;
  total_calories_burned: number;
  total_coins_earned: number;
}

export interface WeeklyData {
  day: string;
  steps: number;
  coins: number;
}

interface UseUserDataReturn {
  profile: UserProfile | null;
  activities: UserActivity[];
  medals: UserMedal[];
  dailyStats: DailyStat | null;
  weeklyData: WeeklyData[];
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshMedals: () => Promise<void>;
}

export function useUserData(userId: string | undefined): UseUserDataReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [medals, setMedals] = useState<UserMedal[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  }, [userId]);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setActivities(data || []);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
    }
  }, [userId]);

  const fetchMedals = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('user_medals')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setMedals(data || []);
    } catch (err: any) {
      console.error('Error fetching medals:', err);
    }
  }, [userId]);

  const fetchDailyStats = useCallback(async () => {
    if (!userId) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('stats_date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setDailyStats(data);
    } catch (err: any) {
      console.error('Error fetching daily stats:', err);
    }
  }, [userId]);

  const generateWeeklyData = useCallback((activities: UserActivity[]) => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const today = new Date();
    const result: WeeklyData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(
        (a) => a.created_at?.startsWith(dateStr)
      );
      
      const totalSteps = dayActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
      const totalCoins = dayActivities.reduce(
        (sum, a) => sum + Math.round((a.carbon_saved || 0) * 10),
        0
      );

      result.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        steps: totalSteps,
        coins: totalCoins,
      });
    }

    setWeeklyData(result);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const refreshActivities = useCallback(async () => {
    await fetchActivities();
  }, [fetchActivities]);

  const refreshMedals = useCallback(async () => {
    await fetchMedals();
  }, [fetchMedals]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchProfile(),
        fetchActivities(),
        fetchMedals(),
        fetchDailyStats(),
      ]);
      
      setLoading(false);
    };

    fetchAll();
  }, [userId, fetchProfile, fetchActivities, fetchMedals, fetchDailyStats]);

  useEffect(() => {
    if (activities.length > 0) {
      generateWeeklyData(activities);
    }
  }, [activities, generateWeeklyData]);

  return {
    profile,
    activities,
    medals,
    dailyStats,
    weeklyData,
    loading,
    error,
    refreshProfile,
    refreshActivities,
    refreshMedals,
  };
}

export function useRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: true });
        
        if (error) throw error;
        setRoutes(data || []);
      } catch (err: any) {
        console.error('Error fetching routes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, loading, error };
}

export function useCompletedRoutes(userId: string | undefined) {
  const [completedRoutes, setCompletedRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCompleted = async () => {
      try {
        const { data, error } = await supabase
          .from('user_routes')
          .select('*, routes(*)')
          .eq('user_id', userId);
        
        if (error) throw error;
        setCompletedRoutes(data || []);
      } catch (err) {
        console.error('Error fetching completed routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [userId]);

  return { completedRoutes, loading };
}
