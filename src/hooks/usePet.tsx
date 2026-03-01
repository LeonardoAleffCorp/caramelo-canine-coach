import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age_months: number;
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
  stats: PetStats | null;
  loading: boolean;
  hasPet: boolean;
  refreshPet: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPet = async () => {
    if (!user) { setPet(null); setStats(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('pets').select('*').eq('owner_id', user.id).limit(1).single();
    if (data) {
      setPet(data as Pet);
      const { data: s } = await supabase.from('pet_stats').select('*').eq('pet_id', data.id).single();
      setStats(s as PetStats | null);
    } else {
      setPet(null);
      setStats(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPet(); }, [user]);

  return (
    <PetContext.Provider value={{
      pet, stats, loading, hasPet: !!pet,
      refreshPet: fetchPet,
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
