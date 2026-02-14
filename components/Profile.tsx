"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Leaf,
  Award,
  Package,
  Truck,
  History,
  Calendar,
  MapPin,
  Clock,
  ShoppingBag,
} from "lucide-react";
import BadgeGallery from "./BadgeGallery";
import { getUserInventory, getUserOrders, getUserActivities, getUserProfile, signOut } from "@/lib/supabase";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  green_coins: number;
  total_carbon_saved: number;
  total_calories_burned: number;
  user_title: string;
  email: string | null;
}

interface ProfileProps {
  userId?: string;
}

export default function Profile({ userId }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "activities" | "inventory">("orders");
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (userId) {
        const [profile, inv, ord, act] = await Promise.all([
          getUserProfile(userId),
          getUserInventory(userId),
          getUserOrders(userId),
          getUserActivities(userId)
        ]);
        
        if (profile) setUser(profile);
        setInventory(inv);
        setOrders(ord);
        setActivities(act);
      }
      setLoading(false);
    }
    loadData();
  }, [userId]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      const { error } = await signOut();
      if (error) {
        alert("退出登录失败，请稍后重试");
      } else {
        router.push("/");
      }
    } catch (error) {
      alert("退出登录失败，请稍后重试");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      walking: '步行',
      cycling: '骑行',
      transit: '公交',
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const displayCarbonSaved = user?.total_carbon_saved || 0;
  const displayCoins = user?.green_coins || 0;
  const displayUsername = user?.username || "用户";

  const mockActivities = [
    {
      id: 1,
      activity_type: "cycling",
      distance_km: 5.2,
      duration_seconds: 1500,
      carbon_saved: 1.2,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      activity_type: "walking",
      distance_km: 3.5,
      duration_seconds: 2700,
      carbon_saved: 0.8,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      activity_type: "cycling",
      distance_km: 8.1,
      duration_seconds: 2100,
      carbon_saved: 1.8,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; class: string }> = {
      pending: { text: '待发货', class: 'bg-yellow-100 text-yellow-700' },
      processing: { text: '处理中', class: 'bg-blue-100 text-blue-700' },
      shipped: { text: '待收货', class: 'bg-blue-100 text-blue-700' },
      completed: { text: '已完成', class: 'bg-eco-green/10 text-eco-green' },
      cancelled: { text: '已取消', class: 'bg-gray-100 text-gray-700' },
    };
    return labels[status] || { text: status, class: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-br from-eco-green to-emerald-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border-2 border-white/30">
              {user?.avatar_url || "👤"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{displayUsername}</h1>
              <p className="text-sm text-white/80">碳足迹用户</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-4 space-y-4">
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">碳账户</h2>
            <Leaf className="w-5 h-5 text-eco-green" />
          </div>
          <div className="bg-gradient-to-r from-eco-green/10 to-emerald-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-eco-green mb-1">
                  {displayCarbonSaved.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">累计减碳 (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500 mb-1">
                  {displayCoins}
                </p>
                <p className="text-sm text-gray-600">绿农币</p>
              </div>
            </div>
          </div>

          <BadgeGallery />
        </section>

        <section className="bg-white rounded-2xl p-1 shadow-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-eco-green text-white"
                  : "text-gray-600"
              }`}
            >
              我的订单
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "inventory"
                  ? "bg-eco-green text-white"
                  : "text-gray-600"
              }`}
            >
              我的背包
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "activities"
                  ? "bg-eco-green text-white"
                  : "text-gray-600"
              }`}
            >
              我的足迹
            </button>
          </div>
        </section>

        {activeTab === "orders" && (
          <section className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-center text-gray-500">加载中...</p>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order: any) => {
                const statusInfo = getStatusLabel(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-eco-green/10 to-emerald-50 flex items-center justify-center text-3xl">
                        {order.products?.image_url || "📦"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {order.products?.name || "未知商品"}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full ${statusInfo.class}`}>
                            <Package className="w-3 h-3" />
                            <span>{statusInfo.text}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-center text-gray-500">暂无订单，去兑换一些商品吧！</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "inventory" && (
          <section className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-center text-gray-500">加载中...</p>
              </div>
            ) : inventory.length > 0 ? (
              inventory.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-3xl">
                      {item.products?.image_url || "🎁"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.products?.name || "未知商品"}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center space-x-1 text-xs bg-eco-green/10 text-eco-green px-2 py-0.5 rounded-full">
                          <ShoppingBag className="w-3 h-3" />
                          <span>x{item.quantity}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        兑换时间: {formatDate(item.acquired_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-center text-gray-500">暂无背包物品，去兑换一些商品吧！</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "activities" && (
          <section className="space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-center text-gray-500">加载中...</p>
              </div>
            ) : (
              displayActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {getActivityTypeLabel(activity.activity_type)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-eco-green/10 text-eco-green px-2 py-0.5 rounded-full">
                          {activity.activity_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {(activity.distance_km || 0).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">距离 (km)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {Math.round((activity.duration_seconds || 0) / 60)}
                      </p>
                      <p className="text-xs text-gray-500">时长 (min)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-eco-green">
                        {(activity.carbon_saved || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">减碳 (kg)</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>

      <div className="px-4 pb-24">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all ${
            isLoggingOut
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 active:scale-95"
          }`}
        >
          {isLoggingOut ? "正在退出..." : "退出登录"}
        </button>
      </div>
    </div>
  );
}



