import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePet } from '@/hooks/usePet';
import { getLevel, getLevelEmoji, getLevelProgress } from '@/lib/xp';
import { getLifeStage } from '@/lib/breedAge';
import Layout from '@/components/Layout';
import PetPhotoUpload from '@/components/PetPhotoUpload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LogOut } from 'lucide-react';
import { getBreedDefaultImage } from '@/lib/breedImages';
import { toast } from 'sonner';
import { logActivity } from '@/lib/activityLog';

interface Achievement {
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}

export default function Perfil() {
  const { signOut } = useAuth();
  const { pet, stats, refreshPet } = usePet();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!pet) return;
    const fetchAchievements = async () => {
      const [{ data: all }, { data: unlocked }, { data: trainings }] = await Promise.all([
        supabase.from('achievements').select('*'),
        supabase.from('pet_achievements').select('achievement_id').eq('pet_id', pet.id),
        supabase.from('pet_trainings').select('id').eq('pet_id', pet.id).eq('completed', true),
      ]);
      const unlockedIds = new Set((unlocked || []).map((u: any) => u.achievement_id));
      setAchievements((all || []).map((a: any) => ({
        name: a.name, emoji: a.emoji, description: a.description, unlocked: unlockedIds.has(a.id),
      })));
      setCompletedCount(trainings?.length || 0);
    };
    fetchAchievements();
  }, [pet]);

  if (!pet || !stats) return null;

  const level = getLevel(stats.xp);
  const levelEmoji = getLevelEmoji(level);
  const progress = getLevelProgress(stats.xp);

  const handlePhotoUploaded = async (url: string) => {
    await supabase.from('pets').update({ photo_url: url }).eq('id', pet.id);
    await refreshPet();
    logActivity('photo_uploaded', { pet_id: pet.id });
  };

  const handlePhotoDeleted = async () => {
    await supabase.from('pets').update({ photo_url: null }).eq('id', pet.id);
    await refreshPet();
    toast.success('Foto removida! Voltando ao padrão da raça 🐕');
  };

  const formatAge = () => {
    if (pet.birth_date) {
      const birth = new Date(pet.birth_date);
      const now = new Date();
      const m = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      const y = Math.floor(m / 12);
      const rm = m % 12;
      if (y > 0 && rm > 0) return `${y}a ${rm}m`;
      if (y > 0) return `${y} ano${y > 1 ? 's' : ''}`;
      return `${m} mes${m !== 1 ? 'es' : ''}`;
    }
    return `${pet.age_months} meses`;
  };

  const ageMonths = pet.birth_date
    ? Math.max(1, (new Date().getFullYear() - new Date(pet.birth_date).getFullYear()) * 12 + (new Date().getMonth() - new Date(pet.birth_date).getMonth()))
    : pet.age_months;
  const lifeStage = getLifeStage(ageMonths, pet.breed);

  return (
    <Layout>
      <div className="px-5 pt-8">
        <div className="flex flex-col items-center text-center">
          <PetPhotoUpload
            petId={pet.id}
            currentUrl={pet.photo_url || getBreedDefaultImage(pet.breed)}
            onUploaded={handlePhotoUploaded}
            onDeleted={handlePhotoDeleted}
            showDelete={!!pet.photo_url}
          />
          <h1 className="mt-3 text-2xl font-extrabold text-foreground">{pet.name}</h1>
          <p className="text-sm text-muted-foreground">{pet.breed} • {formatAge()}</p>
          <div className={`mt-1 flex items-center gap-1 text-sm font-bold ${lifeStage.color}`}>
            <span>{lifeStage.emoji}</span>
            <span>{lifeStage.stage}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-accent p-4 text-center">
            {pet.photo_url ? (
              <div className="text-2xl">{levelEmoji}</div>
            ) : (
              <div className="flex justify-center mb-1">
                <img src={getBreedDefaultImage(pet.breed)} alt="Avatar" className="h-12 w-12 object-contain" />
              </div>
            )}
            <div className="mt-1 text-sm font-bold text-foreground">{lifeStage.stage}</div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>
          <div className="rounded-2xl bg-verde-light p-4 text-center">
            <div className="text-2xl font-extrabold text-foreground">{stats.xp}</div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-foreground">{completedCount}</div>
            <div className="text-xs text-muted-foreground">Treinos</div>
          </div>
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-foreground">🔥 {stats.current_streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Achievements */}
        <h2 className="mb-3 mt-8 text-lg font-bold text-foreground">Conquistas 🏅</h2>
        <div className="space-y-2 pb-4">
          {achievements.map((a) => (
            <div key={a.name} className={`flex items-center gap-3 rounded-2xl p-4 ${a.unlocked ? 'bg-accent' : 'bg-muted opacity-50'}`}>
              <span className="text-2xl">{a.emoji}</span>
              <div>
                <div className="font-bold text-foreground">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.description}</div>
              </div>
              {a.unlocked && <span className="ml-auto text-lg">✅</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 pb-8">
          <Button variant="outline" onClick={() => { logActivity('logout'); signOut(); }} className="w-full rounded-xl">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>
    </Layout>
  );
}
