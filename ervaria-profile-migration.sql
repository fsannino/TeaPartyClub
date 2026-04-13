-- ============================================================
-- ERVARIA — Profile Fields Migration
-- Data: 2026-04-13
-- ============================================================
-- INSTRUÇÃO: Execute no Supabase Dashboard > SQL Editor
-- Adiciona campos do formulário completo de registro
-- ============================================================

-- Novos campos no user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS extra_emails TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Brasil',
  ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN (
    'iniciante','aficionado','tea_taster','tea_master',
    'tea_blender','barista','dono_chazeria','outro'
  )),
  ADD COLUMN IF NOT EXISTS role_other TEXT,
  ADD COLUMN IF NOT EXISTS main_interest TEXT CHECK (main_interest IN (
    'descobrir','saude','blends','comprar','profissional','cultura'
  )),
  ADD COLUMN IF NOT EXISTS referral_source TEXT CHECK (referral_source IN (
    'google','instagram','amigo','evento','outro'
  )),
  ADD COLUMN IF NOT EXISTS newsletter_optin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lgpd_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lgpd_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Índice para buscas por perfil profissional
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Índice para filtrar quem aceitou newsletter
CREATE INDEX IF NOT EXISTS idx_user_profiles_newsletter ON public.user_profiles(newsletter_optin) WHERE newsletter_optin = TRUE;
