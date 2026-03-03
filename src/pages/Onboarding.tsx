import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePet } from '@/hooks/usePet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { logActivity } from '@/lib/activityLog';
import BreedPicker from '@/components/BreedPicker';
import PetPhotoUpload from '@/components/PetPhotoUpload';

import onboardingPlayImg from '@/assets/onboarding-play.png';
import onboardingVaccineImg from '@/assets/onboarding-vaccine.png';
import onboardingBondImg from '@/assets/onboarding-bond.png';
import mascotImg from '@/assets/caramelo-mascot.png';

const briefingSlides = [
  {
    image: onboardingPlayImg,
    title: '🎯 Treinos Interativos',
    description: 'Mais de 30 aulas passo-a-passo com conteúdo visual para treinar seu cão. Do básico ao avançado!',
  },
  {
    image: onboardingVaccineImg,
    title: '💉 Cartão de Vacina Digital',
    description: 'Controle completo das vacinas do seu pet com lembretes automáticos. Pode ser impresso a qualquer momento!',
  },
  {
    image: onboardingBondImg,
    title: '❤️ Mais Próximo do Seu Pet',
    description: 'Crie uma rotina de treino e acompanhamento. Fortaleça o vínculo e veja a evolução do seu melhor amigo!',
  },
];

type PetAge = 'filhote' | 'adulto';

const MIN_DATE = '2000-01-01';
const MAX_AGE_YEARS = 50;
const funnyOldDogMessages = [
  '🧓 Uau, seu cachorro é mais velho que a internet! Tem certeza dessa data?',
  '🦴 Esse cão conviveu com os dinossauros? Confere a data aí!',
  '👴 Com essa idade, ele já é patrimônio histórico! Será que não errou?',
  '🐕‍🦺 Cachorro imortal? Verifica essa data, humano!',
];

export default function Onboarding() {
  const { user } = useAuth();
  const { refreshPet } = usePet();
  const navigate = useNavigate();

  // Step: 0-2 = briefing slides, 3 = pet age choice, 4 = pet registration
  const [step, setStep] = useState(0);
  const [petAge, setPetAge] = useState<PetAge | null>(null);

  // Pet form
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateWarning, setBirthDateWarning] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const computeAgeMonths = useCallback((dateStr: string) => {
    if (!dateStr) return 12;
    const birth = new Date(dateStr);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return Math.max(1, months);
  }, []);

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    setBirthDateWarning('');
    if (!value) return;
    const birth = new Date(value);
    const now = new Date();
    const ageYears = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (ageYears > MAX_AGE_YEARS) {
      const msg = funnyOldDogMessages[Math.floor(Math.random() * funnyOldDogMessages.length)];
      setBirthDateWarning(msg);
    }
  };

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
        pet_id: pet.id,
        xp: 0,
        level: 'Filhote',
        current_streak: 0,
        longest_streak: 0,
      });

      // Save initial weight to weight_logs if provided
      if (weightKg) {
        await supabase.from('weight_logs').insert({
          pet_id: pet.id,
          weight_kg: parseFloat(weightKg),
        });
      }

      await refreshPet();
      logActivity('pet_created', { pet_name: name, breed: breed || 'Vira-lata/SRD' });
      toast.success(`${name} cadastrado! 🎉`);
      navigate('/planos');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  // Briefing slides (steps 0-2)
  if (step < 3) {
    const slide = briefingSlides[step];
    return (
      <div className="flex min-h-screen flex-col items-center justify-between px-6 py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <img
            src={slide.image}
            alt={slide.title}
            className="h-56 w-56 rounded-3xl object-cover shadow-md animate-bounce-in"
          />
          <h2 className="mt-8 text-2xl font-extrabold text-foreground">{slide.title}</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {slide.description}
          </p>
        </div>

        <div className="w-full max-w-sm">
          {/* Dots */}
          <div className="mb-6 flex justify-center gap-2">
            {briefingSlides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() => setStep(step + 1)}
            className="h-14 w-full rounded-2xl text-lg font-bold"
          >
            {step === 2 ? 'Vamos começar! 🚀' : 'Próximo →'}
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Pet age choice
  if (step === 3) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-primary/5 to-background">
        <img src={mascotImg} alt="Caramelo" className="h-32 w-32 rounded-full animate-bounce-in" />
        <h2 className="mt-6 text-2xl font-extrabold text-foreground text-center">
          Seu pet é filhote ou adulto?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
          Isso nos ajuda a personalizar os treinos ideais para a fase do seu cão!
        </p>

        <div className="mt-8 w-full max-w-sm space-y-3">
          <button
            onClick={() => { setPetAge('filhote'); setStep(4); }}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
              petAge === 'filhote' ? 'border-primary bg-accent' : 'border-border bg-card'
            }`}
          >
            <span className="text-4xl">🐶</span>
            <div>
              <div className="font-bold text-foreground text-lg">Filhote</div>
              <div className="text-xs text-muted-foreground">
                Até 1 ano. Treinos básicos de socialização, obediência e adaptação.
              </div>
            </div>
          </button>
          <button
            onClick={() => { setPetAge('adulto'); setStep(4); }}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
              petAge === 'adulto' ? 'border-primary bg-accent' : 'border-border bg-card'
            }`}
          >
            <span className="text-4xl">🐕</span>
            <div>
              <div className="font-bold text-foreground text-lg">Adulto</div>
              <div className="text-xs text-muted-foreground">
                Acima de 1 ano. Treinos avançados, comportamento e truques especiais.
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Pet registration
  return (
    <div className="flex min-h-screen flex-col px-6 py-8 bg-gradient-to-b from-primary/5 to-background">
      <button onClick={() => setStep(3)} className="mb-4 text-sm font-medium text-primary">
        ← Voltar
      </button>
      <div className="mb-6 flex flex-col items-center text-center">
        <PetPhotoUpload petId="onboarding" currentUrl={photoUrl} onUploaded={setPhotoUrl} />
        <h1 className="mt-3 text-2xl font-extrabold text-foreground">Cadastre seu cão</h1>
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

        <BreedPicker value={breed} onChange={setBreed} />

        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">
            Data de nascimento
          </label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            min={MIN_DATE}
            max={new Date().toISOString().split('T')[0]}
            className="h-12 rounded-xl bg-card text-base"
          />
          {birthDateWarning && (
            <p className="mt-1 text-xs font-bold text-amber-500 animate-bounce-in">
              {birthDateWarning}
            </p>
          )}
          {birthDate && !birthDateWarning && (
            <p className="mt-1 text-xs text-muted-foreground">
              ≈ {computeAgeMonths(birthDate)} meses de idade
            </p>
          )}
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

        <Button
          type="submit"
          disabled={loading || !name}
          className="mt-6 h-14 w-full rounded-2xl text-lg font-bold"
        >
          {loading ? '...' : 'Cadastrar e Continuar! 🎯'}
        </Button>
      </form>
    </div>
  );
}
