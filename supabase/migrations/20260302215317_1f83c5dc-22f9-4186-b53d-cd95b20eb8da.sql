
-- Table of predefined dog diseases
CREATE TABLE public.disease_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'geral',
  description text,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.disease_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read disease types" ON public.disease_types FOR SELECT USING (true);
CREATE POLICY "Users can insert custom disease types" ON public.disease_types FOR INSERT WITH CHECK (is_custom = true);

-- Pet diseases tracking
CREATE TABLE public.pet_diseases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  custom_description text,
  treatment_status text NOT NULL DEFAULT 'em_tratamento',
  treatment_start date,
  treatment_end date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pet_diseases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet diseases" ON public.pet_diseases FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_diseases.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can insert own pet diseases" ON public.pet_diseases FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_diseases.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can update own pet diseases" ON public.pet_diseases FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_diseases.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can delete own pet diseases" ON public.pet_diseases FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_diseases.pet_id AND pets.owner_id = auth.uid()));

-- Seed disease types
INSERT INTO public.disease_types (name, category) VALUES
-- Virais
('Cinomose', 'viral'),
('Parvovirose', 'viral'),
('Raiva', 'viral'),
('Hepatite Infecciosa Canina', 'viral'),
('Coronavirose', 'viral'),
('Parainfluenza Canina', 'viral'),
('Gripe Canina (Influenza)', 'viral'),
-- Bacterianas
('Leptospirose', 'bacteriana'),
('Erliquiose (Doença do Carrapato)', 'bacteriana'),
('Brucelose', 'bacteriana'),
('Piodermite', 'bacteriana'),
('Infecção Urinária', 'bacteriana'),
('Traqueobronquite (Tosse dos Canis)', 'bacteriana'),
-- Parasitárias / Pragas
('Leishmaniose', 'parasitária'),
('Babesiose', 'parasitária'),
('Giardíase', 'parasitária'),
('Verminoses', 'parasitária'),
('Sarna Demodécica', 'parasitária'),
('Sarna Sarcóptica', 'parasitária'),
('Pulgas (Infestação)', 'parasitária'),
('Carrapatos (Infestação)', 'parasitária'),
('Dirofilariose (Verme do Coração)', 'parasitária'),
-- Fúngicas
('Dermatofitose (Micose)', 'fúngica'),
('Malassezia', 'fúngica'),
-- Crônicas / Outras
('Displasia Coxofemoral', 'crônica'),
('Epilepsia', 'crônica'),
('Diabetes', 'crônica'),
('Hipotireoidismo', 'crônica'),
('Insuficiência Renal', 'crônica'),
('Insuficiência Cardíaca', 'crônica'),
('Doença Periodontal', 'crônica'),
('Otite', 'geral'),
('Alergia Alimentar', 'geral'),
('Alergia Dermatológica', 'geral'),
('Câncer / Tumor', 'geral'),
('Obesidade', 'geral'),
('Torção Gástrica', 'geral'),
('Catarata', 'geral'),
('Pancreatite', 'geral');
