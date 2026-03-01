import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Category { id: string; name: string; emoji: string; }
interface Training {
  id: string; category_id: string; name: string;
  difficulty: number; duration_minutes: number;
  is_premium: boolean;
}

export default function Treinos() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const navigate = useNavigate();
  const { pet } = usePet();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedCat, setSelectedCat] = useState<string | null>(categoryFilter);
  const [premiumModal, setPremiumModal] = useState(false);

  useEffect(() => {
    supabase.from('training_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
    supabase.from('trainings').select('*').order('sort_order').then(({ data }) => {
      if (data) setTrainings(data);
    });
  }, []);

  useEffect(() => {
    if (!pet) return;
    supabase.from('pet_trainings').select('training_id').eq('pet_id', pet.id).eq('completed', true)
      .then(({ data }) => {
        if (data) setCompletedIds(new Set(data.map((d: any) => d.training_id)));
      });
  }, [pet]);

  const filtered = selectedCat ? trainings.filter(t => t.category_id === selectedCat) : trainings;

  const difficultyStars = (d: number) => '⭐'.repeat(d);

  return (
    <Layout>
      <div className="px-5 pt-8">
        <h1 className="text-2xl font-extrabold text-foreground">Treinos 🎯</h1>

        {/* Category filter */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          <button
            onClick={() => setSelectedCat(null)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              !selectedCat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                selectedCat === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Training list */}
        <div className="mt-4 space-y-3 pb-4">
          {filtered.map((t) => {
            const completed = completedIds.has(t.id);
            const cat = categories.find(c => c.id === t.category_id);
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (t.is_premium) { setPremiumModal(true); return; }
                  navigate(`/treino/${t.id}`);
                }}
                className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-transform active:scale-[0.98]"
              >
                <span className="text-3xl">{cat?.emoji || '🐕'}</span>
                <div className="flex-1">
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{difficultyStars(t.difficulty)}</span>
                    <span>•</span>
                    <span>{t.duration_minutes} min</span>
                  </div>
                </div>
                <span className="text-xl">
                  {t.is_premium ? '🔒' : completed ? '✅' : '▶️'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={premiumModal} onOpenChange={setPremiumModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">⭐ Premium</DialogTitle>
            <DialogDescription className="text-center">
              Desbloqueie todos os treinos e funcionalidades avançadas por apenas
              <span className="block mt-2 text-2xl font-extrabold text-primary">R$ 14,90/mês</span>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setPremiumModal(false)} className="rounded-xl">
            Em breve!
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
