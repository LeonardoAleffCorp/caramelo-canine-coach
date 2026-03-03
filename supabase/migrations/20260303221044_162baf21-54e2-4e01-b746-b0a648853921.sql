
-- 1. Add deleted_at columns for soft delete on key tables
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;
ALTER TABLE public.vaccines ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;
ALTER TABLE public.pet_diseases ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;
ALTER TABLE public.pet_medications ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- 2. Create activity_logs table for user event tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 3. Add indexes on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_deleted_at ON public.pets(deleted_at);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id ON public.vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_pet_id ON public.weight_logs(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_trainings_pet_id ON public.pet_trainings(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_stats_pet_id ON public.pet_stats(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_diseases_pet_id ON public.pet_diseases(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_medications_pet_id ON public.pet_medications(pet_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_pet_achievements_pet_id ON public.pet_achievements(pet_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
