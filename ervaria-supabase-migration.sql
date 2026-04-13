-- ============================================================
-- ERVARIA — Supabase Migration
-- Projeto: lwzrzztzpklzbmxbqcrx
-- Data: 2026-04-12
-- ============================================================
-- INSTRUÇÃO: Cole este SQL no Supabase Dashboard > SQL Editor
-- e execute. Isso cria todas as tabelas e políticas de segurança.
-- ============================================================

-- 1. PERFIL DO USUÁRIO
-- Criado automaticamente quando o usuário faz signup
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PREFERÊNCIAS DO ONBOARDING
-- Salva as respostas do quiz inicial (cafeína, momento, sabor)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caffeine_pref TEXT CHECK (caffeine_pref IN ('com', 'sem', 'tanto_faz')),
  moment_pref TEXT CHECK (moment_pref IN ('manha', 'tarde', 'noite', 'qualquer')),
  flavor_pref TEXT CHECK (flavor_pref IN ('floral', 'frutado', 'terroso', 'herbal', 'especiado', 'qualquer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. FAVORITOS
-- Chás marcados com ♥
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tea_id TEXT NOT NULL,          -- ID do chá no catálogo JS (ex: "camomila", "sencha")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tea_id)
);

-- 4. INVENTÁRIO ("TENHO EM CASA")
-- Chás que o usuário possui
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tea_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tea_id)
);

-- 5. HISTÓRICO DA RODA DOS CHÁS
-- Registra cada consulta à Roda (sentimento → chá recomendado)
CREATE TABLE IF NOT EXISTS public.tea_wheel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feeling TEXT NOT NULL,         -- ex: "ansioso", "cansado", "indisposto"
  tea_id TEXT NOT NULL,          -- chá recomendado
  tea_name TEXT NOT NULL,        -- nome legível
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DIÁRIO DE DEGUSTAÇÃO (melhoria futura 16)
-- Notas pessoais de cada chá experimentado
CREATE TABLE IF NOT EXISTS public.tasting_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tea_id TEXT NOT NULL,
  tea_name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  aroma_notes TEXT,
  flavor_notes TEXT,
  context TEXT,                  -- ex: "tarde chuvosa", "depois do jantar"
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê e edita seus próprios dados
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tea_wheel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasting_journal ENABLE ROW LEVEL SECURITY;

-- POLICIES: user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- POLICIES: user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- POLICIES: user_favorites
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- POLICIES: user_inventory
CREATE POLICY "Users can view own inventory"
  ON public.user_inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON public.user_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON public.user_inventory FOR DELETE
  USING (auth.uid() = user_id);

-- POLICIES: tea_wheel_history
CREATE POLICY "Users can view own wheel history"
  ON public.tea_wheel_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wheel history"
  ON public.tea_wheel_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- POLICIES: tasting_journal
CREATE POLICY "Users can view own journal"
  ON public.tasting_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journal"
  ON public.tasting_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal"
  ON public.tasting_journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.tasting_journal FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-criar perfil no signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que roda a cada novo signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tasting_journal_updated_at
  BEFORE UPDATE ON public.tasting_journal
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_wheel_history_user ON public.tea_wheel_history(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user ON public.tasting_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_preferences_user ON public.user_preferences(user_id);
