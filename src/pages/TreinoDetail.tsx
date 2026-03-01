import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { getXpForDifficulty, getLevel } from '@/lib/xp';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
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

type TrainingPhase = 'steps' | 'recording' | 'preview' | 'result';

export default function TreinoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pet, stats, refreshStats, refreshPet } = usePet();
  const [training, setTraining] = useState<Training | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [phase, setPhase] = useState<TrainingPhase>('steps');
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    isRecording,
    videoBlob,
    videoUrl,
    startRecording,
    stopRecording,
    resetVideo,
    error: recordingError,
  } = useVideoRecorder();
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

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

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast.success('Câmera ligada! Comece a treinar 🎥');
      setPhase('recording');
    } catch (err) {
      toast.error('Erro ao acessar câmera');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      toast.success('Vídeo gravado! 🎬');
      setPhase('preview');
    } catch (err) {
      toast.error('Erro ao parar gravação');
    }
  };

  const handleUploadAndComplete = async (success: boolean) => {
    if (!pet || !training || !stats) return;

    try {
      setIsUploading(true);

      // Upload video to Supabase Storage if exists
      let videoPath = null;
      if (videoBlob && success) {
        const fileName = `${pet.id}/${training.id}/${Date.now()}.webm`;
        const { error: uploadError } = await supabase.storage
          .from('training_videos')
          .upload(fileName, videoBlob);

        if (uploadError) {
          toast.error('Erro ao enviar vídeo');
          setIsUploading(false);
          return;
        }
        videoPath = fileName;
      }

      // Update stats
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

      await supabase.from('pet_stats').update({
        xp: newXp,
        level: newLevel,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, stats.longest_streak),
        last_training_date: success ? today : stats.last_training_date,
      }).eq('pet_id', pet.id);

      // Record training with video
      await supabase.from('pet_trainings').upsert({
        pet_id: pet.id,
        training_id: training.id,
        completed: success,
        completed_at: success ? new Date().toISOString() : null,
        video_path: videoPath,
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
    } catch (err) {
      toast.error('Erro ao salvar treino');
    } finally {
      setIsUploading(false);
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

  // PHASE 1: Instructions
  if (phase === 'steps') {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex items-center gap-3 px-4 pt-6">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <Progress value={progressPercent} className="h-2" />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{current + 1}/{steps.length}</span>
        </div>

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
                if (isLast) {
                  handleStartRecording();
                } else {
                  setCurrent(c => c + 1);
                }
              }}
              className="h-12 flex-1 rounded-xl font-bold"
            >
              {isLast ? '🎥 Gravar tentativa' : 'Próximo'}
              {!isLast && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2: Recording
  if (phase === 'recording') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-red-50 px-4">
        <div className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-pulse">🎥</div>
          </div>
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-white text-sm font-bold">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
              REC
            </div>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-foreground text-center">
          Sua câmera está ligada!
        </h1>
        <p className="text-center text-muted-foreground">
          Mostre seu cão fazendo o truque. Até 15 segundos.
        </p>
        <Button
          onClick={handleStopRecording}
          className="h-14 w-32 rounded-full text-base font-bold"
          size="lg"
        >
          <Pause className="mr-2 h-5 w-5" /> Parar
        </Button>
      </div>
    );
  }

  // PHASE 3: Preview
  if (phase === 'preview' && videoUrl) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex items-center justify-between px-4 pt-6">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-sm font-bold text-foreground">Preview do vídeo</h2>
          <div className="w-6" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
          <video
            ref={videoPreviewRef}
            src={videoUrl}
            controls
            className="h-auto w-full max-w-md rounded-2xl bg-black"
          />

          <div className="w-full max-w-md space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                resetVideo();
                setPhase('recording');
                handleStartRecording();
              }}
              className="h-12 w-full rounded-xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Gravar novamente
            </Button>
            <Button
              onClick={() => setPhase('result')}
              className="h-12 w-full rounded-xl font-bold"
            >
              ✅ Próximo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 4: Result (success/fail)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 text-7xl animate-bounce-in">🎯</div>
      <h2 className="text-xl font-extrabold text-foreground">Seu cão conseguiu?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Marque como concluído para ganhar XP!
      </p>
      <div className="mt-8 flex w-full gap-3">
        <Button
          variant="outline"
          onClick={() => handleUploadAndComplete(false)}
          disabled={isUploading}
          className="h-14 flex-1 rounded-xl text-base"
        >
          🔄 Praticar mais
        </Button>
        <Button
          onClick={() => handleUploadAndComplete(true)}
          disabled={isUploading}
          className="h-14 flex-1 rounded-xl text-base font-bold"
        >
          {isUploading ? '⏳ Salvando...' : '✅ Sim!'}
        </Button>
      </div>

      {recordingError && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {recordingError}
        </div>
      )}

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
