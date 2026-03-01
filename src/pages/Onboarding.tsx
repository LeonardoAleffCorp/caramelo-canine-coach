import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePet } from '@/hooks/usePet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const breeds = [
  'Vira-lata/SRD', 'Labrador', 'Golden Retriever', 'Bulldog', 'Poodle',
  'Pastor Alemão', 'Shih Tzu', 'Yorkshire', 'Pinscher', 'Rottweiler',
  'Beagle', 'Husky Siberiano', 'Border Collie', 'Pitbull', 'Dachshund',
  'Maltês', 'Lhasa Apso', 'Chow Chow', 'Akita', 'Outro',
];

export default function Onboarding() {
  const { user } = useAuth();
  const { refreshPet } = usePet();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Vira-lata/SRD');
  const [ageMonths, setAgeMonths] = useState('12');
  const [weightKg, setWeightKg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data: pet, error } = await supabase.from('pets').insert({
        owner_id: user.id,
        name,
        breed,
        age_months: parseInt(ageMonths) || 12,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
      }).select().single();
      if (error) throw error;

      await supabase.from('pet_stats').insert({
        pet_id: pet.id,
        xp: 0,
        level: 'Filhote',
        current_streak: 0,
        longest_streak: 0,
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
    <div className="flex min-h-screen flex-col px-6 py-12">
      <div className="mb-8 text-center">
        <div className="mb-3 text-6xl">🐕</div>
        <h1 className="text-2xl font-extrabold text-foreground">Cadastre seu cão</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vamos conhecer seu melhor amigo!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Nome do cão</label>
          <Input
            placeholder="Ex: Rex, Luna, Caramelo..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12 rounded-xl bg-card text-base"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Raça</label>
          <Select value={breed} onValueChange={setBreed}>
            <SelectTrigger className="h-12 rounded-xl bg-card text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {breeds.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Idade (meses)</label>
            <Input
              type="number"
              placeholder="12"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              min="1"
              max="240"
              className="h-12 rounded-xl bg-card text-base"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-foreground">Peso (kg)</label>
            <Input
              type="number"
              placeholder="10"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              step="0.1"
              min="0.5"
              max="100"
              className="h-12 rounded-xl bg-card text-base"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !name}
          className="mt-6 h-14 w-full rounded-2xl text-lg font-bold"
        >
          {loading ? '...' : 'Começar! 🎯'}
        </Button>
      </form>
    </div>
  );
}
