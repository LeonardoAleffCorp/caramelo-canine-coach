import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { toast } from 'sonner';
import { specialAccessories, getAccessoriesByCategory, type AccessoryDef } from '@/lib/accessoryImages';
import { Lock, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  hat: { label: 'Chapéus', emoji: '🎩' },
  glasses: { label: 'Óculos', emoji: '🕶️' },
  collar: { label: 'Colares', emoji: '📿' },
};

export default function Avatar() {
  const { pet } = usePet();
  const { user } = useAuth();
  const [equipped, setEquipped] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('hat');

  // Load equipped special accessories from localStorage
  useEffect(() => {
    if (!pet) return;
    const stored = localStorage.getItem(`avatar_special_${pet.id}`);
    if (stored) {
      try {
        setEquipped(new Set(JSON.parse(stored)));
      } catch { /* ignore */ }
    }
  }, [pet]);

  const saveEquipped = (newSet: Set<string>) => {
    if (!pet) return;
    setEquipped(newSet);
    localStorage.setItem(`avatar_special_${pet.id}`, JSON.stringify([...newSet]));
  };

  const toggleItem = (accessory: AccessoryDef) => {
    if (!pet) return;

    // Only allow one item per category
    const newEquipped = new Set(equipped);
    const currentInCategory = [...newEquipped].find(id => {
      const acc = specialAccessories.find(a => a.id === id);
      return acc?.category === accessory.category;
    });

    if (currentInCategory === accessory.id) {
      // Unequip
      newEquipped.delete(accessory.id);
      toast.success('Acessório removido!');
    } else {
      // Remove existing in same category, equip new
      if (currentInCategory) newEquipped.delete(currentInCategory);
      newEquipped.add(accessory.id);
      toast.success('Acessório aplicado! 🎉');
    }

    saveEquipped(newEquipped);
  };

  const categoryItems = getAccessoriesByCategory(selectedCategory);

  const equippedItems = specialAccessories
    .filter(a => equipped.has(a.id))
    .map(a => ({ category: a.category, emoji: a.emoji, accessoryId: a.id }));

  return (
    <Layout>
      <PageHeader title="Avatar 🎨" />
      <div className="px-5">
        <p className="mb-4 text-xs text-muted-foreground text-center leading-relaxed">
          ✨ Personalize o visual do seu pet com acessórios especiais que mudam o desenho!
        </p>

        {/* Avatar preview */}
        <div className="flex flex-col items-center mb-4">
          <PetAvatarPreview
            breed={pet?.breed || 'Vira-lata/SRD'}
            equippedItems={equippedItems}
            size="lg"
          />
          <p className="mt-2 text-lg font-extrabold text-foreground">{pet?.name}</p>
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

        {/* Items grid */}
        <TooltipProvider>
          <div className="mt-3 grid grid-cols-3 gap-3 pb-4">
            {categoryItems.map((item) => {
              const isEquipped = equipped.has(item.id);
              const isLocked = item.is_premium;

              const itemButton = (
                <button
                  key={item.id}
                  onClick={() => !isLocked && toggleItem(item)}
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
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-contain"
                  />
                  <span className="text-[10px] font-bold text-foreground text-center leading-tight">{item.name}</span>
                  {isEquipped && <span className="text-[10px] text-primary font-bold">Aplicado ✓</span>}
                </button>
              );

              if (isLocked) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {itemButton}
                    </TooltipTrigger>
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
