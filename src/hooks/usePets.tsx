import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed_id?: string;
  breed_custom?: string;
  birth_date: string;
  profile_picture_url?: string;
  is_puppy: boolean;
  created_at: string;
}

export interface PetStats {
  pet_id: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_training_date?: string;
}

export interface PetsContextType {
  pets: Pet[];
  currentPet: Pet | null;
  stats: PetStats | null;
  selectPet: (petId: string) => void;
  addPet: (pet: Omit<Pet, 'id' | 'user_id' | 'created_at'>) => Promise<Pet | null>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
  refreshStats: () => Promise<void>;
  loading: boolean;
}

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export function PetsProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load pets
  useEffect(() => {
    if (!user) return;

    const loadPets = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (!error && data && data.length > 0) {
        setPets(data as Pet[]);
        setCurrentPet(data[0] as Pet);
        await loadStats(data[0].id);
      }
      setLoading(false);
    };

    loadPets();
  }, [user]);

  const loadStats = async (petId: string) => {
    const { data, error } = await supabase
      .from('pet_stats')
      .select('*')
      .eq('pet_id', petId)
      .single();

    if (data) {
      setStats(data);
    }
  };

  const selectPet = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setCurrentPet(pet);
      loadStats(petId);
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...petData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const newPet = data as Pet;

      // Create pet stats
      await supabase.from('pet_stats').insert([{ pet_id: newPet.id }]);

      setPets([...pets, newPet]);
      setCurrentPet(newPet);
      await loadStats(newPet.id);

      return newPet;
    } catch (err) {
      console.error('Error adding pet:', err);
      return null;
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    try {
      await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId);

      const updated = pets.map(p => (p.id === petId ? { ...p, ...updates } : p));
      setPets(updated);

      if (currentPet?.id === petId) {
        setCurrentPet({ ...currentPet, ...updates });
      }
    } catch (err) {
      console.error('Error updating pet:', err);
    }
  };

  const deletePet = async (petId: string) => {
    try {
      await supabase.from('pets').delete().eq('id', petId);

      const updated = pets.filter(p => p.id !== petId);
      setPets(updated);

      if (currentPet?.id === petId) {
        setCurrentPet(updated[0] || null);
      }
    } catch (err) {
      console.error('Error deleting pet:', err);
    }
  };

  const refreshStats = async () => {
    if (currentPet) {
      await loadStats(currentPet.id);
    }
  };

  return (
    <PetsContext.Provider
      value={{
        pets,
        currentPet,
        stats,
        selectPet,
        addPet,
        updatePet,
        deletePet,
        refreshStats,
        loading,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetsContext);
  if (!context) {
    throw new Error('usePets must be used within PetsProvider');
  }
  return context;
}
