"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Check,
  ChevronRight,
  MapPin,
  Leaf,
  Heart,
  Bike,
  Award,
  Star,
  Zap,
  Trophy,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: number;
  currentProgress: number;
  unit: string;
  unlocked: boolean;
  progress: number;
  category: string;
  tips: string;
}

interface BadgeGalleryProps {
  badges?: Badge[];
}

const mockBadges: Badge[] = [
  {
    id: "carbon-newbie",
    name: "低碳新手",
    icon: "🌱",
    description: "完成首次低碳出行记录",
    requirement: 1,
    currentProgress: 1,
    unit: "次",
    unlocked: true,
    progress: 100,
    category: "减碳",
    tips: "开启一次步行、骑行或公共交通打卡即可解锁",
  },
  {
    id: "helping-farmers",
    name: "助农大使",
    icon: "🌾",
    description: "兑换5次农产品",
    requirement: 5,
    currentProgress: 3,
    unit: "次",
    unlocked: false,
    progress: 60,
    category: "助农",
    tips: "在积分集市兑换农产品可累积进度",
  },
  {
    id: "century-rider",
    name: "百公里大神",
    icon: "🚴",
    description: "累计骑行达到100公里",
    requirement: 100,
    currentProgress: 42,
    unit: "km",
    unlocked: false,
    progress: 42,
    category: "运动",
    tips: "骑行是低碳出行的最佳方式，继续加油！",
  },
];

interface BadgeCardProps {
  badge: Badge;
  onClick: () => void;
}

function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const progress = Math.min((badge.currentProgress / badge.requirement) * 100, 100);
  const isCompleted = badge.unlocked;
  const isInProgress = !badge.unlocked && badge.progress > 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={isCompleted ? { rotateX: 5, rotateY: 5, scale: 1.05 } : {}}
      whileTap={isCompleted ? { rotateX: 0, rotateY: 0, scale: 0.98 } : {}}
      className={`relative p-6 rounded-3xl transition-all duration-300 ${
        isCompleted
          ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 shadow-lg hover:shadow-amber-500/30"
          : isInProgress
          ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200"
          : "bg-slate-100 border-2 border-slate-200 grayscale opacity-60"
      }`}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="relative mb-4">
        <motion.div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl ${
            isCompleted
              ? "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 shadow-lg shadow-amber-500/30"
              : isInProgress
              ? "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400"
              : "bg-slate-300"
          }`}
          whileHover={isCompleted ? { scale: 1.1, rotate: 5 } : {}}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <span className={isCompleted ? "drop-shadow-md" : ""}>{badge.icon}</span>

          {!isCompleted && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white/80" />
            </div>
          )}

          {isInProgress && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-emerald-200"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-emerald-500"
                strokeDasharray={226}
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * progress) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}
        </motion.div>
      </div>

      <h3
        className={`text-center font-bold text-sm mb-1 ${
          isCompleted
            ? "text-amber-800"
            : isInProgress
            ? "text-emerald-800"
            : "text-slate-500"
        }`}
      >
        {badge.name}
      </h3>

      <p
        className={`text-center text-xs ${
          isCompleted
            ? "text-amber-600/70"
            : isInProgress
            ? "text-emerald-600/70"
            : "text-slate-400"
        }`}
      >
        {isCompleted
          ? "已解锁"
          : isInProgress
          ? `${badge.currentProgress}/${badge.requirement}${badge.unit}`
          : `需 ${badge.requirement}${badge.unit}`}
      </p>

      {isCompleted && (
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.05) 100%)",
          }}
        />
      )}
    </motion.button>
  );
}

function BottomSheet({
  isOpen,
  onClose,
  badge,
}: {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}) {
  if (!badge) return null;

  const progress = Math.min((badge.currentProgress / badge.requirement) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="w-16 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 shadow-lg shadow-amber-500/30"
                      : "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400"
                  }`}
                  animate={badge.unlocked ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {badge.icon}
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-800">{badge.name}</h3>
                    {badge.unlocked && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-xs font-medium text-amber-600">
                        已解锁
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{badge.description}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">获取进度</span>
                  <span className="text-sm text-slate-500">
                    {badge.currentProgress} / {badge.requirement} {badge.unit}
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      badge.unlocked
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500"
                    }`}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-4 mb-6 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-1">如何获取</h4>
                    <p className="text-sm text-emerald-600">{badge.tips}</p>
                  </div>
                </div>
              </div>

              {badge.unlocked && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="font-semibold text-amber-800">成就已解锁！</p>
                      <p className="text-sm text-amber-600">
                        恭喜你获得了「{badge.name}」称号
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                知道了
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function BadgeGallery({ badges = mockBadges }: BadgeGalleryProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <>
      <section className="bg-white rounded-3xl shadow-lg shadow-emerald-900/5 border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              成就勋章
            </h2>
            <span className="text-xs px-3 py-1 bg-slate-100 rounded-full text-slate-500">
              {badges.filter((b) => b.unlocked).length}/{badges.length} 已解锁
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} onClick={() => setSelectedBadge(badge)} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
              查看更多成就
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <BottomSheet
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        badge={selectedBadge}
      />
    </>
  );
}
