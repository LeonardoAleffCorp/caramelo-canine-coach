import { useEffect, useState } from 'react';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { toast } from 'sonner';
import { dogStickers, getStickersByCategory, STICKER_POSITIONS, type EquippedSticker, type StickerDef } from '@/lib/stickerEmojis';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  emotions: { label: 'Emoções', emoji: '😊' },
  activities: { label: 'Atividades', emoji: '🐾' },
  food: { label: 'Comida', emoji: '🍖' },
  misc: { label: 'Diversos', emoji: '✨' },
};

export default function Avatar() {
  const { pet } = usePet();
  const [equipped, setEquipped] = useState<EquippedSticker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('emotions');

  useEffect(() => {
    if (!pet) return;
    const stored = localStorage.getItem(`avatar_stickers_${pet.id}`);
    if (stored) {
      try { setEquipped(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [pet]);

  const saveEquipped = (newList: EquippedSticker[]) => {
    if (!pet) return;
    setEquipped(newList);
    localStorage.setItem(`avatar_stickers_${pet.id}`, JSON.stringify(newList));
  };

  const toggleSticker = (sticker: StickerDef) => {
    if (!pet) return;

    const existingIndex = equipped.findIndex(e => e.stickerId === sticker.id);
    if (existingIndex !== -1) {
      // Remove it
      const newList = equipped.filter(e => e.stickerId !== sticker.id);
      saveEquipped(newList);
      toast.success('Figurinha removida!');
      return;
    }

    if (equipped.length >= 8) {
      toast.error('Máximo de 8 figurinhas! Remova uma primeiro.');
      return;
    }

    // Find next available position
    const usedPositions = new Set(equipped.map(e => e.position));
    const nextPosition = STICKER_POSITIONS.find(p => !usedPositions.has(p));
    if (!nextPosition) return;

    const newList = [...equipped, { stickerId: sticker.id, position: nextPosition }];
    saveEquipped(newList);
    toast.success('Figurinha adicionada! 🎉');
  };

  const categoryItems = getStickersByCategory(selectedCategory);

  return (
    <Layout>
      <PageHeader title="Avatar 🎨" />
      <div className="px-5">
        <p className="mb-4 text-xs text-muted-foreground text-center leading-relaxed">
          ✨ Adicione emojis e figurinhas ao redor do avatar do seu pet! (máx. 8)
        </p>

        {/* Avatar preview */}
        <div className="flex flex-col items-center mb-4">
          <PetAvatarPreview
            breed={pet?.breed || 'Vira-lata/SRD'}
            equippedStickers={equipped}
            size="lg"
          />
          <p className="mt-2 text-lg font-extrabold text-foreground">{pet?.name}</p>
          <p className="text-xs text-muted-foreground">{equipped.length}/8 figurinhas</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {Object.entries(categoryLabels).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                selectedCategory === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {val.emoji} {val.label}
            </button>
          ))}
        </div>

        {/* Sticker grid */}
        <TooltipProvider>
          <div className="mt-3 grid grid-cols-4 gap-3 pb-4">
            {categoryItems.map((item) => {
              const isEquipped = equipped.some(e => e.stickerId === item.id);
              const isLocked = item.is_premium;

              const itemButton = (
                <button
                  key={item.id}
                  onClick={() => !isLocked && toggleSticker(item)}
                  disabled={isLocked}
                  className={`relative flex flex-col items-center gap-1 rounded-2xl p-3 transition-all active:scale-95 ${
                    isLocked
                      ? 'bg-muted/50 opacity-60 cursor-not-allowed'
                      : isEquipped
                      ? 'bg-primary/10 border-2 border-primary shadow-md'
                      : 'bg-card border border-border shadow-sm'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 z-10">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-foreground text-center leading-tight">{item.name}</span>
                  {isEquipped && <span className="text-[10px] text-primary font-bold">✓</span>}
                </button>
              );

              if (isLocked) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{itemButton}</TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-center">
                      <p className="text-xs font-semibold">🔒 Premium</p>
                      <p className="text-[10px] text-muted-foreground">Faça upgrade para desbloquear.</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return itemButton;
            })}
          </div>
        </TooltipProvider>
      </div>
    </Layout>
  );
}
