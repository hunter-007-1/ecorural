"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { getUserProfile } from "@/lib/supabase";
import supabase from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  green_coins: number;
  total_carbon_saved: number;
  user_title: string;
  avatar_url: string;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(session.user.id);

      if (profile) {
        setUser(profile as UserProfile);
      }
    } catch (err) {
      console.error("Auth check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePointsUpdate = (newPoints: number) => {
    if (user) {
      setUser({ ...user, green_coins: newPoints });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">助农市集</h1>
          {user && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full">
              <span className="text-amber-600 font-medium">{user.green_coins}</span>
              <span className="text-xs text-amber-500">积分</span>
            </div>
          )}
        </div>
      </header>
      <main className="p-4">
        <Marketplace 
          userId={user?.id}
          initialPoints={user?.green_coins || 0}
          onPointsUpdate={handlePointsUpdate}
        />
      </main>
    </div>
  );
}
