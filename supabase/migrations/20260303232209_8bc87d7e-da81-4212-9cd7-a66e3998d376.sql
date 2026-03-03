
-- Add DELETE policies for weight_logs
CREATE POLICY "Users can delete own weight logs"
ON public.weight_logs FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_logs.pet_id AND pets.owner_id = auth.uid()));

-- Add UPDATE policy for weight_logs
CREATE POLICY "Users can update own weight logs"
ON public.weight_logs FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_logs.pet_id AND pets.owner_id = auth.uid()));

-- Add DELETE policy for pet_trainings
CREATE POLICY "Users can delete own pet trainings"
ON public.pet_trainings FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_trainings.pet_id AND pets.owner_id = auth.uid()));

-- Add DELETE policy for vet_clinics
CREATE POLICY "Users can delete own vet clinics"
ON public.vet_clinics FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vet_clinics.pet_id AND pets.owner_id = auth.uid()));

-- Add DELETE policy for tutor_profiles
CREATE POLICY "Users can delete own tutor profile"
ON public.tutor_profiles FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Add UPDATE policy for pet_avatar
CREATE POLICY "Users can update own pet avatar"
ON public.pet_avatar FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = pet_avatar.pet_id AND pets.owner_id = auth.uid()));
