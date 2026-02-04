"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Coins,
  Leaf,
  Clock,
  User,
  Check,
  Sprout,
  Sun,
  CloudRain,
  Mountain,
  ShieldCheck,
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  origin: string;
  image: string;
  farmer?: {
    name: string;
    avatar: string;
    story: string;
    years: number;
  };
  carbonReduction: number;
  timeline?: {
    stage: string;
    date: string;
    description: string;
    icon: string;
  }[];
}

const mockProduct: Product = {
  id: 1,
  name: "高山有机红薯",
  price: 500,
  category: "有机蔬菜",
  origin: "平谷区镇罗营镇",
  image: "🍠",
  farmer: {
    name: "张大叔",
    avatar: "👨‍🌾",
    story: "坚持传统农耕 20 年",
    years: 20,
  },
  carbonReduction: 0.5,
  timeline: [
    {
      stage: "播种",
      date: "2024-03-15",
      description: "选用优质红薯种子，采用传统穴播方式",
      icon: "🌱",
    },
    {
      stage: "施肥",
      date: "2024-04-01",
      description: "使用农家有机肥，不使用化肥农药",
      icon: "🧱",
    },
    {
      stage: "采摘",
      date: "2024-07-20",
      description: "手工采摘，挑选成熟度最佳的红薯",
      icon: "🧺",
    },
    {
      stage: "质检",
      date: "2024-07-22",
      description: "通过有机认证，农残检测合格",
      icon: "🔬",
    },
    {
      stage: "上架",
      date: "2024-07-25",
      description: "新鲜上架，全程冷链配送",
      icon: "📦",
    },
  ],
};

const activities = [
  { type: "骑行", value: 50, unit: "km", points: 500 },
  { type: "步行", value: 10000, unit: "步", points: 500 },
  { type: "公共交通", value: 10, unit: "次", points: 600 },
];

export default function ProductDetail() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"detail" | "traceability">("detail");

  const handleExchange = () => {
    alert("兑换成功！您已使用 500 绿农币");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">商品详情</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="h-64 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
            <span className="text-8xl">{mockProduct.image}</span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {mockProduct.category}
              </span>
              <h1 className="text-xl font-bold text-gray-900 mt-2">
                {mockProduct.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Mountain className="w-4 h-4 mr-1" />
                {mockProduct.origin}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-eco-green/10 to-emerald-50 rounded-xl border border-eco-green/20">
              <div className="flex items-center space-x-2">
                <Coins className="w-6 h-6 text-earth-brown" />
                <span className="text-2xl font-bold text-earth-brown">
                  {mockProduct.price}
                </span>
                <span className="text-gray-500">绿农币</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">≈ 骑行 50km 奖励</p>
                <p className="text-xs text-eco-green font-medium">
                  相当于流汗换来的 {mockProduct.price} 绿农币
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {activities.map((activity) => (
                <div
                  key={activity.type}
                  className="flex-1 bg-gradient-to-br from-eco-green/5 to-emerald-50 rounded-lg p-3 text-center border border-eco-green/10"
                >
                  <p className="text-xs text-gray-500">{activity.type}</p>
                  <p className="text-sm font-semibold text-eco-green">
                    {activity.value}
                    {activity.unit}
                  </p>
                  <p className="text-xs text-gray-400">
                    = {activity.points} 币
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleExchange}
              className="w-full py-4 bg-gradient-to-r from-eco-green to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
            >
              立即兑换
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("detail")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "detail"
                  ? "text-eco-green border-b-2 border-eco-green bg-eco-green/5"
                  : "text-gray-500"
              }`}
            >
              商品详情
            </button>
            <button
              onClick={() => setActiveTab("traceability")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "traceability"
                  ? "text-eco-green border-b-2 border-eco-green bg-eco-green/5"
                  : "text-gray-500"
              }`}
            >
              溯源档案
            </button>
          </div>

          {activeTab === "detail" && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  商品描述
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  高山有机红薯，种植于海拔800米的平谷山区，昼夜温差大，
                  糖分积累充分。采用传统农耕方式，农家有机肥灌溉，
                  纯天然无污染。红薯口感绵软香甜，富含膳食纤维，
                  是健康饮食的优质选择。
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    低碳农产品
                  </p>
                  <p className="text-xs text-orange-600">
                    支持本地农户，减少运输碳排放
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "traceability" && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  农人故事
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-3xl">
                    {mockProduct.farmer?.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {mockProduct.farmer?.name}
                    </p>
                    <p className="text-sm text-amber-700 font-medium">
                      "{mockProduct.farmer?.story}"
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      深耕有机农业 {mockProduct.farmer?.years} 年
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  生长日记
                </h3>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-eco-green to-emerald-200" />

                  {mockProduct.timeline?.map((item, index) => (
                    <div key={item.stage} className="relative pb-6 last:pb-0">
                      <div className="absolute left-[-21px] top-1 w-10 h-10 bg-white border-2 border-eco-green rounded-full flex items-center justify-center text-lg shadow-sm z-10">
                        {item.icon}
                      </div>
                      <div className="ml-8 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-eco-green">
                            {item.stage}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">
                  所有节点均可溯源，信息真实可查
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-green-100 mb-1">碳标签</p>
              <p className="text-sm font-medium">
                购买此产品支持了 <span className="font-bold">{mockProduct.origin}</span>{" "}
                的绿色农业，相当于减少了{" "}
                <span className="font-bold text-yellow-300">
                  {mockProduct.carbonReduction}kg
                </span>{" "}
                碳排放。
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
