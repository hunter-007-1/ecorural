"use client";

import { useState, useEffect } from "react";
import { Coins, MapPin, Sparkles, ArrowRight } from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { fetchProducts, buyProduct } from "@/lib/supabase";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  origin: string;
  image: string;
  tag: string;
  sold: number;
}

interface MarketplaceProps {
  onProductClick?: (product: Product) => void;
  userId?: string;
  initialPoints?: number;
  onPointsUpdate?: (points: number) => void;
}

const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

export default function Marketplace({ onProductClick, userId, initialPoints = 0, onPointsUpdate }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePurchase = async (product: Product) => {
    if (!userId) {
      showToast('请先登录', 'error');
      return;
    }

    if (product.price > initialPoints) {
      showToast('积分不足', 'error');
      return;
    }

    setPurchasingId(product.id);
    const result = await buyProduct(userId, product.id);
    setPurchasingId(null);

    if (result.success) {
      const newPoints = initialPoints - product.price;
      onPointsUpdate?.(newPoints);
      showToast(`成功兑换 ${product.name}！`, 'success');
    } else {
      showToast(result.error || '兑换失败', 'error');
    }
  };

  const filteredProducts =
    selectedCategory === "全部"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-emerald-900/5 border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-gradient-to-br from-slate-50 to-stone-50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />
                <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 transition-transform duration-500 group-hover:scale-105">
                  {product.image}
                </div>
                <div className="absolute top-2 left-2 z-20">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-emerald-700 shadow-sm">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 z-20">
                  <span className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/90">
                    已售 {product.sold}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400 truncate">{product.origin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="text-lg font-extrabold text-emerald-600">
                      {product.price}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(product);
                    }}
                    disabled={purchasingId === product.id}
                    className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {purchasingId === product.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-3 h-3 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 rounded-2xl border border-amber-100">
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
      </div>

      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 ${
          toast.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
