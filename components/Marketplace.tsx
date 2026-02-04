"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Coins, MapPin } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

// Mock Data
const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

const mockProducts = [
  {
    id: 1,
    name: "高山有机红薯",
    price: 500,
    category: "有机蔬菜",
    origin: "xx村直供",
    image: "🍠",
  },
  {
    id: 2,
    name: "新鲜有机白菜",
    price: 300,
    category: "有机蔬菜",
    origin: "xx村直供",
    image: "🥬",
  },
  {
    id: 3,
    name: "有机苹果",
    price: 800,
    category: "时令水果",
    origin: "xx村直供",
    image: "🍎",
  },
  {
    id: 4,
    name: "有机草莓",
    price: 1200,
    category: "时令水果",
    origin: "xx村直供",
    image: "🍓",
  },
  {
    id: 5,
    name: "乡村民宿体验券",
    price: 2000,
    category: "乡村民宿",
    origin: "xx村直供",
    image: "🏡",
  },
  {
    id: 6,
    name: "手工编织篮",
    price: 600,
    category: "手工艺品",
    origin: "xx村直供",
    image: "🧺",
  },
  {
    id: 7,
    name: "有机胡萝卜",
    price: 400,
    category: "有机蔬菜",
    origin: "xx村直供",
    image: "🥕",
  },
  {
    id: 8,
    name: "有机橙子",
    price: 900,
    category: "时令水果",
    origin: "xx村直供",
    image: "🍊",
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">积分集市</h1>
          <div className="flex items-center space-x-1 bg-eco-green/10 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-eco-green" />
            <span className="text-sm font-semibold text-eco-green">2580</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* 筛选栏 */}
        <section className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-eco-green text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* 商品列表 */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
<div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
              >
                {/* 商品图片 */}
                <div className="w-full h-32 bg-gradient-to-br from-eco-green/10 to-emerald-50 flex items-center justify-center text-5xl">
                  {product.image}
                </div>

                {/* 商品信息 */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{product.origin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-earth-brown" />
                      <span className="text-sm font-bold text-earth-brown">
                        {product.price}
                      </span>
                    </div>
                    <button className="bg-eco-green text-white text-xs px-3 py-1 rounded-full font-medium active:scale-95 transition-transform">
                      立即兑换
                    </button>
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



