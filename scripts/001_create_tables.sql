-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create websites table
CREATE TABLE IF NOT EXISTS public.websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'error')),
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ux', 'bugs', 'competitive', 'full')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
  results JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Websites policies
CREATE POLICY "websites_select_own" ON public.websites 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "websites_insert_own" ON public.websites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "websites_update_own" ON public.websites 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "websites_delete_own" ON public.websites 
  FOR DELETE USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "analyses_select_own" ON public.analyses 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analyses_insert_own" ON public.analyses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analyses_update_own" ON public.analyses 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "analyses_delete_own" ON public.analyses 
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_website_id ON public.analyses(website_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
