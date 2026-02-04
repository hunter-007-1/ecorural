"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, ShoppingBag, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/activity", icon: Activity, label: "运动" },
  { href: "/marketplace", icon: ShoppingBag, label: "集市" },
  { href: "/profile", icon: User, label: "我的" },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-eco-green" : "text-gray-500"
              }`}
            >
              <Icon
                size={24}
                className={isActive ? "text-eco-green" : "text-gray-500"}
              />
              <span className={`text-xs mt-1 ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}



