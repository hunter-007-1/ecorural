"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
  seller_id: string;
  created_at: string;
}

const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

export default function MarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("开始请求 Supabase 数据...");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Supabase Data:", data);
      console.log("Error:", error);

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      console.log("原始数据条数:", data?.length || 0);

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      console.log("Loading 状态:", false);
    }
  };

  const filteredProducts =
    selectedCategory === "全部"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  console.log("当前分类:", selectedCategory);
  console.log("过滤后数据条数:", filteredProducts.length);

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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {product.seller_id === "official" ? "官方自营" : `卖家: ${product.seller_id}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      {product.price}
                    </span>
                    <span className="text-xs text-gray-500">绿农币</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">数据库中没有商品数据，请先添加</p>
            <p className="text-gray-400 text-sm mt-2">请检查 Supabase products 表是否有数据</p>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无该分类商品</p>
            <p className="text-gray-400 text-sm mt-2">
              当前分类: {selectedCategory}，共 {products.length} 条数据
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
