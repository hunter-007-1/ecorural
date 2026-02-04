"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Coins, Leaf, Flame, User } from "lucide-react";
import supabase from "@/lib/supabase";
import CarbonGamificationCard from "@/components/CarbonGamificationCard";

const EcoMap = dynamic(() => import("@/components/EcoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-slate-500">加载中...</p>
      </div>
    </div>
  ),
});

interface UserProfile {
  id: string;
  email: string;
  username: string;
  points: number;
  carbon_saved: number;
  total_calories: number;
  user_title: string;
  avatar_url: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      }

      if (profile) {
        setUser(profile);
      } else {
        setShowLoginPrompt(true);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setShowLoginPrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/5 border border-white/50 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <User className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              欢迎加入乡健碳行
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              登录后查看您的绿农币余额和减碳记录
            </p>
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 transition-all"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100" />

        <div className="relative px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-emerald-900/5 flex items-center justify-center text-2xl border border-white/50">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <User className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500">你好，{user?.username || "用户"}</p>
                <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {user?.user_title || "绿芽"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 backdrop-blur-xl px-4 py-2 rounded-2xl border border-amber-200/50 shadow-lg shadow-amber-500/10">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="text-xl font-extrabold text-amber-600">
                {user?.points?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-amber-600/70">绿农币</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg shadow-emerald-900/5">
              <Leaf className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {user?.carbon_saved?.toFixed(1) || "0.0"}
              </p>
              <p className="text-xs text-slate-500">累计减碳 (kg)</p>
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg shadow-emerald-900/5">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {user?.total_calories?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-slate-500">消耗卡路里</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 -mt-2">
        <CarbonGamificationCard
          initialTotalPoints={user?.points || 0}
          initialUnclaimedPoints={50}
        />

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">今日数据</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center py-2">
              <p className="text-xl font-bold text-emerald-600">2.5</p>
              <p className="text-xs text-slate-500">减碳 (kg)</p>
            </div>
            <div className="text-center py-2">
              <p className="text-xl font-bold text-blue-600">8,520</p>
              <p className="text-xs text-slate-500">步数</p>
            </div>
            <div className="text-center py-2">
              <p className="text-xl font-bold text-orange-600">320</p>
              <p className="text-xs text-slate-500">千卡</p>
            </div>
          </div>
        </div>

        <div className="h-48 rounded-2xl overflow-hidden shadow-sm">
          <EcoMap onArrive={() => {}} />
        </div>
      </main>
    </div>
  );
}
