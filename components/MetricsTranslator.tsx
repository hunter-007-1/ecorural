"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sandwich, Snowflake, Info, ChefHat, Globe } from "lucide-react";

interface MetricsTranslatorProps {
  calories?: number;
  carbon?: number;
}

export default function MetricsTranslator({
  calories = 0,
  carbon = 0,
}: MetricsTranslatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const burgerCount = Math.round(calories / 250);
  const glacierCount = Math.round(carbon);

  const burgerArray = Array.from({ length: Math.min(burgerCount, 5) }, (_, i) => i);
  const glacierArray = Array.from({ length: Math.min(glacierCount, 5) }, (_, i) => i);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative bg-gradient-to-br from-slate-50 to-stone-100 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-cyan-400 to-emerald-400" />

      <div className="grid grid-cols-2 divide-x divide-slate-200">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              热量换算
            </span>
          </div>

          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {burgerCount}
            </span>
            <span className="text-sm text-slate-500 mb-1">个汉堡</span>
          </div>

          <div className="flex gap-1 mb-3">
            {burgerArray.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: index * 0.1,
                }}
                className="text-2xl filter drop-shadow-sm"
              >
                🍔
              </motion.div>
            ))}
            {burgerCount > 5 && (
              <span className="text-sm text-slate-400 self-center">+{burgerCount - 5}</span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            您刚刚{" "}
            <span className="text-orange-500 font-bold">燃烧</span>
            掉了 {burgerCount} 个汉堡的热量！
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              环保换算
            </span>
          </div>

          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {glacierCount}
            </span>
            <span className="text-sm text-slate-500 mb-1">块冰川</span>
          </div>

          <div className="flex gap-2 mb-3">
            {glacierArray.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: index * 0.1,
                }}
              >
                <Snowflake className="w-6 h-6 text-cyan-400" />
              </motion.div>
            ))}
            {glacierCount > 5 && (
              <span className="text-sm text-slate-400 self-center">+{glacierCount - 5}</span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            为地球保留了{" "}
            <span className="text-cyan-500 font-bold">1</span>
            块冰川的空间！
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-slate-800 text-white p-3 text-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-3 h-3 text-amber-400" />
              <span className="font-medium text-amber-400">换算公式</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>🍔 热量：{calories} kcal ÷ 250 = {burgerCount} 个汉堡</p>
              <p>🧊 碳排：{carbon} kg × 1 = {glacierCount} 块冰川</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
