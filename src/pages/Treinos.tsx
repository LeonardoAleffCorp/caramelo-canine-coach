import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import trainingSit from '@/assets/training-sit.png';
import trainingPaw from '@/assets/training-paw.png';
import trainingWalk from '@/assets/training-walk.png';
import trainingStay from '@/assets/training-stay.png';

const trainingImages: Record<string, string> = {
  'sentar': trainingSit, 'senta': trainingSit, 'pata': trainingPaw,
  'dar a pata': trainingPaw, 'deitar': trainingSit, 'ficar': trainingStay,
  'fica': trainingStay, 'passeio': trainingWalk, 'andar': trainingWalk, 'caminhar': trainingWalk,
};

function getTrainingImage(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, img] of Object.entries(trainingImages)) {
    if (lower.includes(key)) return img;
  }
  return null;
}

interface Category { id: string; name: string; emoji: string; }
interface Training { id: string; category_id: string; name: string; difficulty: number; duration_minutes: number; is_premium: boolean; }

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
    supabase.from('training_categories').select('*').order('sort_order').then(({ data }) => { if (data) setCategories(data); });
    supabase.from('trainings').select('*').order('sort_order').then(({ data }) => { if (data) setTrainings(data); });
  }, []);

  useEffect(() => {
    if (!pet) return;
    supabase.from('pet_trainings').select('training_id').eq('pet_id', pet.id).eq('completed', true)
      .then(({ data }) => { if (data) setCompletedIds(new Set(data.map((d: any) => d.training_id))); });
  }, [pet]);

  const filtered = selectedCat ? trainings.filter(t => t.category_id === selectedCat) : trainings;
  const difficultyStars = (d: number) => '⭐'.repeat(d);

  return (
    <Layout>
      <PageHeader title="Treinos 🎯" showBack={false} />
      <div className="px-5">
        <div className="mt-2 flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          <button onClick={() => setSelectedCat(null)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${!selectedCat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>Todos</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${selectedCat === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 pb-4">
          {filtered.map((t) => {
            const completed = completedIds.has(t.id);
            const cat = categories.find(c => c.id === t.category_id);
            const img = getTrainingImage(t.name);
            return (
              <button key={t.id} onClick={() => { if (t.is_premium) { setPremiumModal(true); return; } navigate(`/treino/${t.id}`); }}
                className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-transform active:scale-[0.98]">
                {img ? <img src={img} alt={t.name} className="h-14 w-14 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-2xl">{cat?.emoji || '🐕'}</span>}
                <div className="flex-1">
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground"><span>{difficultyStars(t.difficulty)}</span><span>•</span><span>{t.duration_minutes} min</span></div>
                </div>
                <span className="text-xl">{t.is_premium ? '🔒' : completed ? '✅' : '▶️'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={premiumModal} onOpenChange={setPremiumModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">⭐ Premium</DialogTitle>
            <DialogDescription className="text-center">Desbloqueie todos os treinos!<span className="block mt-2 text-2xl font-extrabold text-primary">A partir de R$ 30/mês</span></DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setPremiumModal(false); navigate('/planos'); }} className="rounded-xl">Ver planos</Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
