"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sprout, TreeDeciduous, TreePine, Sparkles, Coins } from "lucide-react";

interface CarbonGamificationCardProps {
  initialTotalPoints?: number;
  initialUnclaimedPoints?: number;
}

export default function CarbonGamificationCard({
  initialTotalPoints = 1250,
  initialUnclaimedPoints = 50,
}: CarbonGamificationCardProps) {
  const [totalPoints, setTotalPoints] = useState(initialTotalPoints);
  const [unclaimedPoints, setUnclaimedPoints] = useState(initialUnclaimedPoints);
  const [displayPoints, setDisplayPoints] = useState(initialTotalPoints);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; value: number }[]
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [treeStage, setTreeStage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const particleIdCounter = useRef(0);

  const getTreeStage = useCallback((points: number) => {
    if (points >= 5000) return 2;
    if (points >= 1500) return 1;
    return 0;
  }, []);

  useEffect(() => {
    setTreeStage(getTreeStage(totalPoints));
  }, [totalPoints, getTreeStage]);

  useEffect(() => {
    if (showCelebration) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          spread: 50,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#10B981", "#34D399", "#FBBF24", "#FCD34D"],
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 3,
          spread: 50,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#10B981", "#34D399", "#FBBF24", "#FCD34D"],
          disableForReducedMotion: true,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setShowCelebration(false);
        }
      };
      frame();
    }
  }, [showCelebration]);

  const triggerConfetti = () => {
    setShowCelebration(true);
  };

  const handleClaim = async () => {
    if (isAnimating || unclaimedPoints <= 0) return;

    setIsAnimating(true);
    const startStage = treeStage;

    if (!buttonRef.current || !scoreRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const scoreRect = scoreRef.current.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = scoreRect.left + scoreRect.width / 2;
    const endY = scoreRect.top + scoreRect.height / 2;

    const particleCount = Math.min(8, unclaimedPoints);
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const delay = i * 50;
      const spreadX = (Math.random() - 0.5) * 50;
      const spreadY = (Math.random() - 0.5) * 50;

      newParticles.push({
        id: particleIdCounter.current++,
        x: startX + spreadX,
        y: startY + spreadY,
        value: Math.ceil(unclaimedPoints / particleCount),
      });
    }

    setParticles(newParticles);

    setTimeout(() => {
      let currentValue = 0;
      const targetValue = unclaimedPoints;
      const duration = 800;
      const startTime = Date.now();

      const animateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentValue = Math.floor(targetValue * easeOut);

        setDisplayPoints(totalPoints + currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          const finalStage = getTreeStage(totalPoints + targetValue);
          setTotalPoints(totalPoints + targetValue);
          setDisplayPoints(totalPoints + targetValue);
          setUnclaimedPoints(0);
          setParticles([]);
          setIsAnimating(false);

          if (finalStage > startStage) {
            setTreeStage(finalStage);
          }

          triggerConfetti();
        }
      };

      animateCount();
    }, 300);
  };

  const getTreeIcon = (stage: number, isJelly = false) => {
    const icons = [
      <Sprout
        key="seed"
        className={`w-24 h-24 ${isJelly ? "text-emerald-400" : "text-emerald-500"}`}
      />,
      <TreeDeciduous
        key="sapling"
        className={`w-28 h-28 ${isJelly ? "text-emerald-400" : "text-emerald-600"}`}
      />,
      <TreePine
        key="tree"
        className={`w-32 h-32 ${isJelly ? "text-emerald-400" : "text-emerald-700"}`}
      />,
    ];
    return icons[stage];
  };

  const treeVariants = {
    seed: { scale: 1 },
    sapling: { scale: 1 },
    tree: { scale: 1 },
    jelly: {
      scale: [1, 1.2, 0.95, 1.05, 1],
      transition: { duration: 0.6 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.9 },
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4, repeat: Infinity, repeatType: "loop" as const },
    },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 rounded-3xl shadow-xl shadow-emerald-900/10 border border-emerald-100/50 p-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.1),_transparent_50%)]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">碳树养成</span>
            </div>
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-600 font-medium">
              阶段 {treeStage + 1}/3
            </span>
          </div>

          <motion.div
            ref={scoreRef}
            className="text-center mb-6"
            initial={{ scale: 1 }}
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-slate-500 mb-1">我的总能量</p>
            <div className="flex items-center justify-center gap-1">
              <Coins className="w-8 h-8 text-amber-500" />
              <motion.span
                key={displayPoints}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold text-emerald-800 tracking-tight"
              >
                {displayPoints.toLocaleString()}
              </motion.span>
            </div>
          </motion.div>

          <div className="flex justify-center mb-6">
            <motion.div
              className="relative"
              animate={isAnimating ? "jelly" : "idle"}
              variants={treeVariants}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/20 to-transparent rounded-full blur-xl" />
                {getTreeIcon(treeStage, isAnimating)}
              </motion.div>

              {isAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-16 h-16 text-amber-400" />
                </motion.div>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {unclaimedPoints > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <motion.button
                  ref={buttonRef}
                  onClick={handleClaim}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  animate={!isAnimating ? "shake" : "idle"}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>领取 +{unclaimedPoints} 能量</span>
                  </div>
                </motion.button>

                <p className="text-center text-xs text-slate-500 mt-2">
                  完成今日运动目标可获得更多能量！
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {unclaimedPoints === 0 && !isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-2"
              >
                <p className="text-sm text-slate-400">
                  继续运动，让你的碳树茁壮成长！
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
              animate={{
                opacity: 0,
                scale: 0,
                x: scoreRef.current?.getBoundingClientRect().left || 0,
                y: scoreRef.current?.getBoundingClientRect().top || 0,
              }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="fixed pointer-events-none z-50"
              style={{ left: 0, top: 0 }}
            >
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>+{particle.value}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
