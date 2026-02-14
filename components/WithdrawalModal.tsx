"use client";

import { useState } from "react";
import { X, Coins } from "lucide-react";
import { createWithdrawal } from "@/lib/supabase";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userCoins: number;
  onSuccess: (newCoins: number) => void;
}

const COINS_PER_YUAN = 200;
const MIN_WITHDRAWAL_YUAN = 10;

export default function WithdrawalModal({ isOpen, onClose, userId, userCoins, onSuccess }: WithdrawalModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  if (!isOpen) return null;

  const coinAmount = parseInt(amount) || 0;
  const yuanAmount = coinAmount / COINS_PER_YUAN;
  const minCoins = MIN_WITHDRAWAL_YUAN * COINS_PER_YUAN;

  const handleAmountChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      setAmount("");
    } else {
      setAmount(value);
    }
    setError("");
    setSuccess("");
  };

  const quickAmounts = [
    minCoins,
    minCoins * 2,
    minCoins * 5,
  ];

  const handleQuickSelect = (coins: number) => {
    if (coins <= userCoins) {
      setAmount(coins.toString());
      setError("");
    }
  };

  const handleWithdraw = async () => {
    if (!userId) {
      setError("请先登录");
      return;
    }

    if (coinAmount < minCoins) {
      setError(`最低提现 ${MIN_WITHDRAWAL_YUAN} 元（${minCoins} 积分）`);
      return;
    }

    if (coinAmount > userCoins) {
      setError("积分不足");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await createWithdrawal(userId, coinAmount);
      
      if (result.success) {
        const newCoins = userCoins - coinAmount;
        setSuccess(`成功提现 ¥${yuanAmount.toFixed(2)}！`);
        onSuccess(newCoins);
        setTimeout(() => {
          onClose();
          setAmount("");
          setSuccess("");
        }, 1500);
      } else {
        setError(result.error || "提现失败");
      }
    } catch (err: any) {
      setError(err.message || "提现失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">积分提现</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">当前可用积分</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-600">{userCoins}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              可提现最高 ¥{(userCoins / COINS_PER_YUAN).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入提现积分
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={`最低 ${minCoins} 积分`}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                ≈ ¥{yuanAmount.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">
                {COINS_PER_YUAN}积分 = ¥1
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">快速选择</p>
            <div className="flex gap-2">
              {quickAmounts.map((coins) => (
                <button
                  key={coins}
                  onClick={() => handleQuickSelect(coins)}
                  disabled={coins > userCoins}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    coins <= userCoins
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {coins}积分
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
              <span className="text-red-500">⚠️</span>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <span className="text-green-500">✅</span>
              <span className="text-sm text-green-600">{success}</span>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={isLoading || !amount || coinAmount <= 0}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              isLoading || !amount || coinAmount <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            }`}
          >
            {isLoading ? "处理中..." : "确认提现"}
          </button>

          <p className="text-xs text-center text-gray-400">
            最低提现 {MIN_WITHDRAWAL_YUAN} 元 • 预计1-3个工作日到账
          </p>
        </div>
      </div>
    </div>
  );
}
