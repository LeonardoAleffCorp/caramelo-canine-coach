import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePet } from '@/hooks/usePet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import BreedPicker from '@/components/BreedPicker';
import PetPhotoUpload from '@/components/PetPhotoUpload';
import PageHeader from '@/components/PageHeader';
import Layout from '@/components/Layout';

export default function CadastrarPet() {
  const { user } = useAuth();
  const { refreshPet } = usePet();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const computeAgeMonths = useCallback((dateStr: string) => {
    if (!dateStr) return 12;
    const birth = new Date(dateStr);
    const now = new Date();
    return Math.max(1, (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth()));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const ageMonths = computeAgeMonths(birthDate);
      const { data: pet, error } = await supabase.from('pets').insert({
        owner_id: user.id,
        name,
        breed: breed || 'Vira-lata/SRD',
        age_months: ageMonths,
        birth_date: birthDate || null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        photo_url: photoUrl,
      }).select().single();
      if (error) throw error;

      await supabase.from('pet_stats').insert({
        pet_id: pet.id, xp: 0, level: 'Filhote', current_streak: 0, longest_streak: 0,
      });

      await refreshPet();
      toast.success(`${name} cadastrado! 🎉`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Novo Pet 🐶" />
      <div className="px-5 pb-8">
        <div className="flex justify-center mb-4">
          <PetPhotoUpload petId="new" currentUrl={photoUrl} onUploaded={setPhotoUrl} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Nome do cão</label>
            <Input placeholder="Ex: Rex, Luna..." value={name} onChange={e => setName(e.target.value)} required className="h-12 rounded-xl bg-card text-base" />
          </div>
          <BreedPicker value={breed} onChange={setBreed} />
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Data de nascimento</label>
            <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="h-12 rounded-xl bg-card text-base" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Peso (kg)</label>
            <Input type="number" placeholder="10" value={weightKg} onChange={e => setWeightKg(e.target.value)} step="0.1" min="0.5" max="100" className="h-12 rounded-xl bg-card text-base" />
          </div>
          <Button type="submit" disabled={loading || !name} className="mt-6 h-14 w-full rounded-2xl text-lg font-bold">
            {loading ? '...' : 'Cadastrar! 🎯'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
