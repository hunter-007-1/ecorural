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
import FarmerStorySection from "./FarmerStorySection";

interface Product {
  id: number;
  name: string;
  price: number;
  price_in_yuan?: number;
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
  price_in_yuan: 5,
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
  const [purchaseMode, setPurchaseMode] = useState<'coins' | 'cash'>('coins');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const yuanPrice = mockProduct.price_in_yuan || mockProduct.price / 100;
  const farmerRevenue = yuanPrice * 0.7;
  const platformRevenue = yuanPrice * 0.3;

  const handleExchange = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPurchase = () => {
    setIsPurchasing(true);
    // 本地模拟购买成功
    setTimeout(() => {
      setIsPurchasing(false);
      setShowConfirmModal(false);
      if (purchaseMode === 'coins') {
        alert(`兑换成功！您已使用 ${mockProduct.price} 积分`);
      } else {
        alert(`购买成功！农民获得 ¥${farmerRevenue.toFixed(2)} 收益`);
      }
    }, 500);
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
                {purchaseMode === 'coins' ? (
                  <>
                    <span className="text-2xl font-bold text-earth-brown">
                      {mockProduct.price}
                    </span>
                    <span className="text-gray-500">积分</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-green-600">
                      ¥{yuanPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-500">/现金</span>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {purchaseMode === 'coins' ? `≈ 骑行 50km 奖励` : '直接购买'}
                </p>
                <p className="text-xs text-eco-green font-medium">
                  {purchaseMode === 'coins' 
                    ? `相当于流汗换来的 ${mockProduct.price} 积分`
                    : `农民可得 ¥${farmerRevenue.toFixed(2)} (70%)`
                  }
                </p>
              </div>
            </div>

            <div className="flex bg-slate-100 rounded-full p-1 mb-4">
              <button
                onClick={() => setPurchaseMode('coins')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  purchaseMode === 'coins'
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow"
                    : "text-slate-600"
                }`}
              >
                积分兑换
              </button>
              <button
                onClick={() => setPurchaseMode('cash')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  purchaseMode === 'cash'
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow"
                    : "text-slate-600"
                }`}
              >
                现金购买
              </button>
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
              className={`w-full py-4 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform active:scale-95 transition-all ${
                purchaseMode === 'coins'
                  ? "bg-gradient-to-r from-eco-green to-emerald-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-600"
              }`}
            >
              {purchaseMode === 'coins' ? '立即兑换' : '立即购买'}
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
            <div className="p-4">
              <FarmerStorySection />
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

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {purchaseMode === 'coins' ? '确认兑换' : '确认购买'}
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center text-2xl">
                  {mockProduct.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{mockProduct.name}</p>
                  <p className="text-sm text-gray-500">{mockProduct.origin}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                {purchaseMode === 'coins' ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">兑换积分</span>
                    <span className="font-bold text-amber-600">{mockProduct.price} 积分</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">商品价格</span>
                      <span className="font-medium">¥{yuanPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">农民可得 (70%)</span>
                      <span className="font-medium text-green-600">¥{farmerRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">平台收益 (30%)</span>
                      <span className="font-medium text-amber-600">¥{platformRevenue.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {purchaseMode === 'cash' && (
              <p className="text-xs text-gray-500 mb-4 text-center">
                您的购买将直接帮助农民增收，支持低碳农业发展
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={isPurchasing}
                className={`flex-1 py-3 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 ${
                  purchaseMode === 'coins'
                    ? "bg-gradient-to-r from-eco-green to-emerald-600 shadow-emerald-500/25"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25"
                }`}
              >
                {isPurchasing ? '处理中...' : purchaseMode === 'coins' ? '确认兑换' : '确认购买'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
