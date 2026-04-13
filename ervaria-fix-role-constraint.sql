-- ============================================================
-- ERVARIA — Fix role constraint
-- Data: 2026-04-13
-- ============================================================
-- A constraint antiga não incluía os novos valores de role.
-- Este script remove a constraint antiga e recria com todos os valores.
-- ============================================================

-- Remove constraint antiga (nome pode variar)
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Recria com todos os valores válidos
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN (
    'iniciante','aficionado','apreciador',
    'tea_taster','tea_master','tea_blender',
    'barista','dono_chazeria','outro'
  ));
