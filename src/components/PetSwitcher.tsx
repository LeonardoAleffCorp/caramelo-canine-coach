import { usePet } from '@/hooks/usePet';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function PetSwitcher() {
  const { pets, pet, selectPet } = usePet();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (pets.length <= 1 && !open) {
    return (
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
        <Plus className="h-3 w-3 text-muted-foreground" />
      </button>
    );
  }

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
        <span className="text-muted-foreground">▾</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Seus Pets 🐾</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {pets.map((p) => (
              <button
                key={p.id}
                onClick={() => { selectPet(p.id); setOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  p.id === pet?.id ? 'bg-primary/10 border border-primary' : 'bg-card hover:bg-accent'
                }`}
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
    </>
  );
}
