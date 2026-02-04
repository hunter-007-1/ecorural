"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coins, Leaf, Flame, User, ShoppingBag } from "lucide-react";
import supabase from "@/lib/supabase";
import CarbonGamificationCard from "@/components/CarbonGamificationCard";
import Marketplace from "@/components/Marketplace";
import FarmerStorySection from "@/components/FarmerStorySection";
import ActivityTracker from "@/components/ActivityTracker";
import BottomNavigation from "@/components/BottomNavigation";

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
  const [showExchangePopup, setShowExchangePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    price: number;
    image: string;
  } | null>(null);

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

  const handleProductClick = (product: { id: number; name: string; price: number; image: string }) => {
    setSelectedProduct({
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setShowExchangePopup(true);
  };

  const handleExchangeConfirm = () => {
    if (selectedProduct && user && user.points >= selectedProduct.price) {
      alert(`兑换成功！\n\n您已使用 ${selectedProduct.price} 绿农币兑换了 ${selectedProduct.name}\n\n（此为演示版本，实际兑换功能开发中）`);
    } else if (selectedProduct) {
      alert(`绿农币不足！\n\n需要 ${selectedProduct.price} 绿农币，您当前有 ${user?.points || 0} 绿农币\n\n请多运动赚取积分！`);
    }
    setShowExchangePopup(false);
    setSelectedProduct(null);
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
            <h1 className="text-xl font-bold text-slate-800 mb-2">欢迎加入乡健碳行</h1>
            <p className="text-slate-500 text-sm mb-6">登录后查看您的绿农币余额和减碳记录</p>
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
    <div className="min-h-screen bg-slate-50">
      {/* 顶部用户信息 */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg shadow-emerald-900/5">
              <Leaf className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{user?.carbon_saved?.toFixed(1) || "0.0"}</p>
              <p className="text-xs text-slate-500">累计减碳 (kg)</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/50 shadow-lg shadow-emerald-900/5">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{user?.total_calories?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-500">消耗卡路里</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 -mt-2">
        {/* 碳树养成卡片 */}
        <section>
          <CarbonGamificationCard
            initialTotalPoints={user?.points || 0}
            initialUnclaimedPoints={50}
          />
        </section>

        {/* 助农市集 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">助农市集</h2>
            <span className="text-xs text-slate-400 ml-auto">用积分换好物</span>
          </div>
          <Marketplace onProductClick={handleProductClick} />
        </section>

        {/* 农户故事 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">农户故事</h2>
          <FarmerStorySection />
        </section>

        {/* 活动追踪 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">运动记录</h2>
          <ActivityTracker />
        </section>
      </main>

      <BottomNavigation />

      {/* 兑换弹窗 */}
      {showExchangePopup && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6 text-center border-b border-slate-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-5xl">
                {selectedProduct.image}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-500 mt-1">确认使用 {selectedProduct.price} 绿农币兑换？</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExchangePopup(false)}
                className="py-3 px-4 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleExchangeConfirm}
                className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
              >
                确认兑换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
