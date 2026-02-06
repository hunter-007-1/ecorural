"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "高山有机土豆", price: 30, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400" },
  { id: 2, name: "农家散养土鸡蛋", price: 50, category: "乡村民宿", image: "https://images.unsplash.com/photo-1516467508483-a72120608ae0?w=400" },
  { id: 3, name: "红富士苹果", price: 45, category: "时令水果", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { id: 4, name: "新鲜大白菜", price: 15, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1633341857850-2f166b567b57?w=400" },
  { id: 5, name: "手工竹编篮", price: 120, category: "手工艺品", image: "https://images.unsplash.com/photo-1596464716127-f9a8656d7879?w=400" },
  { id: 6, name: "巨峰葡萄", price: 60, category: "时令水果", image: "https://images.unsplash.com/photo-1537640538965-1756299f00f6?w=400" },
];

const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredProducts = selectedCategory === "全部" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">乡农集市</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">
                    ¥{product.price}
                  </span>
                  <button className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无该分类商品</p>
          </div>
        )}
      </main>
    </div>
  );
}
