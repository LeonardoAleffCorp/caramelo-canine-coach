
-- Subscriptions table for trial + paid plans
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plan_type text NOT NULL DEFAULT 'trial', -- trial, monthly, semiannual, annual
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Vaccine types catalog
CREATE TABLE public.vaccine_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vaccine_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vaccine types" ON public.vaccine_types FOR SELECT USING (true);
CREATE POLICY "Users can insert custom vaccine types" ON public.vaccine_types FOR INSERT WITH CHECK (is_custom = true);

-- Seed common vaccine types
INSERT INTO public.vaccine_types (name, description) VALUES
  ('V8 (Óctupla)', 'Cinomose, Parvovirose, Hepatite, Adenovirose, Coronavirose, Parainfluenza, Leptospirose'),
  ('V10 (Déctupla)', 'V8 + 2 cepas adicionais de Leptospirose'),
  ('Antirrábica', 'Raiva - obrigatória por lei'),
  ('Gripe Canina', 'Bordetella bronchiseptica + Parainfluenza'),
  ('Giardíase', 'Giardia lamblia'),
  ('Leishmaniose', 'Leishmania infantum'),
  ('Leptospirose', 'Reforço de Leptospirose'),
  ('Tosse dos Canis', 'Bordetella bronchiseptica');

-- Pet avatar items table
CREATE TABLE public.avatar_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL, -- hat, glasses, collar, outfit, accessory
  emoji text NOT NULL,
  color text NOT NULL DEFAULT '#000000',
  is_premium boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.avatar_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read avatar items" ON public.avatar_items FOR SELECT USING (true);

-- Pet equipped avatar items
CREATE TABLE public.pet_avatar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.avatar_items(id) ON DELETE CASCADE,
  equipped_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(pet_id, item_id)
);

ALTER TABLE public.pet_avatar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet avatar" ON public.pet_avatar FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_avatar.pet_id AND pets.owner_id = auth.uid()));
CREATE POLICY "Users can insert own pet avatar" ON public.pet_avatar FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_avatar.pet_id AND pets.owner_id = auth.uid()));
CREATE POLICY "Users can delete own pet avatar" ON public.pet_avatar FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_avatar.pet_id AND pets.owner_id = auth.uid()));

-- Seed avatar items
INSERT INTO public.avatar_items (name, category, emoji, color, sort_order) VALUES
  ('Boné Vermelho', 'hat', '🧢', '#EF4444', 1),
  ('Chapéu Cowboy', 'hat', '🤠', '#92400E', 2),
  ('Coroa', 'hat', '👑', '#F59E0B', 3),
  ('Laço Rosa', 'hat', '🎀', '#EC4899', 4),
  ('Óculos Escuros', 'glasses', '🕶️', '#1F2937', 5),
  ('Óculos Coração', 'glasses', '❤️', '#EF4444', 6),
  ('Coleira Dourada', 'collar', '⭐', '#F59E0B', 7),
  ('Coleira Punk', 'collar', '🔗', '#6B7280', 8),
  ('Gravata Borboleta', 'collar', '🎩', '#1F2937', 9),
  ('Bandana', 'collar', '🟥', '#EF4444', 10),
  ('Camiseta Esporte', 'outfit', '👕', '#3B82F6', 11),
  ('Capa de Herói', 'outfit', '🦸', '#DC2626', 12),
  ('Suéter Natalino', 'outfit', '🎄', '#16A34A', 13),
  ('Fantasia de Abelha', 'outfit', '🐝', '#F59E0B', 14),
  ('Asas de Anjo', 'accessory', '😇', '#FFFFFF', 15),
  ('Medalha', 'accessory', '🏅', '#F59E0B', 16),
  ('Mochila', 'accessory', '🎒', '#DC2626', 17),
  ('Patinhas Brilhantes', 'accessory', '✨', '#F59E0B', 18);
