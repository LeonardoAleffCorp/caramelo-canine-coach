import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getWeightStatus, type WeightStatus } from '@/lib/weight';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age_months: number;
  birth_date: string | null;
  weight_kg: number | null;
  photo_url: string | null;
}

interface PetStats {
  xp: number;
  level: string;
  current_streak: number;
  longest_streak: number;
  last_training_date: string | null;
}

interface PetContextType {
  pet: Pet | null;
  pets: Pet[];
  stats: PetStats | null;
  loading: boolean;
  hasPet: boolean;
  selectedPetId: string | null;
  selectPet: (id: string) => void;
  refreshPet: () => Promise<void>;
  refreshStats: () => Promise<void>;
  weightStatus: WeightStatus | null;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [weightStatus, setWeightStatus] = useState<WeightStatus | null>(null);

  const pet = pets.find(p => p.id === selectedPetId) || null;

  const computeWeightStatus = useCallback(async (activePet: Pet | null) => {
    if (!activePet || !activePet.weight_kg) {
      setWeightStatus(null);
      return;
    }
    const { data: breed } = await supabase.from('breeds').select('size_category').eq('name', activePet.breed).maybeSingle();
    const size = breed?.size_category || 'médio';
    setWeightStatus(getWeightStatus(Number(activePet.weight_kg), size));
  }, []);

  const fetchPets = useCallback(async () => {
    if (!user) { setPets([]); setSelectedPetId(null); setStats(null); setWeightStatus(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('pets').select('*').eq('owner_id', user.id).order('created_at');
    const allPets = (data || []) as Pet[];
    setPets(allPets);

    const currentSelected = allPets.find(p => p.id === selectedPetId);
    const activePetId = currentSelected ? currentSelected.id : allPets[0]?.id || null;
    setSelectedPetId(activePetId);

    const activePet = allPets.find(p => p.id === activePetId) || null;

    if (activePetId) {
      const { data: s } = await supabase.from('pet_stats').select('*').eq('pet_id', activePetId).single();
      setStats(s as PetStats | null);
    } else {
      setStats(null);
    }

    await computeWeightStatus(activePet);
    setLoading(false);
  }, [user, selectedPetId, computeWeightStatus]);

  const selectPet = useCallback(async (id: string) => {
    setSelectedPetId(id);
    const { data: s } = await supabase.from('pet_stats').select('*').eq('pet_id', id).single();
    setStats(s as PetStats | null);
    // Recompute weight for newly selected pet
    const selectedPet = pets.find(p => p.id === id) || null;
    await computeWeightStatus(selectedPet);
  }, [pets, computeWeightStatus]);

  useEffect(() => { fetchPets(); }, [user]);

  return (
    <PetContext.Provider value={{
      pet, pets, stats, loading, hasPet: pets.length > 0,
      selectedPetId, selectPet,
      weightStatus,
      refreshPet: fetchPets,
      refreshStats: async () => {
        if (!pet) return;
        const { data } = await supabase.from('pet_stats').select('*').eq('pet_id', pet.id).single();
        setStats(data as PetStats | null);
      }
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be inside PetProvider');
  return ctx;
}
