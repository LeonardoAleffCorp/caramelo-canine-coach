import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePets } from '@/hooks/usePets';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Lock, Zap } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface Training {
  id: string;
  category_id: string;
  name: string;
  description: string;
  difficulty: number;
  duration_minutes: number;
  is_premium: boolean;
  puppy_only: boolean;
  adult_only: boolean;
  image_url: string;
}

const DIFFICULTY_STARS = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
const XP_VALUES = [10, 25, 50, 100, 150];

export default function TreinosNew() {
  const navigate = useNavigate();
  const { currentPet } = usePets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('training_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) {
        setCategories(data);
        setSelectedCat(data[0]?.id || null);
      }
    });

    supabase.from('trainings').select('*').order('sort_order').then(({ data }) => {
      if (data) setTrainings(data as Training[]);
    });
  }, []);

  useEffect(() => {
    if (!currentPet) return;
    supabase
      .from('pet_trainings')
      .select('training_id')
      .eq('pet_id', currentPet.id)
      .eq('completed', true)
      .then(({ data }) => {
        if (data) setCompletedIds(new Set(data.map((d: any) => d.training_id)));
      });
  }, [currentPet]);

  // Filter trainings by category and pet age
  const filtered = trainings.filter(t => {
    if (selectedCat && t.category_id !== selectedCat) return false;
    if (currentPet?.is_puppy && t.adult_only) return false;
    if (!currentPet?.is_puppy && t.puppy_only) return false;
    return true;
  });

  return (
    <Layout>
      <div className="px-5 pt-8 pb-20">
        <h1 className="text-3xl font-extrabold text-foreground">Treinos 🎯</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha um treino e comece a ganhar XP!
        </p>

        {/* Category filter - Horizontal scroll */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSelectedCat(null)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all ${
              !selectedCat
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all ${
                selectedCat === cat.id
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Training grid */}
        <div className="mt-8 grid grid-cols-1 gap-5">
          {filtered.map((training) => {
            const completed = completedIds.has(training.id);
            const xpValue = XP_VALUES[Math.min(training.difficulty - 1, 4)];
            const isPremium = training.is_premium;

            return (
              <button
                key={training.id}
                onClick={() => !isPremium && navigate(`/treino/${training.id}`)}
                className={`relative overflow-hidden rounded-3xl transition-all transform hover:scale-102 ${
                  completed ? 'opacity-60' : isPremium ? 'cursor-not-allowed opacity-80' : 'hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-75"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 179, 8, 0.8)), url('${training.image_url}')`,
                  }}
                />

                {/* Content */}
                <div className="relative p-5 text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-white">{training.name}</h3>
                      <p className="text-sm text-orange-100 mt-1 line-clamp-1">
                        {training.description}
                      </p>

                      {/* Stats */}
                      <div className="mt-3 flex gap-3 text-xs">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-white font-bold">
                          {DIFFICULTY_STARS[training.difficulty - 1]}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-white font-bold flex items-center gap-1">
                          <Zap className="h-3 w-3" /> +{xpValue} XP
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-white font-bold">
                          {training.duration_minutes}min
                        </span>
                      </div>
                    </div>

                    {/* Right badge */}
                    <div className="ml-3">
                      {completed && (
                        <div className="text-4xl animate-bounce">✅</div>
                      )}
                      {isPremium && !completed && (
                        <div className="flex items-center justify-center w-12 h-12 bg-amber-400 rounded-full">
                          <Lock className="h-6 w-6 text-white font-bold" />
                        </div>
                      )}
                      {!isPremium && !completed && (
                        <div className="text-3xl animate-pulse">▶️</div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <div className="text-6xl mb-4">🐕</div>
            <p className="text-muted-foreground">Nenhum treino disponível para seu pet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
