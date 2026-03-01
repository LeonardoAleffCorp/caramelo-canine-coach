import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { getLevel, getLevelEmoji, getLevelProgress, getNextLevelXp } from '@/lib/xp';
import { useSubscription } from '@/hooks/useSubscription';
import Layout from '@/components/Layout';
import PetSwitcher from '@/components/PetSwitcher';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { Progress } from '@/components/ui/progress';
import { getBreedDefaultImage } from '@/lib/breedImages';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface EquippedItem {
  category: string;
  emoji: string;
}

function formatAge(ageMonths: number, birthDate?: string | null): string {
  if (birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years > 0 && months > 0) return `${years}a ${months}m`;
    if (years > 0) return `${years} ano${years > 1 ? 's' : ''}`;
    return `${months} mes${months !== 1 ? 'es' : ''}`;
  }
  if (ageMonths >= 12) {
    const y = Math.floor(ageMonths / 12);
    const m = ageMonths % 12;
    if (m > 0) return `${y}a ${m}m`;
    return `${y} ano${y > 1 ? 's' : ''}`;
  }
  return `${ageMonths} mes${ageMonths !== 1 ? 'es' : ''}`;
}

export default function Home() {
  const { pet, stats } = usePet();
  const { daysLeft, isTrial } = useSubscription();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);

  useEffect(() => {
    supabase.from('training_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (!pet) return;
    const fetchEquipped = async () => {
      const { data: avatarData } = await supabase.from('pet_avatar').select('item_id').eq('pet_id', pet.id);
      if (!avatarData || avatarData.length === 0) { setEquippedItems([]); return; }
      const itemIds = avatarData.map((d: any) => d.item_id);
      const { data: itemsData } = await supabase.from('avatar_items').select('category, emoji').in('id', itemIds);
      if (itemsData) setEquippedItems(itemsData as EquippedItem[]);
    };
    fetchEquipped();
  }, [pet]);

  if (!pet || !stats) return null;

  const level = getLevel(stats.xp);
  const levelEmoji = getLevelEmoji(level);
  const progress = getLevelProgress(stats.xp);
  const nextXp = getNextLevelXp(stats.xp);
  const ageDisplay = formatAge(pet.age_months, (pet as any).birth_date);

  return (
    <Layout>
      <div className="px-5 pt-8">
        {/* Header with pet switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={pet.photo_url || getBreedDefaultImage(pet.breed)} 
              alt={pet.name} 
              className="h-12 w-12 rounded-full object-cover border-2 border-primary/20" 
            />
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Olá, {pet.name}!</h1>
              <p className="text-xs text-muted-foreground">{pet.breed} • {ageDisplay}</p>
            </div>
          </div>
          <PetSwitcher />
        </div>

        {/* Subscription badge */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent/50 px-3 py-1.5">
          <span className="text-sm">{isTrial ? '🎁' : '⭐'}</span>
          <span className="text-xs font-bold text-foreground">
            {isTrial ? 'Teste grátis' : 'Premium'} • {daysLeft} dia{daysLeft !== 1 ? 's' : ''} restante{daysLeft !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Streak + XP Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-accent p-4">
            <div className="text-3xl">🔥</div>
            <div className="mt-1 text-2xl font-extrabold text-accent-foreground">{stats.current_streak}</div>
            <div className="text-xs font-medium text-muted-foreground">dias seguidos</div>
          </div>
          <div className="rounded-2xl bg-verde-light p-4">
            <div className="text-3xl">{levelEmoji}</div>
            <div className="mt-1 text-lg font-extrabold text-foreground">{level}</div>
            <div className="text-xs font-medium text-muted-foreground">{stats.xp} XP</div>
            <Progress value={progress} className="mt-2 h-1.5" />
            <div className="mt-0.5 text-[10px] text-muted-foreground">{stats.xp}/{nextXp} XP</div>
          </div>
        </div>

        {/* Continue */}
        <button
          onClick={() => navigate('/treinos')}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-primary p-4 text-left transition-transform active:scale-[0.98]"
        >
          <span className="text-3xl">▶️</span>
          <div>
            <div className="font-bold text-primary-foreground">Continue treinando</div>
            <div className="text-xs text-primary-foreground/80">Evolua seu cão a cada dia!</div>
          </div>
        </button>

        {/* Categories */}
        <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Categorias</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/treinos?category=${cat.id}`)}
              className="flex min-w-[110px] flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm transition-transform active:scale-95"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Pet Avatar with stickers */}
        <div className="mt-4 mb-8 flex flex-col items-center">
          <PetAvatarPreview
            breed={pet.breed}
            equippedItems={equippedItems}
            size="lg"
          />
          <p className="mt-2 text-xs text-muted-foreground">Seu avatar com adesivos ✨</p>
        </div>
      </div>
    </Layout>
  );
}
