"use client";

import { useState, useEffect } from "react";
import {
  Coins,
  Leaf,
  Footprints,
  Flame,
  Bike,
  TreePine,
  MapPin,
  Trophy,
  Sun,
  Moon,
  Sunrise,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CarbonGamificationCard from "./CarbonGamificationCard";
import { useUserData, useRoutes } from "@/hooks/useUserData";
import { supabase } from "@/lib/supabase";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "早安", icon: Sunrise, suffix: "减碳先锋" };
  if (hour >= 12 && hour < 18) return { text: "午安", icon: Sun, suffix: "环保达人" };
  return { text: "晚安", icon: Moon, suffix: "绿色先锋" };
}

function CircularProgress({
  value,
  max,
  strokeColor,
  size = 80,
  strokeWidth = 8,
  label,
  unit,
}: {
  value: number;
  max: number;
  strokeColor: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-slate-800">{value.toFixed(1)}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

interface DashboardProps {
  userId?: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const { profile, activities, medals, weeklyData, loading, error, refreshActivities } = useUserData(userId);
  const { routes, loading: routesLoading } = useRoutes();
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const todayStats = activities[0];
  const todayCarbonReduction = todayStats?.carbon_saved || 0;
  const todaySteps = todayStats?.steps || 0;
  const todayCalories = todayStats?.calories_burned || 0;
  const userPoints = profile?.points || 0;
  const userName = profile?.username || "用户";
  const userCarbonSaved = profile?.carbon_saved || 0;

  const defaultWeeklyData = [
    { day: "周一", steps: 8500, coins: 120 },
    { day: "周二", steps: 6200, coins: 80 },
    { day: "周三", steps: 9800, coins: 150 },
    { day: "周四", steps: 7500, coins: 100 },
    { day: "周五", steps: 11200, coins: 180 },
    { day: "周六", steps: 15600, coins: 280 },
    { day: "周日", steps: 8900, coins: 140 },
  ];

  const displayWeeklyData = weeklyData.length > 0 ? weeklyData : defaultWeeklyData;

  const displayMedals = medals.length > 0 ? medals : [
    {
      id: 1,
      medal_id: "carbon_pioneer",
      medal_name: "减碳先锋",
      medal_icon: "🏆",
      medal_description: "累计减碳 10kg",
      current_progress: 15.5,
      requirement: 10,
      is_unlocked: true,
    },
    {
      id: 2,
      medal_id: "farmer_ambassador",
      medal_name: "助农大使",
      medal_icon: "🌾",
      medal_description: "兑换 5 次农产品",
      current_progress: 3,
      requirement: 5,
      is_unlocked: false,
    },
    {
      id: 3,
      medal_id: "weekend_hiker",
      medal_name: "周末行者",
      medal_icon: "🚶",
      medal_description: "连续 4 周周末有运动",
      current_progress: 2,
      requirement: 4,
      is_unlocked: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-red-500">
          <p>加载失败，请刷新重试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),_transparent_50%)]" />
        <div className="relative px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-emerald-900/5 flex items-center justify-center text-2xl border border-white/50">
                👤
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {greeting.text}，{userName}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  {greeting.suffix}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-amber-200/50 shadow-lg shadow-amber-500/10">
              <Coins className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-xl font-extrabold text-amber-600">
                {userPoints.toLocaleString()}
              </span>
              <span className="text-xs text-amber-600/70 font-medium">绿农币</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <CircularProgress
              value={todayCarbonReduction}
              max={10}
              strokeColor="#10B981"
              label="减碳"
              unit="kg"
            />
            <CircularProgress
              value={todaySteps}
              max={15000}
              strokeColor="#3B82F6"
              label="步数"
              unit="步"
            />
            <CircularProgress
              value={todayCalories}
              max={600}
              strokeColor="#F97316"
              label="卡路里"
              unit="kcal"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 -mt-2">
        <CarbonGamificationCard initialTotalPoints={userPoints} initialUnclaimedPoints={Math.round(todayCarbonReduction * 10)} />
        
        <section className="space-y-3">
          <h2 className="section-title">精选路线</h2>
          {(routes.length > 0 ? routes.slice(0, 2) : [
            {
              id: 1,
              title: "环湖绿道 x 助农采摘",
              description: "5km 环湖骑行路线，终点可参与有机蔬菜采摘",
              image: "🌾",
              distance: "5km",
              reward_coins: 50,
            },
            {
              id: 2,
              title: "山间步道 x 生态农场",
              description: "3km 山间步道，参观生态农场，了解有机农业",
              image: "🏔️",
              distance: "3km",
              reward_coins: 30,
            },
          ]).map((route: any) => (
            <div
              key={route.id}
              className="card-hover p-4 flex items-center gap-4 cursor-pointer group"
            >
              <div className="text-4xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3">
                {route.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {route.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1">
                  {route.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="tag-slate">{route.distance_km || route.distance}km</span>
                  <span className="tag-gold">+{route.reward_coins || route.reward_coins} 绿农币</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-4">
          <button className="card-hover p-5 flex flex-col items-center justify-center gap-3 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Bike className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">开启骑行</span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>
          <button className="card-hover p-5 flex flex-col items-center justify-center gap-3 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">植树打卡</span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">数据分析</h2>
            <span className="text-xs text-slate-400">最近 7 天</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayWeeklyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar yAxisId="left" dataKey="steps" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="coins"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">勋章墙</h2>
            <span className="text-xs text-slate-400">
              {displayMedals.filter((m) => m.is_unlocked).length}/{displayMedals.length} 已解锁
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {displayMedals.map((medal) => (
              <div
                key={medal.id}
                className={`relative rounded-2xl p-4 text-center transition-all duration-300 ${
                  medal.is_unlocked
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-500/10"
                    : "bg-slate-50 border border-slate-200 opacity-60"
                }`}
              >
                <div className="text-4xl mb-2">{medal.medal_icon}</div>
                <p
                  className={`text-sm font-bold ${
                    medal.is_unlocked ? "text-slate-800" : "text-slate-500"
                  }`}
                >
                  {medal.medal_name}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    medal.is_unlocked ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {medal.medal_description}
                </p>
                {medal.is_unlocked && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
