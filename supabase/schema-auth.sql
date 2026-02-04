-- =============================================
-- EcoRural 数据库 Schema
-- Supabase SQL Editor 中执行此脚本
-- =============================================

-- 1. 创建 profiles 表
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT DEFAULT '低碳新用户',
  points INTEGER DEFAULT 0,
  carbon_saved DECIMAL(10, 2) DEFAULT 0.0,
  total_calories INTEGER DEFAULT 0,
  user_title TEXT DEFAULT '绿芽',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

-- 3. 创建 Trigger：用户注册后自动创建 Profile
-- =============================================

-- 首先删除已存在的函数和触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 创建处理新用户的函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', '低碳新用户'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：在用户创建后自动调用函数
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4. 创建称号自动更新函数
-- =============================================
DROP TRIGGER IF EXISTS update_user_title ON public.profiles;
DROP FUNCTION IF EXISTS update_user_title();

CREATE OR REPLACE FUNCTION update_user_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.carbon_saved >= 50 THEN
    NEW.user_title := '金穗';
  ELSIF NEW.carbon_saved >= 10 THEN
    NEW.user_title := '青苗';
  ELSE
    NEW.user_title := '绿芽';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_title
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_title();

-- 5. 启用 RLS (Row Level Security)
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS 策略
-- =============================================

-- 允许用户查看自己的数据
CREATE POLICY "用户只能查看自己的档案" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 允许用户更新自己的数据
CREATE POLICY "用户只能更新自己的档案" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 允许匿名读取（用于排行榜等公开场景）
CREATE POLICY "公开查看用户信息" ON public.profiles
  FOR SELECT
  USING (true);

-- 7. 创建示例数据（可选）
-- =============================================
-- INSERT INTO public.profiles (id, email, username, points, carbon_saved)
-- SELECT id, email, '测试用户', 0, 0
-- FROM auth.users
-- WHERE email LIKE '%@test%'
-- ON CONFLICT (id) DO NOTHING;
