import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import mascotImg from '@/assets/caramelo-mascot.png';
import { ChevronLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success('Email enviado! Verifique sua caixa de entrada 📧');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-primary/10 via-background to-background">
      <img src={mascotImg} alt="Caramelo" className="h-20 w-20 rounded-full shadow-lg mb-6" />

      {sent ? (
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-extrabold text-foreground">Email enviado!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
          </p>
          <Button onClick={() => setSent(false)} variant="outline" className="mt-6 rounded-xl">
            Enviar novamente
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Esqueci minha senha 🔑</h1>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-card text-base"
            />
            <Button type="submit" disabled={loading} className="h-14 w-full rounded-2xl text-lg font-bold">
              {loading ? '...' : 'Enviar link 📧'}
            </Button>
          </form>
        </>
      )}

      <a href="/" className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        <ChevronLeft className="h-4 w-4" /> Voltar ao login
      </a>
    </div>
  );
}
