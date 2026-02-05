"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Clock, Leaf, Footprints, Bike, Bus } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import MetricsTranslator from "./MetricsTranslator";
import { logActivity } from "@/lib/supabase";

const EcoMap = dynamic(() => import("./EcoMap"), {
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

const mockData = {
  distance: 0,
  duration: 0,
  carbonReduction: 0,
  caloriesBurned: 0,
};

interface ActivityTrackerProps {
  userId?: string;
}

export default function ActivityTracker({ userId }: ActivityTrackerProps) {
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState(mockData);
  const [mode, setMode] = useState<"walking" | "cycling" | "transit">("walking");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setData((prev) => ({
          ...prev,
          distance: prev.distance + 0.01,
          duration: prev.duration + 1,
          carbonReduction: prev.carbonReduction + 0.5,
          caloriesBurned: prev.caloriesBurned + 3,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStart = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (data.distance === 0 || data.duration === 0) {
      showToast('请先开始记录运动', 'error');
      return;
    }

    if (!userId) {
      showToast('请先登录', 'error');
      return;
    }

    setSaving(true);
    const result = await logActivity(userId, Math.round(data.distance * 1000), data.carbonReduction / 1000, mode);
    setSaving(false);

    if (result.success) {
      showToast(`已保存！减碳 ${data.carbonReduction.toFixed(1)}g`, 'success');
      setData(mockData);
    } else {
      showToast(result.error || '保存失败', 'error');
    }
  };

  const modeConfig = {
    walking: { icon: Footprints, label: "步行", color: "text-blue-600" },
    cycling: { icon: Bike, label: "骑行", color: "text-emerald-600" },
    transit: { icon: Bus, label: "公交", color: "text-purple-600" },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40 px-4 py-3">
        <h1 className="text-lg font-bold text-slate-800">运动记录</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center py-2">
              <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{formatTime(data.duration)}</p>
              <p className="text-xs text-slate-500">时长</p>
            </div>
            <div className="text-center py-2">
              <p className="text-xl font-bold text-slate-800">{data.distance.toFixed(2)}</p>
              <p className="text-xs text-slate-500">km</p>
            </div>
            <div className="text-center py-2">
              <Leaf className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-600">{data.carbonReduction.toFixed(0)}g</p>
              <p className="text-xs text-slate-500">减碳</p>
            </div>
          </div>
        </div>

        <div className="h-48 rounded-2xl overflow-hidden shadow-sm">
          <EcoMap onArrive={() => {}} />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isActive
                ? "bg-gradient-to-br from-red-400 to-red-500 shadow-lg"
                : "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg hover:shadow-emerald-500/30"
            }`}
          >
            {isActive ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (data.distance === 0 && data.duration === 0)}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {saving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Leaf className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          {isActive ? "正在记录..." : saving ? "保存中..." : "点击开始或打卡"}
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="section-title mb-3">运动模式</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(modeConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = mode === key;
              return (
                <button
                  key={key}
                  onClick={() => setMode(key as typeof mode)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? config.color : "text-slate-400"}`} />
                  <span className={`text-xs font-medium ${isSelected ? config.color : "text-slate-500"}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <MetricsTranslator calories={Math.round(data.caloriesBurned * 10)} carbon={data.carbonReduction / 1000} />

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
          <p className="text-sm text-slate-600">
            点击地图上的标记可查看驿站和打卡点
          </p>
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 ${
          toast.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
