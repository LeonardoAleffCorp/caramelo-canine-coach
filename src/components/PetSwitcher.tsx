import { usePet } from '@/hooks/usePet';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function PetSwitcher() {
  const { pets, pet, selectPet, refreshPet } = usePet();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('pets').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success(`${deleteTarget.name} removido 🐾`);
      setDeleteTarget(null);
      await refreshPet();
      if (pets.length <= 1) setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao remover pet');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-foreground transition-transform active:scale-95"
      >
        {pet?.photo_url ? (
          <img src={pet.photo_url} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <span className="text-base">🐕</span>
        )}
        <span>{pet?.name}</span>
        {pets.length > 1 ? <span className="text-muted-foreground">▾</span> : <Plus className="h-3 w-3 text-muted-foreground" />}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Seus Pets 🐾</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {pets.map((p) => (
              <div
                key={p.id}
                className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                  p.id === pet?.id ? 'bg-primary/10 border border-primary' : 'bg-card hover:bg-accent'
                }`}
              >
                <button
                  onClick={() => { selectPet(p.id); setOpen(false); }}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xl">🐕</div>
                  )}
                  <div>
                    <div className="font-bold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.breed}</div>
                  </div>
                  {p.id === pet?.id && <span className="ml-auto text-primary">✓</span>}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: p.id, name: p.name }); }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => { setOpen(false); navigate('/cadastrar-pet'); }}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/30 p-3 text-left hover:bg-accent transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-muted-foreground">Adicionar outro pet</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {deleteTarget?.name}? 😢</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os dados deste pet (vacinas, treinos, peso) serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? '...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
