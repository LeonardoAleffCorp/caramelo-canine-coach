import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <div className="mb-4 text-7xl animate-bounce-in">🐕</div>
        <h1 className="text-3xl font-extrabold text-foreground">Caramelo</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">Treino e Saúde</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {!isLogin && (
          <Input
            placeholder="Seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required={!isLogin}
            className="h-12 rounded-xl bg-card text-base"
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 rounded-xl bg-card text-base"
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="h-12 rounded-xl bg-card text-base"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl text-base font-bold"
        >
          {loading ? '...' : isLogin ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
      </button>
    </div>
  );
}
