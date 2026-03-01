import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import mascotImg from '@/assets/caramelo-mascot.png';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check if this is a recovery session
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    // Listen for auth state change with recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Senha atualizada com sucesso! 🎉');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-extrabold text-foreground">Link inválido</h1>
          <p className="mt-2 text-sm text-muted-foreground">Este link de recuperação expirou ou é inválido.</p>
          <Button onClick={() => navigate('/')} className="mt-4 rounded-xl">Voltar ao login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-primary/10 via-background to-background">
      <img src={mascotImg} alt="Caramelo" className="h-20 w-20 rounded-full shadow-lg mb-6" />
      <h1 className="text-2xl font-extrabold text-foreground mb-2">Nova senha 🔑</h1>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
        Crie uma nova senha para sua conta.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <Input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="h-12 rounded-xl bg-card text-base"
        />
        <Input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="h-12 rounded-xl bg-card text-base"
        />
        <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-lg font-bold">
          {loading ? '...' : 'Atualizar senha ✅'}
        </Button>
      </form>
    </div>
  );
}
