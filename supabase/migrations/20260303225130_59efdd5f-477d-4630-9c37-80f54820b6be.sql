
-- Tutor profiles table (linked to user, not pet)
CREATE TABLE public.tutor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text,
  email text,
  phone text,
  address_street text,
  address_number text,
  address_neighborhood text,
  address_city text,
  address_state text,
  address_zip text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tutor profile" ON public.tutor_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tutor profile" ON public.tutor_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tutor profile" ON public.tutor_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Vet clinics table (linked to pet)
CREATE TABLE public.vet_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  clinic_name text,
  vet_name text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pet_id)
);

ALTER TABLE public.vet_clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vet clinics" ON public.vet_clinics FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vet_clinics.pet_id AND pets.owner_id = auth.uid()));
CREATE POLICY "Users can insert own vet clinics" ON public.vet_clinics FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = vet_clinics.pet_id AND pets.owner_id = auth.uid()));
CREATE POLICY "Users can update own vet clinics" ON public.vet_clinics FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vet_clinics.pet_id AND pets.owner_id = auth.uid()));

-- Indexes
CREATE INDEX idx_tutor_profiles_user_id ON public.tutor_profiles(user_id);
CREATE INDEX idx_vet_clinics_pet_id ON public.vet_clinics(pet_id);
