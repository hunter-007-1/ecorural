"use client";

import { useState } from "react";
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
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";

// Mock Data
const mockData = {
  user: {
    name: "张三",
    avatar: "👤",
    totalCarbonReduction: 125.8,
  },
  badges: [
    { id: 1, name: "减碳先锋", icon: "🏆", description: "累计减碳超过100kg" },
    { id: 2, name: "绿色出行", icon: "🌱", description: "连续7天低碳出行" },
    { id: 3, name: "助农达人", icon: "🌾", description: "兑换农产品超过10次" },
  ],
  orders: [
    {
      id: 1,
      product: "高山有机红薯",
      status: "待发货",
      date: "2024-03-15",
      image: "🍠",
    },
    {
      id: 2,
      product: "有机苹果",
      status: "待收货",
      date: "2024-03-12",
      image: "🍎",
    },
    {
      id: 3,
      product: "新鲜有机白菜",
      status: "已完成",
      date: "2024-03-10",
      image: "🥬",
    },
  ],
  activities: [
    {
      id: 1,
      type: "骑行",
      distance: 5.2,
      duration: 25,
      carbonReduction: 1.2,
      date: "2024-03-15",
      route: "环湖绿道",
    },
    {
      id: 2,
      type: "步行",
      distance: 3.5,
      duration: 45,
      carbonReduction: 0.8,
      date: "2024-03-14",
      route: "山间步道",
    },
    {
      id: 3,
      type: "骑行",
      distance: 8.1,
      duration: 35,
      carbonReduction: 1.8,
      date: "2024-03-13",
      route: "乡村公路",
    },
  ],
};

export default function Profile() {
  const [data] = useState(mockData);
  const [activeTab, setActiveTab] = useState<"orders" | "activities">("orders");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-eco-green to-emerald-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border-2 border-white/30">
              {data.user.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold">{data.user.name}</h1>
              <p className="text-sm text-white/80">碳足迹用户</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-4 space-y-4">
        {/* 碳账户卡片 */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">碳账户</h2>
            <Leaf className="w-5 h-5 text-eco-green" />
          </div>
          <div className="bg-gradient-to-r from-eco-green/10 to-emerald-50 rounded-xl p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-eco-green mb-1">
                {data.user.totalCarbonReduction}
              </p>
              <p className="text-sm text-gray-600">累计减碳总量 (kg)</p>
            </div>
          </div>

          {/* 环保勋章 */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">环保勋章</h3>
            <div className="grid grid-cols-3 gap-2">
              {data.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-earth-brown/10 to-amber-50 rounded-xl p-3 text-center border border-earth-brown/20"
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-semibold text-gray-900">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 标签切换 */}
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

        {/* 我的订单 */}
        {activeTab === "orders" && (
          <section className="space-y-3">
            {data.orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-eco-green/10 to-emerald-50 flex items-center justify-center text-3xl">
                    {order.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{order.product}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {order.status === "待发货" && (
                        <span className="inline-flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          <Package className="w-3 h-3" />
                          <span>{order.status}</span>
                        </span>
                      )}
                      {order.status === "待收货" && (
                        <span className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          <Truck className="w-3 h-3" />
                          <span>{order.status}</span>
                        </span>
                      )}
                      {order.status === "已完成" && (
                        <span className="inline-flex items-center space-x-1 text-xs bg-eco-green/10 text-eco-green px-2 py-0.5 rounded-full">
                          <Award className="w-3 h-3" />
                          <span>{order.status}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 我的足迹 */}
        {activeTab === "activities" && (
          <section className="space-y-3">
            {data.activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{activity.route}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-eco-green/10 text-eco-green px-2 py-0.5 rounded-full">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{activity.distance}</p>
                    <p className="text-xs text-gray-500">距离 (km)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{activity.duration}</p>
                    <p className="text-xs text-gray-500">时长 (min)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-eco-green">
                      {activity.carbonReduction}
                    </p>
                    <p className="text-xs text-gray-500">减碳 (kg)</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}



