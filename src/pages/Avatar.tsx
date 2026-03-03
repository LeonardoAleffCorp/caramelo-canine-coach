import { useEffect, useState } from 'react';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { toast } from 'sonner';
import { getStickersByCategory, STICKER_POSITIONS, type EquippedSticker, type StickerDef } from '@/lib/stickerEmojis';
import { avatarFrames, avatarBgColors, type AvatarFrame } from '@/lib/avatarFrames';
import { Lock, Palette } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBreedColorConfig, type BreedColorConfig } from '@/lib/breedColorImages';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  emotions: { label: 'Emoções', emoji: '😊' },
  activities: { label: 'Atividades', emoji: '🐾' },
  food: { label: 'Comida', emoji: '🍖' },
  misc: { label: 'Diversos', emoji: '✨' },
};

type AvatarTab = 'stickers' | 'frames';

export default function Avatar() {
  const { pet, weightStatus } = usePet();
  const [equipped, setEquipped] = useState<EquippedSticker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('emotions');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [colorConfig, setColorConfig] = useState<BreedColorConfig | null>(null);
  const [activeTab, setActiveTab] = useState<AvatarTab>('stickers');
  const [frameId, setFrameId] = useState<string>('none');
  const [bgColorId, setBgColorId] = useState<string>('default');

  useEffect(() => {
    if (!pet) return;
    const storedStickers = localStorage.getItem(`avatar_stickers_${pet.id}`);
    if (storedStickers) {
      try {
        const parsed: EquippedSticker[] = JSON.parse(storedStickers);
        // Filter out any stickers in removed positions
        const valid = parsed.filter(s => (STICKER_POSITIONS as readonly string[]).includes(s.position));
        setEquipped(valid);
      } catch { /* ignore */ }
    }
    const storedColor = localStorage.getItem(`avatar_color_${pet.id}`);
    if (storedColor) setSelectedColor(storedColor);
    else setSelectedColor(undefined);

    const storedFrame = localStorage.getItem(`avatar_frame_${pet.id}`);
    if (storedFrame) setFrameId(storedFrame);

    const storedBg = localStorage.getItem(`avatar_bg_${pet.id}`);
    if (storedBg) setBgColorId(storedBg);

    setColorConfig(getBreedColorConfig(pet.breed));
  }, [pet]);

  const saveEquipped = (newList: EquippedSticker[]) => {
    if (!pet) return;
    setEquipped(newList);
    localStorage.setItem(`avatar_stickers_${pet.id}`, JSON.stringify(newList));
  };

  const saveColor = (colorId: string) => {
    if (!pet) return;
    setSelectedColor(colorId);
    localStorage.setItem(`avatar_color_${pet.id}`, colorId);
    toast.success('Cor atualizada!');
  };

  const saveFrame = (id: string) => {
    if (!pet) return;
    setFrameId(id);
    localStorage.setItem(`avatar_frame_${pet.id}`, id);
    toast.success('Moldura atualizada! 🖼️');
  };

  const saveBgColor = (id: string) => {
    if (!pet) return;
    setBgColorId(id);
    localStorage.setItem(`avatar_bg_${pet.id}`, id);
    toast.success('Fundo atualizado! 🎨');
  };

  const toggleSticker = (sticker: StickerDef) => {
    if (!pet) return;
    const existingIndex = equipped.findIndex(e => e.stickerId === sticker.id);
    if (existingIndex !== -1) {
      saveEquipped(equipped.filter(e => e.stickerId !== sticker.id));
      toast.success('Figurinha removida!');
      return;
    }
    if (equipped.length >= 6) {
      toast.error('Máximo de 6 figurinhas! Remova uma primeiro.');
      return;
    }
    const usedPositions = new Set(equipped.map(e => e.position));
    const nextPosition = STICKER_POSITIONS.find(p => !usedPositions.has(p));
    if (!nextPosition) return;
    saveEquipped([...equipped, { stickerId: sticker.id, position: nextPosition }]);
    toast.success('Figurinha adicionada! 🎉');
  };

  const categoryItems = getStickersByCategory(selectedCategory);

  return (
    <Layout>
      <PageHeader title="Avatar 🎨" />
      <div className="px-5">
        {/* Avatar preview */}
        <div className="flex flex-col items-center mb-4 relative">
          <PetAvatarPreview
            breed={pet?.breed || 'Vira-lata/SRD'}
            equippedStickers={equipped}
            size="lg"
            colorId={selectedColor}
            frameId={frameId}
            bgColor={bgColorId}
            weightStatus={weightStatus || undefined}
          />
          
          {colorConfig && colorConfig.colors.length > 0 && (
            <div className="absolute top-0 right-8">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-background border-2 border-primary shadow-sm hover:bg-accent">
                    <Palette className="h-4 w-4 text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" side="left">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-center mb-1">Cor do pelo</p>
                    <div className="flex flex-col gap-1">
                      {colorConfig.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => saveColor(color.id)}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                            selectedColor === color.id || (!selectedColor && color.id === colorConfig.defaultColor)
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <p className="mt-2 text-lg font-extrabold text-foreground">{pet?.name}</p>
          <p className="text-xs text-muted-foreground">{equipped.length}/6 figurinhas</p>
        </div>

        {/* Main tabs: Figurinhas vs Moldura */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'stickers' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
            }`}
          >
            😊 Figurinhas
          </button>
          <button
            onClick={() => setActiveTab('frames')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'frames' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground'
            }`}
          >
            🖼️ Moldura
          </button>
        </div>

        {activeTab === 'stickers' && (
          <>
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
          </>
        )}

        {activeTab === 'frames' && (
          <div className="pb-4">
            {/* Frames section */}
            <h3 className="text-sm font-bold text-foreground mb-3">🖼️ Molduras</h3>
            <TooltipProvider>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {avatarFrames.map((frame) => {
                  const isSelected = frameId === frame.id;
                  const isLocked = frame.is_premium;
                  const btn = (
                    <button
                      key={frame.id}
                      onClick={() => !isLocked && saveFrame(frame.id)}
                      disabled={isLocked}
                      className={`relative flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all active:scale-95 ${
                        isLocked
                          ? 'bg-muted/50 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary/10 border-2 border-primary shadow-md'
                          : 'bg-card border border-border shadow-sm'
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 z-10">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-2xl">{frame.emoji}</span>
                      <span className="text-[10px] font-bold text-foreground text-center leading-tight">{frame.name}</span>
                      {isSelected && <span className="text-[10px] text-primary font-bold">✓</span>}
                    </button>
                  );
                  if (isLocked) {
                    return (
                      <Tooltip key={frame.id}>
                        <TooltipTrigger asChild>{btn}</TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-center">
                          <p className="text-xs font-semibold">🔒 Premium</p>
                          <p className="text-[10px] text-muted-foreground">Faça upgrade para desbloquear.</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return btn;
                })}
              </div>
            </TooltipProvider>

            {/* Background colors section */}
            <h3 className="text-sm font-bold text-foreground mb-3">🎨 Cor de Fundo</h3>
            <div className="grid grid-cols-5 gap-3">
              {avatarBgColors.map((bg) => {
                const isSelected = bgColorId === bg.id;
                return (
                  <button
                    key={bg.id}
                    onClick={() => saveBgColor(bg.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all active:scale-95 ${
                      isSelected
                        ? 'border-2 border-primary shadow-md'
                        : 'border border-border'
                    }`}
                  >
                    <div
                      className="h-10 w-10 rounded-lg border border-border/50"
                      style={{ backgroundColor: bg.preview }}
                    />
                    <span className="text-[9px] font-bold text-foreground text-center leading-tight">{bg.name}</span>
                    {isSelected && <span className="text-[10px] text-primary font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
