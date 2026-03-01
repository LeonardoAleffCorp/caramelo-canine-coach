import { useEffect, useState } from 'react';
import mascotImg from '@/assets/caramelo-mascot.png';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(onFinish, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src={mascotImg}
        alt="Caramelo mascot"
        className="h-40 w-40 animate-bounce-in rounded-full"
      />
      <h1 className="mt-4 text-3xl font-extrabold text-primary-foreground animate-slide-up">
        Caramelo
      </h1>
      <p className="mt-1 text-sm font-semibold text-primary-foreground/80 animate-slide-up">
        Treino & Saúde 🐾
      </p>
      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary-foreground/60 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
