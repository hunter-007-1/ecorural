"use client";

import { useState, useEffect } from "react";
import { Coins, MapPin, Sparkles, ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  origin: string;
  image_url: string;
  tag: string;
  sold: number;
  stock: number;
}

interface MarketplaceProps {
  onProductClick?: (product: Product) => void;
  userId?: string;
  initialPoints?: number;
  onPointsUpdate?: (points: number) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "高山有机土豆", price: 30, category: "有机蔬菜", origin: "云南山区", image_url: "🥔", tag: "热销", sold: 156, stock: 50 },
  { id: 2, name: "新鲜大白菜", price: 15, category: "有机蔬菜", origin: "山东田园", image_url: "🥬", tag: "新鲜", sold: 89, stock: 30 },
  { id: 3, name: "农家胡萝卜", price: 18, category: "有机蔬菜", origin: "内蒙古", image_url: "🥕", tag: "有机", sold: 67, stock: 45 },
  { id: 4, name: "纯天然菠菜", price: 12, category: "有机蔬菜", origin: "河北", image_url: "🥬", tag: "绿色", sold: 45, stock: 60 },
  { id: 5, name: "新鲜番茄", price: 22, category: "有机蔬菜", origin: "新疆", image_url: "🍅", tag: "当季", sold: 78, stock: 40 },
  { id: 6, name: "有机青椒", price: 20, category: "有机蔬菜", origin: "贵州", image_url: "🫑", tag: "特惠", sold: 34, stock: 25 },

  { id: 7, name: "红富士苹果", price: 45, category: "时令水果", origin: "陕西洛川", image_url: "🍎", tag: "精品", sold: 234, stock: 100 },
  { id: 8, name: "巨峰葡萄", price: 60, category: "时令水果", origin: "新疆吐鲁番", image_url: "🍇", tag: "热销", sold: 189, stock: 80 },
  { id: 9, name: "香甜草莓", price: 80, category: "时令水果", origin: "辽宁丹东", image_url: "🍓", tag: "新品", sold: 156, stock: 50 },
  { id: 10, name: "新疆哈密瓜", price: 35, category: "时令水果", origin: "新疆哈密", image_url: "🍈", tag: "当季", sold: 98, stock: 60 },
  { id: 11, name: "贵妃芒果", price: 55, category: "时令水果", origin: "海南三亚", image_url: "🥭", tag: "热带", sold: 123, stock: 45 },
  { id: 12, name: "红心火龙果", price: 40, category: "时令水果", origin: "广西", image_url: "🔥", tag: "进口", sold: 76, stock: 35 },

  { id: 13, name: "农家散养土鸡蛋", price: 50, category: "乡村民宿", origin: "江西农村", image_url: "🥚", tag: "散养", sold: 312, stock: 200 },
  { id: 14, name: "放养土鸡", price: 150, category: "乡村民宿", origin: "湖南农村", image_url: "🐔", tag: "土特产", sold: 45, stock: 20 },
  { id: 15, name: "农家自产蜂蜜", price: 120, category: "乡村民宿", origin: "四川", image_url: "🍯", tag: "纯天然", sold: 89, stock: 30 },
  { id: 16, name: "农村散养鸭蛋", price: 45, category: "乡村民宿", origin: "江苏", image_url: "🥚", tag: "生态", sold: 56, stock: 40 },
  { id: 17, name: "手工豆腐", price: 25, category: "乡村民宿", origin: "安徽", image_url: "🧈", tag: "传统", sold: 67, stock: 50 },

  { id: 18, name: "手工竹编篮", price: 120, category: "手工艺品", origin: "浙江", image_url: "🧺", tag: "手工", sold: 34, stock: 15 },
  { id: 19, name: "手工刺绣围巾", price: 180, category: "手工艺品", origin: "江苏苏州", image_url: "🧣", tag: "非遗", sold: 23, stock: 10 },
  { id: 20, name: "陶艺花瓶", price: 250, category: "手工艺品", origin: "江西景德镇", image_url: "🏺", tag: "艺术", sold: 18, stock: 8 },
  { id: 21, name: "手工木雕摆件", price: 320, category: "手工艺品", origin: "福建", image_url: "🪵", tag: "收藏", sold: 12, stock: 5 },
  { id: 22, name: "草编帽子", price: 85, category: "手工艺品", origin: "山东", image_url: "👒", tag: "夏日", sold: 45, stock: 20 },
];

const categories = ["全部", "有机蔬菜", "时令水果", "乡村民宿", "手工艺品"];

export default function Marketplace({ onProductClick, userId, initialPoints = 0, onPointsUpdate }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPoints, setCurrentPoints] = useState(initialPoints);

  useEffect(() => {
    setCurrentPoints(initialPoints);
  }, [initialPoints]);

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
    setLoading(false);
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

    if (product.price > currentPoints) {
      showToast('积分不足', 'error');
      return;
    }

    if (product.stock <= 0) {
      showToast('商品已售罄', 'error');
      return;
    }

    setPurchasingId(product.id);
    setTimeout(() => {
      const newPoints = currentPoints - product.price;
      setCurrentPoints(newPoints);
      onPointsUpdate?.(newPoints);
      setPurchasingId(null);
      showToast(`成功兑换 ${product.name}！`, 'success');
    }, 500);
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
                  {product.image_url}
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
            ? "bg-emerald-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
