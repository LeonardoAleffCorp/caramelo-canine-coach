import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState as useStateEffect } from 'react';

type OnboardingStep = 'welcome' | 'briefing' | 'vaccine' | 'routine' | 'puppy-adult' | 'pet-setup' | 'paywall';

export default function OnboardingNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPet } = usePets();
  const [step, setStep] = useState<OnboardingStep>('welcome');

  // Pet form state
  const [petName, setPetName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [breedSearch, setBreedSearch] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [customBreed, setCustomBreed] = useState('');
  const [isPuppy, setIsPuppy] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<any[]>([]);

  // Load breeds
  useStateEffect(() => {
    supabase.from('breeds').select('*').then(({ data }) => {
      if (data) {
        setBreeds(data);
        setFilteredBreeds(data);
      }
    });
  }, []);

  // Filter breeds on search
  const handleBreedSearch = (query: string) => {
    setBreedSearch(query);
    if (query === '') {
      setFilteredBreeds(breeds);
    } else {
      setFilteredBreeds(
        breeds.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  const handleCreatePet = async () => {
    if (!petName || !birthDate) {
      alert('Preencha nome e data de nascimento');
      return;
    }

    const breedId = selectedBreed;
    const finalBreed = breedId || customBreed;

    if (!finalBreed) {
      alert('Selecione ou escreva uma raça');
      return;
    }

    // Upload picture if exists
    let pictureUrl = null;
    if (profilePicture) {
      const fileName = `${user?.id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from('pet_pictures')
        .upload(fileName, profilePicture);

      if (!error) {
        const { data } = supabase.storage.from('pet_pictures').getPublicUrl(fileName);
        pictureUrl = data?.publicUrl;
      }
    }

    const newPet = await addPet({
      name: petName,
      breed_id: breedId,
      breed_custom: customBreed || undefined,
      birth_date: birthDate,
      profile_picture_url: pictureUrl,
      is_puppy: isPuppy,
    });

    if (newPet) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50">
      {/* STEP 1: Welcome */}
      {step === 'welcome' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <div className="text-9xl animate-bounce">🐕</div>
          <div>
            <h1 className="text-4xl font-extrabold text-orange-900">Bem-vindo ao Caramelo!</h1>
            <p className="mt-4 text-lg text-orange-700 leading-relaxed">
              Seu app de saúde e treinamento de cães. Aqui você encontrará um ótimo app para gestão geral da vida do seu pet tão amado.
            </p>
          </div>
          <Button
            onClick={() => setStep('briefing')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Vamos lá! <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 2: Briefing - Conteúdos */}
      {step === 'briefing' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <div className="text-7xl">🎾</div>
          <h2 className="text-3xl font-extrabold text-orange-900">Muito conteúdo esperando!</h2>
          <p className="text-center text-orange-700 max-w-md">
            Mais de 30 aulas de treinamento para você ensinar seu cão. Desde truques simples até comandos avançados.
          </p>
          <Button
            onClick={() => setStep('vaccine')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Próximo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 3: Vaccine Card */}
      {step === 'vaccine' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <div className="text-7xl">💉</div>
          <h2 className="text-3xl font-extrabold text-orange-900">Cartão de Vacinas Digital</h2>
          <p className="text-center text-orange-700 max-w-md">
            Guarde o histórico de vacinação do seu pet. Você pode visualizar e imprimir quando necessário.
          </p>
          <Button
            onClick={() => setStep('routine')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Próximo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 4: Routine & Bond */}
      {step === 'routine' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <div className="text-7xl">❤️</div>
          <h2 className="text-3xl font-extrabold text-orange-900">Crie uma Rotina</h2>
          <p className="text-center text-orange-700 max-w-md">
            Treinar regularmente deixa seu pet mais próximo de você. Você vai acompanhar cada progresso e criar hábitos saudáveis juntos.
          </p>
          <Button
            onClick={() => setStep('puppy-adult')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Próximo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 5: Puppy vs Adult */}
      {step === 'puppy-adult' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-3xl font-extrabold text-orange-900 text-center">Seu cachorro é filhote ou adulto?</h2>
          <p className="text-center text-orange-700">Isso vai personalizar os treinos para a idade do seu pet</p>

          <div className="flex w-full max-w-md gap-4">
            <Button
              variant={isPuppy ? 'default' : 'outline'}
              onClick={() => setIsPuppy(true)}
              size="lg"
              className="h-20 flex-1 rounded-2xl flex-col"
            >
              <div className="text-4xl">🐶</div>
              <span>Filhote</span>
            </Button>
            <Button
              variant={!isPuppy ? 'default' : 'outline'}
              onClick={() => setIsPuppy(false)}
              size="lg"
              className="h-20 flex-1 rounded-2xl flex-col"
            >
              <div className="text-4xl">🐕</div>
              <span>Adulto</span>
            </Button>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 max-w-md text-sm text-orange-800">
            {isPuppy ? (
              <p>Treinos curtos e divertidos para desenvolver coordenação motora e socialização.</p>
            ) : (
              <p>Treinos mais desafiadores para manter o condicionamento físico e mental.</p>
            )}
          </div>

          <Button
            onClick={() => setStep('pet-setup')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Próximo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 6: Pet Setup */}
      {step === 'pet-setup' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10">
          <h2 className="text-3xl font-extrabold text-orange-900">Dados do seu pet</h2>

          <div className="w-full max-w-md space-y-4">
            {/* Picture Upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <div className="h-32 w-32 rounded-full bg-orange-200 flex items-center justify-center text-5xl hover:bg-orange-300 transition">
                  {profilePicture ? '✅' : '📷'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <Input
              placeholder="Nome do cão"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="h-12 rounded-xl"
            />

            {/* Birth Date */}
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-12 rounded-xl"
            />

            {/* Breed Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar raça..."
                value={breedSearch}
                onChange={(e) => handleBreedSearch(e.target.value)}
                className="h-12 rounded-xl pl-10"
              />
            </div>

            {/* Breed Options */}
            {breedSearch && filteredBreeds.length > 0 && (
              <div className="max-h-40 overflow-y-auto bg-white rounded-xl border">
                {filteredBreeds.slice(0, 5).map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => {
                      setSelectedBreed(breed.id);
                      setBreedSearch('');
                      setCustomBreed('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-orange-50"
                  >
                    {breed.name}
                  </button>
                ))}
              </div>
            )}

            {/* Custom Breed */}
            {!selectedBreed && (
              <Input
                placeholder="Ou escreva uma raça customizada"
                value={customBreed}
                onChange={(e) => setCustomBreed(e.target.value)}
                className="h-12 rounded-xl"
              />
            )}

            {/* Selected Breed Display */}
            {selectedBreed && (
              <div className="bg-orange-100 rounded-xl p-3 text-center text-orange-900 font-bold">
                {breeds.find(b => b.id === selectedBreed)?.name}
              </div>
            )}
          </div>

          <Button
            onClick={() => setStep('paywall')}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold"
          >
            Próximo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* STEP 7: Paywall */}
      {step === 'paywall' && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10">
          <h2 className="text-3xl font-extrabold text-orange-900 text-center">Escolha seu plano</h2>

          <div className="w-full max-w-md space-y-3">
            {/* Monthly */}
            <button
              className="w-full rounded-2xl border-2 border-orange-300 bg-white p-4 text-left hover:bg-orange-50 transition"
            >
              <div className="text-lg font-bold text-orange-900">R$ 30/mês</div>
              <p className="text-sm text-orange-600">Acesso completo ao app</p>
            </button>

            {/* 6 Months (Best) */}
            <button
              className="w-full rounded-2xl border-2 border-orange-500 bg-gradient-to-r from-orange-200 to-yellow-100 p-4 text-left hover:from-orange-300 hover:to-yellow-200 transition ring-2 ring-orange-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-orange-900">R$ 124,90/6 meses</div>
                  <p className="text-sm text-orange-600">Melhor valor!</p>
                </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">-30%</div>
              </div>
            </button>

            {/* Annual */}
            <button
              className="w-full rounded-2xl border-2 border-orange-300 bg-white p-4 text-left hover:bg-orange-50 transition"
            >
              <div className="text-lg font-bold text-orange-900">R$ 149,90/ano</div>
              <p className="text-sm text-orange-600">Economize ainda mais</p>
            </button>
          </div>

          <Button
            onClick={handleCreatePet}
            size="lg"
            className="h-14 rounded-full px-8 text-base font-bold w-full max-w-md"
          >
            Entrar no Caramelo 🐕
          </Button>
        </div>
      )}

      {/* Navigation Dots */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-2">
        {(['welcome', 'briefing', 'vaccine', 'routine', 'puppy-adult', 'pet-setup', 'paywall'] as OnboardingStep[]).map((s) => (
          <div
            key={s}
            className={`h-2 w-2 rounded-full transition ${
              step === s ? 'bg-orange-600 w-8' : 'bg-orange-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
