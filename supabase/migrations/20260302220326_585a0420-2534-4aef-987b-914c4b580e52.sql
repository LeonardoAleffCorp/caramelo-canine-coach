
-- Create medications table
CREATE TABLE public.pet_medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency_hours INTEGER NOT NULL DEFAULT 8,
  treatment_start DATE NOT NULL DEFAULT CURRENT_DATE,
  treatment_end DATE,
  notes TEXT,
  treatment_status TEXT NOT NULL DEFAULT 'em_tratamento',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pet_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet medications"
ON public.pet_medications FOR SELECT
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_medications.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can insert own pet medications"
ON public.pet_medications FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_medications.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can update own pet medications"
ON public.pet_medications FOR UPDATE
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_medications.pet_id AND pets.owner_id = auth.uid()));

CREATE POLICY "Users can delete own pet medications"
ON public.pet_medications FOR DELETE
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_medications.pet_id AND pets.owner_id = auth.uid()));
