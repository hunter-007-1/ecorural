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
  { id: 2, name: "新鲜大白菜", price: 15, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1633341857850-2f166b567b57?w=400" },
  { id: 3, name: "农家胡萝卜", price: 18, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" },
  { id: 4, name: "纯天然菠菜", price: 12, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
  { id: 5, name: "新鲜番茄", price: 22, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1546470427-0d4db154cde3?w=400" },
  { id: 6, name: "有机青椒", price: 20, category: "有机蔬菜", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400" },

  { id: 7, name: "红富士苹果", price: 45, category: "时令水果", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { id: 8, name: "巨峰葡萄", price: 60, category: "时令水果", image: "https://images.unsplash.com/photo-1537640538965-1756299f00f6?w=400" },
  { id: 9, name: "香甜草莓", price: 80, category: "时令水果", image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400" },
  { id: 10, name: "新疆哈密瓜", price: 35, category: "时令水果", image: "https://images.unsplash.com/photo-1575444752964-009758874b91?w=400" },
  { id: 11, name: "贵妃芒果", price: 55, category: "时令水果", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400" },
  { id: 12, name: "红心火龙果", price: 40, category: "时令水果", image: "https://images.unsplash.com/photo-1552410260-0fd9b57799c5?w=400" },

  { id: 13, name: "农家散养土鸡蛋", price: 50, category: "乡村民宿", image: "https://images.unsplash.com/photo-1516467508483-a72120608ae0?w=400" },
  { id: 14, name: "放养土鸡", price: 150, category: "乡村民宿", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400" },
  { id: 15, name: "农家自产蜂蜜", price: 120, category: "乡村民宿", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
  { id: 16, name: "农村散养鸭蛋", price: 45, category: "乡村民宿", image: "https://images.unsplash.com/photo-1564969479896-9804f2859638?w=400" },
  { id: 17, name: "手工豆腐", price: 25, category: "乡村民宿", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" },

  { id: 18, name: "手工竹编篮", price: 120, category: "手工艺品", image: "https://images.unsplash.com/photo-1596464716127-f9a8656d7879?w=400" },
  { id: 19, name: "手工刺绣围巾", price: 180, category: "手工艺品", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400" },
  { id: 20, name: "陶艺花瓶", price: 250, category: "手工艺品", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" },
  { id: 21, name: "手工木雕摆件", price: 320, category: "手工艺品", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400" },
  { id: 22, name: "草编帽子", price: 85, category: "手工艺品", image: "https://images.unsplash.com/photo-1579288240544-3c5b7f0a4e70?w=400" },
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
          <p className="text-xs text-gray-500">共 {MOCK_PRODUCTS.length} 件商品</p>
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
                <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
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
