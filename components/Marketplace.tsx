"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Coins, MapPin, Sparkles, ArrowRight } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

const mockProducts = [
  {
    id: 1,
    name: "高山有机红薯",
    price: 500,
    category: "有机蔬菜",
    origin: "平谷区镇罗营镇",
    image: "🍠",
    tag: "助农·滞销帮扶",
    sold: 234,
  },
  {
    id: 2,
    name: "新鲜有机白菜",
    price: 300,
    category: "有机蔬菜",
    origin: "密云区",
    image: "🥬",
    tag: "有机认证",
    sold: 189,
  },
  {
    id: 3,
    name: "有机苹果",
    price: 800,
    category: "时令水果",
    origin: "延庆区",
    image: "🍎",
    tag: "自然熟",
    sold: 156,
  },
  {
    id: 4,
    name: "有机草莓",
    price: 1200,
    category: "时令水果",
    origin: "昌平区",
    image: "🍓",
    tag: "当季限定",
    sold: 89,
  },
  {
    id: 5,
    name: "乡村民宿体验券",
    price: 2000,
    category: "乡村民宿",
    origin: "怀柔区",
    image: "🏡",
    tag: "周末度假",
    sold: 45,
  },
  {
    id: 6,
    name: "手工编织篮",
    price: 600,
    category: "手工艺品",
    origin: "门头沟区",
    image: "🧺",
    tag: "非遗传承",
    sold: 67,
  },
  {
    id: 7,
    name: "有机胡萝卜",
    price: 400,
    category: "有机蔬菜",
    origin: "顺义区",
    image: "🥕",
    tag: "新鲜直达",
    sold: 112,
  },
  {
    id: 8,
    name: "有机橙子",
    price: 900,
    category: "时令水果",
    origin: "大兴区",
    image: "🍊",
    tag: "爆汁甜蜜",
    sold: 78,
  },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const router = useRouter();

  const filteredProducts =
    selectedCategory === "全部"
      ? mockProducts
      : mockProducts.filter((p) => p.category === selectedCategory);

  const handleProductClick = (productId: number) => {
    router.push(`/product`);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40">
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                积分集市
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                用汗水换取新鲜农产品
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-full border border-amber-200/50">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">2,580</span>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md px-4 py-3 border-b border-slate-200/50">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm shadow-slate-200/50 border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <div
                  className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110"
                >
                  {product.image}
                </div>
                <div className="absolute top-2 left-2 z-20">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 z-20">
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white/90">
                    已售 {product.sold}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{product.origin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    <span className="text-lg font-extrabold text-emerald-600">
                      {product.price}
                    </span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 rounded-3xl border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">今日特惠</h3>
              <p className="text-sm text-slate-600 mt-1">
                购买有机蔬菜，满500绿农币减50！
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
