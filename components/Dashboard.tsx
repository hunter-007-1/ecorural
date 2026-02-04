"use client";

import { useState } from "react";
import {
  Coins,
  Leaf,
  Footprints,
  Flame,
  Bike,
  TreePine,
  MapPin,
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
import BottomNavigation from "./BottomNavigation";

const weeklyData = [
  { day: "周一", steps: 8500, coins: 120 },
  { day: "周二", steps: 6200, coins: 80 },
  { day: "周三", steps: 9800, coins: 150 },
  { day: "周四", steps: 7500, coins: 100 },
  { day: "周五", steps: 11200, coins: 180 },
  { day: "周六", steps: 15600, coins: 280 },
  { day: "周日", steps: 8900, coins: 140 },
];

const medals = [
  {
    id: 1,
    name: "减碳先锋",
    icon: "🏆",
    description: "累计减碳 10kg",
    requirement: 10,
    current: 15.5,
    unlocked: true,
  },
  {
    id: 2,
    name: "助农大使",
    icon: "🌾",
    description: "兑换 5 次农产品",
    requirement: 5,
    current: 3,
    unlocked: false,
  },
  {
    id: 3,
    name: "周末行者",
    icon: "🚶",
    description: "连续 4 周周末有运动",
    requirement: 4,
    current: 2,
    unlocked: false,
  },
];

const mockData = {
  user: {
    name: "张三",
    avatar: "👤",
    coins: 2580,
  },
  today: {
    carbonReduction: 2.5,
    steps: 8520,
    calories: 320,
  },
  recommendations: [
    {
      id: 1,
      title: "环湖绿道 x 助农采摘",
      description: "5km 环湖骑行路线，终点可参与有机蔬菜采摘",
      image: "🌾",
      distance: "5km",
      reward: "+50 绿农币",
    },
    {
      id: 2,
      title: "山间步道 x 生态农场",
      description: "3km 山间步道，参观生态农场，了解有机农业",
      image: "🏔️",
      distance: "3km",
      reward: "+30 绿农币",
    },
  ],
};

export default function Dashboard() {
  const [data] = useState(mockData);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-eco-green/20 flex items-center justify-center text-xl">
              {data.user.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{data.user.name}</p>
              <p className="text-xs text-gray-500">欢迎回来</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-eco-green/10 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-eco-green" />
            <span className="text-sm font-semibold text-eco-green">
              {data.user.coins.toLocaleString()}
            </span>
            <span className="text-xs text-eco-green">绿农币</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">今日数据</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-eco-green/5 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-eco-green/20 flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-eco-green" />
              </div>
              <p className="text-2xl font-bold text-eco-green">{data.today.carbonReduction}</p>
              <p className="text-xs text-gray-600 mt-1">减碳 (kg)</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Footprints className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {(data.today.steps / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-600 mt-1">步数</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{data.today.calories}</p>
              <p className="text-xs text-gray-600 mt-1">卡路里</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">数据分析</h2>
            <span className="text-xs text-gray-500">最近 7 天</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#666" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: "#3b82f6" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  label={{
                    value: "步数",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#3b82f6", fontSize: 12 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: "#22c55e" }}
                  axisLine={{ stroke: "#e0e0e0" }}
                  label={{
                    value: "绿农币",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#22c55e", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "16px" }}
                  formatter={(value) => (
                    <span style={{ color: "#666", fontSize: 12 }}>
                      {value === "steps" ? "每日步数" : "获得绿农币"}
                    </span>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="steps"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="steps"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="coins"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#16a34a" }}
                  name="coins"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 text-center">
              📈 运动越多，赚得越多！继续保持，你的努力都会被看见
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">勋章墙</h2>
            <span className="text-xs text-gray-500">
              {medals.filter((m) => m.unlocked).length}/{medals.length} 已解锁
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {medals.map((medal) => (
              <div
                key={medal.id}
                className={`relative rounded-xl p-4 text-center transition-all ${
                  medal.unlocked
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                    : "bg-gray-100 border border-gray-200 grayscale opacity-60"
                }`}
              >
                <div
                  className={`text-4xl mb-2 ${
                    medal.unlocked ? "" : "filter grayscale"
                  }`}
                >
                  {medal.icon}
                </div>
                <p
                  className={`text-sm font-semibold ${
                    medal.unlocked ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {medal.name}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    medal.unlocked ? "text-amber-600" : "text-gray-400"
                  }`}
                >
                  {medal.description}
                </p>
                {medal.unlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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
                {!medal.unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gray-400 h-1.5 rounded-full"
                        style={{
                          width: `${(medal.current / medal.requirement) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {medal.current}/{medal.requirement}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-br from-eco-green to-emerald-600 text-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
            <Bike className="w-8 h-8" />
            <span className="font-semibold">开启低碳骑行</span>
          </button>
          <button className="bg-gradient-to-br from-earth-brown to-amber-600 text-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
            <TreePine className="w-8 h-8" />
            <span className="font-semibold">上传植树打卡</span>
          </button>
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">今日低碳助农路线推荐</h2>
          <div className="space-y-3">
            {data.recommendations.map((route) => (
              <div
                key={route.id}
                className="bg-gradient-to-r from-eco-green/10 to-emerald-50 rounded-xl p-4 border border-eco-green/20"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-4xl">{route.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{route.title}</h3>
                      <span className="text-xs bg-eco-green text-white px-2 py-0.5 rounded-full">
                        {route.reward}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{route.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
