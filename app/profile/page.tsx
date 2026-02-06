"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/supabase";
import supabase from "@/lib/supabase";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const profile = await getUserProfile(session.user.id);

      if (profile) {
        setUserId(session.user.id);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  return <Profile userId={userId} />;
}
