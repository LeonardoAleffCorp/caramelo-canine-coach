import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import mascotImg from '@/assets/caramelo-mascot.png';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Bem-vindo de volta! 🐕');
      } else {
        await signUp(email, password, fullName);
        toast.success('Conta criada! 🎉');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mb-6 text-center">
        <img src={mascotImg} alt="Caramelo" className="mx-auto h-28 w-28 animate-bounce-in rounded-full shadow-lg" />
        <h1 className="mt-4 text-3xl font-extrabold text-foreground">Boas Vindas ao Caramelo</h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Seu app de saúde e treinamento de cachorros 🐾 Aqui encontrará um ótimo app para gestão geral da vida do seu pet tão amado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        {!isLogin && (
          <Input placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} className="h-12 rounded-xl bg-card text-base" />
        )}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-card text-base" />
        <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl bg-card text-base" />
        <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-lg font-bold">
          {loading ? '...' : isLogin ? 'Entrar 🚀' : 'Criar conta 🎯'}
        </Button>
      </form>

      {isLogin && (
        <a href="/forgot-password" className="mt-3 text-sm font-medium text-muted-foreground hover:text-primary hover:underline">
          Esqueci minha senha 🔑
        </a>
      )}

      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-sm font-medium text-primary hover:underline">
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
      </button>
    </div>
  );
}
