import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { getLevel, getLevelEmoji, getLevelProgress, getNextLevelXp } from '@/lib/xp';
import Layout from '@/components/Layout';
import { Progress } from '@/components/ui/progress';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export default function Home() {
  const { pet, stats } = usePet();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('training_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  if (!pet || !stats) return null;

  const level = getLevel(stats.xp);
  const levelEmoji = getLevelEmoji(level);
  const progress = getLevelProgress(stats.xp);
  const nextXp = getNextLevelXp(stats.xp);

  return (
    <Layout>
      <div className="px-5 pt-8">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-foreground">
          Olá, {pet.name}! 🐕
        </h1>
        <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age_months} meses</p>

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
      </div>
    </Layout>
  );
}
