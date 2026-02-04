"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, MapPin, Clock, Leaf, Footprints, Bike, Bus } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

const EcoMap = dynamic(() => import("./EcoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm text-gray-500">地图加载中...</p>
      </div>
    </div>
  ),
});

const mockData = {
  distance: 0,
  duration: 0,
  carbonReduction: 0,
  mode: "walking" as "walking" | "cycling" | "transit",
};

export default function ActivityTracker() {
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState(mockData);
  const [mode, setMode] = useState<"walking" | "cycling" | "transit">("walking");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setData((prev) => ({
          ...prev,
          distance: prev.distance + 0.01,
          duration: prev.duration + 1,
          carbonReduction: prev.carbonReduction + 0.5,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleArrive = (village: any) => {
    console.log("到达驿站:", village);
  };

  const modeConfig = {
    walking: { icon: Footprints, label: "步行", color: "text-blue-600" },
    cycling: { icon: Bike, label: "骑行", color: "text-green-600" },
    transit: { icon: Bus, label: "公共交通", color: "text-purple-600" },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">运动记录</h1>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            地图模式
          </span>
        </div>
      </header>

      <div className="relative w-full h-72">
        <EcoMap onArrive={handleArrive} />

        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg z-[400]">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data.distance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">距离 (km)</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-gray-500 mr-1" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(data.duration / 60)}:{String(data.duration % 60).padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500">时长 (min)</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Leaf className="w-4 h-4 text-green-500 mr-1" />
              </div>
              <p className="text-2xl font-bold text-green-500">
                {data.carbonReduction.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">减碳 (g)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 mb-3">运动模式</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(modeConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = mode === key;
              return (
                <button
                  key={key}
                  onClick={() => setMode(key as typeof mode)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 ${
                      isSelected ? config.color : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-center">
          <button
            onClick={handleStart}
            className={`w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isActive ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {isActive
              ? "正在记录运动数据..."
              : "点击开始记录您的低碳出行"}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2">探索乡村地图</h3>
          <p className="text-xs text-green-600">
            点击地图上的标记查看驿站和打卡点，模拟到达可触发低碳打卡！
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
