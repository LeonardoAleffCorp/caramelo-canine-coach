import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mascotImg from '@/assets/caramelo-mascot.png';
import { Check, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Mensal',
    price: 'R$ 30,00',
    period: '/mês',
    highlight: false,
    features: ['Todos os treinos', 'Cartão de vacina', 'Acompanhamento de peso'],
  },
  {
    name: 'Semestral',
    price: 'R$ 124,90',
    period: '/6 meses',
    highlight: true,
    badge: 'Mais popular 🔥',
    features: ['Tudo do mensal', 'Economia de 30%', 'Suporte prioritário'],
  },
  {
    name: 'Anual',
    price: 'R$ 149,90',
    period: '/ano',
    highlight: false,
    badge: 'Melhor custo',
    features: ['Tudo do semestral', 'Economia de 58%', 'Conteúdo exclusivo'],
  },
];

export default function Plans() {
  const navigate = useNavigate();

  const handleSelect = (planName: string) => {
    // For now just navigate to home
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col px-5 py-8 bg-gradient-to-b from-primary/10 to-background">
      <div className="mb-6 text-center">
        <img
          src={mascotImg}
          alt="Caramelo"
          className="mx-auto h-20 w-20 rounded-full"
        />
        <h1 className="mt-3 text-2xl font-extrabold text-foreground flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-primary" />
          Escolha seu plano
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Desbloqueie todo o potencial do Caramelo!
        </p>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <button
            key={plan.name}
            onClick={() => handleSelect(plan.name)}
            className={`relative w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] ${
              plan.highlight
                ? 'border-2 border-primary bg-accent shadow-md'
                : 'border border-border bg-card shadow-sm'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                {plan.badge}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <div className="mt-1 text-sm font-bold text-foreground">{plan.name}</div>
            <div className="mt-3 space-y-1.5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-secondary" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 text-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Continuar gratuitamente →
      </button>
    </div>
  );
}
