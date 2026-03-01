import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { getXpForDifficulty, getLevel } from '@/lib/xp';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Step {
  step_number: number;
  title: string;
  description: string;
}

interface Training {
  id: string;
  name: string;
  difficulty: number;
}

export default function TreinoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pet, stats, refreshStats, refreshPet } = usePet();
  const [training, setTraining] = useState<Training | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('trainings').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setTraining(data as Training);
    });
    supabase.from('training_steps').select('*').eq('training_id', id).order('sort_order')
      .then(({ data }) => {
        if (data) setSteps(data as Step[]);
      });
  }, [id]);

  const handleComplete = async (success: boolean) => {
    if (!pet || !training || !stats) return;

    const xpGain = success ? getXpForDifficulty(training.difficulty) : 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = stats.current_streak;
    if (success) {
      if (stats.last_training_date === yesterday) {
        newStreak = stats.current_streak + 1;
      } else if (stats.last_training_date !== today) {
        newStreak = 1;
      }
    }

    const newXp = stats.xp + xpGain;
    const newLevel = getLevel(newXp);

    // Update stats
    await supabase.from('pet_stats').update({
      xp: newXp,
      level: newLevel,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, stats.longest_streak),
      last_training_date: success ? today : stats.last_training_date,
    }).eq('pet_id', pet.id);

    // Record training
    await supabase.from('pet_trainings').upsert({
      pet_id: pet.id,
      training_id: training.id,
      completed: success,
      completed_at: success ? new Date().toISOString() : null,
      attempts: 1,
    }, { onConflict: 'pet_id,training_id' as any });

    if (success) {
      setConfetti(true);
      toast.success(`+${xpGain} XP! 🎉`);
      setTimeout(() => {
        setConfetti(false);
        refreshStats();
        navigate('/treinos');
      }, 2000);
    } else {
      toast('Continue praticando! 💪');
      refreshStats();
      navigate('/treinos');
    }
  };

  if (!training || steps.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl animate-bounce-in">🐕</div>
      </div>
    );
  }

  const isLast = current === steps.length - 1;
  const progressPercent = ((current + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-6">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <Progress value={progressPercent} className="h-2" />
        </div>
        <span className="text-xs font-bold text-muted-foreground">{current + 1}/{steps.length}</span>
      </div>

      {/* Step content */}
      {!showResult ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-6 text-7xl animate-bounce-in">
            {isLast ? '🎉' : '🐕'}
          </div>
          <h2 className="text-xl font-extrabold text-foreground">{steps[current].title}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {steps[current].description}
          </p>

          <div className="mt-auto flex w-full gap-3 pb-10 pt-8">
            {current > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrent(c => c - 1)}
                className="h-12 flex-1 rounded-xl"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
              </Button>
            )}
            <Button
              onClick={() => {
                if (isLast) setShowResult(true);
                else setCurrent(c => c + 1);
              }}
              className="h-12 flex-1 rounded-xl font-bold"
            >
              {isLast ? 'Finalizar' : 'Próximo'}
              {!isLast && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-4 text-7xl animate-bounce-in">🎯</div>
          <h2 className="text-xl font-extrabold text-foreground">Seu cão conseguiu?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Marque como concluído para ganhar XP!
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => handleComplete(false)}
              className="h-14 flex-1 rounded-xl text-base"
            >
              🔄 Praticar mais
            </Button>
            <Button
              onClick={() => handleComplete(true)}
              className="h-14 flex-1 rounded-xl text-base font-bold"
            >
              ✅ Sim!
            </Button>
          </div>
        </div>
      )}

      {/* Confetti */}
      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          {['🎉', '⭐', '🐕', '🎊', '✨', '🦴'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl animate-confetti"
              style={{
                left: `${15 + i * 14}%`,
                animationDelay: `${i * 0.1}s`,
                top: '50%',
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
