
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT NOT NULL DEFAULT 'Vira-lata/SRD',
  age_months INTEGER NOT NULL DEFAULT 12,
  weight_kg NUMERIC(5,2),
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pets" ON public.pets FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own pets" ON public.pets FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own pets" ON public.pets FOR DELETE USING (auth.uid() = owner_id);

-- Training categories
CREATE TABLE public.training_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.training_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.training_categories FOR SELECT USING (true);

-- Trainings
CREATE TABLE public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.training_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read trainings" ON public.trainings FOR SELECT USING (true);

-- Training steps
CREATE TABLE public.training_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.training_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read steps" ON public.training_steps FOR SELECT USING (true);

-- Pet trainings (progress)
CREATE TABLE public.pet_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pet_trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pet trainings" ON public.pet_trainings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_trainings.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own pet trainings" ON public.pet_trainings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_trainings.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can update own pet trainings" ON public.pet_trainings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_trainings.pet_id AND pets.owner_id = auth.uid())
);

-- Pet stats
CREATE TABLE public.pet_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL UNIQUE REFERENCES public.pets(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Filhote',
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_training_date DATE
);
ALTER TABLE public.pet_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pet stats" ON public.pet_stats FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_stats.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own pet stats" ON public.pet_stats FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_stats.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can update own pet stats" ON public.pet_stats FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_stats.pet_id AND pets.owner_id = auth.uid())
);

-- Vaccines
CREATE TABLE public.vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  applied_date DATE NOT NULL,
  next_dose_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own vaccines" ON public.vaccines FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccines.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own vaccines" ON public.vaccines FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccines.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can update own vaccines" ON public.vaccines FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccines.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can delete own vaccines" ON public.vaccines FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccines.pet_id AND pets.owner_id = auth.uid())
);

-- Weight logs
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own weight logs" ON public.weight_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = weight_logs.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own weight logs" ON public.weight_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = weight_logs.pet_id AND pets.owner_id = auth.uid())
);

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);

-- Pet achievements
CREATE TABLE public.pet_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pet_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pet achievements" ON public.pet_achievements FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_achievements.pet_id AND pets.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own pet achievements" ON public.pet_achievements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_achievements.pet_id AND pets.owner_id = auth.uid())
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED DATA: Categories
INSERT INTO public.training_categories (id, name, emoji, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Truques Básicos', '🎩', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Comportamento', '🧠', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Passeio', '🚶', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Saúde', '🏥', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Socialização', '🐾', 5);

-- SEED: Trainings
INSERT INTO public.trainings (id, category_id, name, difficulty, duration_minutes, is_premium, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Sentar', 1, 10, false, 1),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Deitar', 1, 10, false, 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Dar a Pata', 1, 15, false, 3),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Parar de Puxar', 2, 15, false, 1),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Não Pular nas Pessoas', 2, 10, false, 2),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Ficar Quieto', 2, 15, true, 3),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Andar ao Lado', 2, 20, false, 1),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Ignorar Distrações', 3, 20, true, 2),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'Recall (Vem Aqui)', 2, 15, false, 3),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004', 'Escovação de Dentes', 1, 10, false, 1),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004', 'Banho Tranquilo', 2, 15, false, 2),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004', 'Exame de Orelhas', 1, 10, true, 3),
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005', 'Conhecer Outros Cães', 2, 20, false, 1),
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'Aceitar Estranhos', 2, 15, false, 2),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', 'Barulhos e Ambientes', 3, 20, true, 3);

-- SEED: Steps for "Sentar"
INSERT INTO public.training_steps (training_id, step_number, title, description, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 1, 'Prepare os petiscos 🦴', 'Pegue petiscos pequenos e saborosos. Barriga levemente vazia ajuda na motivação!', 1),
  ('b1000000-0000-0000-0000-000000000001', 2, 'Chame a atenção 👀', 'Mostre o petisco para o seu cão e deixe ele cheirar.', 2),
  ('b1000000-0000-0000-0000-000000000001', 3, 'Mova o petisco ☝️', 'Mova acima do focinho em direção às orelhas. Naturalmente ele vai sentar!', 3),
  ('b1000000-0000-0000-0000-000000000001', 4, 'Não empurre! 🚫', 'Nunca force fisicamente. Deixe ele descobrir sozinho.', 4),
  ('b1000000-0000-0000-0000-000000000001', 5, 'Marque o momento ✅', 'Quando sentar, diga "SIM!" com entusiasmo e dê o petisco imediatamente.', 5),
  ('b1000000-0000-0000-0000-000000000001', 6, 'Repita 5 vezes 🔄', 'Faça 5 repetições com intervalo de 3-5 segundos entre cada.', 6),
  ('b1000000-0000-0000-0000-000000000001', 7, 'Adicione o comando 🗣️', 'Diga "SENTA" antes de mover o petisco. Ele vai associar!', 7),
  ('b1000000-0000-0000-0000-000000000001', 8, 'Teste sem petisco visível 🤲', 'Mão fechada, sem mostrar. Se sentar, festeje muito!', 8),
  ('b1000000-0000-0000-0000-000000000001', 9, 'Aumente a dificuldade 📈', 'Tente em lugares diferentes da casa e na rua.', 9),
  ('b1000000-0000-0000-0000-000000000001', 10, 'Parabéns! 🎉', 'Seu cão aprendeu a sentar! Pratique 2-3x/dia por uma semana para fixar.', 10);

-- SEED: Steps for "Deitar"
INSERT INTO public.training_steps (training_id, step_number, title, description, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000002', 1, 'Comece sentado 🐕', 'Primeiro peça ao cão para sentar. Essa é a posição inicial.', 1),
  ('b1000000-0000-0000-0000-000000000002', 2, 'Petisco no focinho 🦴', 'Segure o petisco bem perto do focinho dele.', 2),
  ('b1000000-0000-0000-0000-000000000002', 3, 'Mova para baixo ⬇️', 'Leve o petisco lentamente em direção ao chão, entre as patas.', 3),
  ('b1000000-0000-0000-0000-000000000002', 4, 'Espere deitar 🕐', 'Ele vai seguir com o focinho e naturalmente deitar.', 4),
  ('b1000000-0000-0000-0000-000000000002', 5, 'Marque e recompense ⭐', 'Diga "SIM!" e dê o petisco assim que deitar.', 5),
  ('b1000000-0000-0000-0000-000000000002', 6, 'Repita várias vezes 🔄', 'Faça 5-8 repetições por sessão.', 6),
  ('b1000000-0000-0000-0000-000000000002', 7, 'Adicione "DEITA" 🗣️', 'Diga o comando antes do movimento.', 7),
  ('b1000000-0000-0000-0000-000000000002', 8, 'Reduza o gesto 🤏', 'Gradualmente diminua o movimento da mão.', 8),
  ('b1000000-0000-0000-0000-000000000002', 9, 'Generalize 🌍', 'Pratique em diferentes ambientes.', 9),
  ('b1000000-0000-0000-0000-000000000002', 10, 'Missão cumprida! 🏆', 'Seu cão dominou o deitar! Continue praticando.', 10);

-- SEED: Steps for "Dar a Pata"
INSERT INTO public.training_steps (training_id, step_number, title, description, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000003', 1, 'Peça para sentar 🐕', 'Comece com o cão sentado à sua frente.', 1),
  ('b1000000-0000-0000-0000-000000000003', 2, 'Petisco na mão fechada ✊', 'Feche o punho com um petisco dentro e apresente.', 2),
  ('b1000000-0000-0000-0000-000000000003', 3, 'Espere a pata 🐾', 'Ele vai tentar com o focinho e depois com a pata!', 3),
  ('b1000000-0000-0000-0000-000000000003', 4, 'Marque o toque ✅', 'Quando a pata tocar sua mão, diga "SIM!" e abra a mão.', 4),
  ('b1000000-0000-0000-0000-000000000003', 5, 'Repita 🔄', 'Faça 5 repetições por sessão.', 5),
  ('b1000000-0000-0000-0000-000000000003', 6, 'Adicione "PATA" 🗣️', 'Diga o comando e estenda a mão aberta.', 6),
  ('b1000000-0000-0000-0000-000000000003', 7, 'Mão aberta 🖐️', 'Estenda a mão aberta sem petisco visível.', 7),
  ('b1000000-0000-0000-0000-000000000003', 8, 'Alterne as patas 🔀', 'Tente ensinar "outra pata" com a outra mão.', 8),
  ('b1000000-0000-0000-0000-000000000003', 9, 'Com diferentes pessoas 👥', 'Peça que outros membros da família pratiquem.', 9),
  ('b1000000-0000-0000-0000-000000000003', 10, 'Expert em pata! 🎉', 'Seu cão adora dar a pata! Truque favorito de todos.', 10);

-- Generic steps for remaining trainings
INSERT INTO public.training_steps (training_id, step_number, title, description, sort_order)
SELECT t.id, s.n, 
  CASE s.n
    WHEN 1 THEN 'Preparação 📋'
    WHEN 2 THEN 'Ambiente ideal 🏠'
    WHEN 3 THEN 'Primeiro passo 👣'
    WHEN 4 THEN 'Reforço positivo 🦴'
    WHEN 5 THEN 'Repetição 🔄'
    WHEN 6 THEN 'Aumente o desafio 📈'
    WHEN 7 THEN 'Adicione o comando 🗣️'
    WHEN 8 THEN 'Generalize 🌍'
    WHEN 9 THEN 'Consistência 💪'
    WHEN 10 THEN 'Parabéns! 🎉'
  END,
  CASE s.n
    WHEN 1 THEN 'Prepare petiscos e escolha um local calmo para começar.'
    WHEN 2 THEN 'Certifique-se de que o ambiente está sem distrações.'
    WHEN 3 THEN 'Mostre ao cão o que você espera, usando petiscos como guia.'
    WHEN 4 THEN 'Recompense imediatamente quando ele acertar. Timing é tudo!'
    WHEN 5 THEN 'Repita 5-8 vezes por sessão, com pausas curtas.'
    WHEN 6 THEN 'Aumente gradualmente a dificuldade e duração.'
    WHEN 7 THEN 'Associe um comando verbal claro ao comportamento.'
    WHEN 8 THEN 'Pratique em diferentes ambientes e situações.'
    WHEN 9 THEN 'Seja consistente. Pratique 2-3 vezes por dia.'
    WHEN 10 THEN 'Excelente trabalho! Seu cão está evoluindo muito. Continue praticando!'
  END,
  s.n
FROM public.trainings t
CROSS JOIN generate_series(1, 10) AS s(n)
WHERE t.id NOT IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003'
);

-- SEED: Achievements
INSERT INTO public.achievements (name, description, emoji, condition_type, condition_value) VALUES
  ('Primeiro Treino', 'Complete seu primeiro treino', '🌟', 'trainings_completed', 1),
  ('Dedicado', 'Complete 5 treinos', '💪', 'trainings_completed', 5),
  ('Sequência de 3', 'Mantenha 3 dias seguidos', '🔥', 'streak', 3),
  ('Sequência de 7', 'Mantenha 7 dias seguidos', '🌈', 'streak', 7),
  ('Aprendiz', 'Alcance o nível Aprendiz', '📚', 'level', 200),
  ('Esperto', 'Alcance o nível Esperto', '🧠', 'level', 500),
  ('Mestre', 'Alcance o nível Mestre', '🏆', 'level', 1000);
