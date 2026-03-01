import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { toast } from 'sonner';
import { getUnlockedStickerCount, getAccountAgeDays } from '@/lib/stickerUnlock';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AvatarItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  color: string;
  is_premium: boolean;
  sort_order: number;
}

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  hat: { label: 'Chapéus', emoji: '🎩' },
  glasses: { label: 'Óculos', emoji: '🕶️' },
  collar: { label: 'Coleiras', emoji: '📿' },
  outfit: { label: 'Roupas', emoji: '👕' },
  accessory: { label: 'Acessórios', emoji: '✨' },
};

export default function Avatar() {
  const { pet } = usePet();
  const { user } = useAuth();
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [equipped, setEquipped] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('hat');
  const [accountAgeDays, setAccountAgeDays] = useState(0);

  useEffect(() => {
    supabase.from('avatar_items').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data as AvatarItem[]);
    });
  }, []);

  useEffect(() => {
    if (user?.created_at) {
      setAccountAgeDays(getAccountAgeDays(user.created_at));
    }
  }, [user]);

  useEffect(() => {
    if (!pet) return;
    supabase.from('pet_avatar').select('item_id').eq('pet_id', pet.id).then(({ data }) => {
      if (data) setEquipped(new Set(data.map((d: any) => d.item_id)));
    });
  }, [pet]);

  const toggleItem = async (itemId: string) => {
    if (!pet) return;
    if (equipped.has(itemId)) {
      await supabase.from('pet_avatar').delete().eq('pet_id', pet.id).eq('item_id', itemId);
      setEquipped(prev => { const n = new Set(prev); n.delete(itemId); return n; });
      toast.success('Adesivo removido!');
    } else {
      await supabase.from('pet_avatar').insert({ pet_id: pet.id, item_id: itemId });
      setEquipped(prev => new Set(prev).add(itemId));
      toast.success('Adesivo aplicado! 🎉');
    }
  };

  const categoryItems = items.filter(i => i.category === selectedCategory);
  const unlockedCount = getUnlockedStickerCount(categoryItems.length, accountAgeDays);
  
  const filteredItems = categoryItems.map((item, index) => ({
    ...item,
    unlocked: index < unlockedCount,
  }));

  const equippedItems = items.filter(i => equipped.has(i.id));
  const daysToFullUnlock = Math.max(0, 180 - accountAgeDays);

  return (
    <Layout>
      <PageHeader title="Avatar 🎨" />
      <div className="px-5">
        {/* Description */}
        <p className="mb-4 text-xs text-muted-foreground text-center leading-relaxed">
          ✨ Personalize o visual do seu pet com adesivos exclusivos! Novos itens são desbloqueados conforme sua experiência no app.
        </p>

        {/* Avatar preview with photo side by side */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Photo */}
          {pet?.photo_url && (
            <img src={pet.photo_url} alt={pet?.name} className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shadow-lg" />
          )}
          {/* Avatar drawing */}
          <PetAvatarPreview
            breed={pet?.breed || 'Vira-lata/SRD'}
            equippedItems={equippedItems.map(i => ({ category: i.category, emoji: i.emoji }))}
            size="lg"
          />
        </div>

        <p className="text-center text-lg font-extrabold text-foreground">{pet?.name}</p>
        
        {/* Unlock progress */}
        {daysToFullUnlock > 0 && (
          <div className="mt-2 mb-4 rounded-xl bg-muted/50 px-3 py-2 text-center">
            <p className="text-[11px] text-muted-foreground">
              🔓 Novos adesivos desbloqueiam com o tempo!
              {daysToFullUnlock > 0 && ` Faltam ${daysToFullUnlock} dias para liberar todos.`}
            </p>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-primary transition-all" 
                style={{ width: `${Math.min(100, (accountAgeDays / 180) * 100)}%` }} 
              />
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mt-3">
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
            {filteredItems.map((item) => {
              const isEquipped = equipped.has(item.id);
              const isLocked = !item.unlocked;
              
              const itemButton = (
                <button
                  key={item.id}
                  onClick={() => !isLocked && toggleItem(item.id)}
                  disabled={isLocked}
                  className={`relative flex flex-col items-center gap-1 rounded-2xl p-4 transition-all active:scale-95 ${
                    isLocked
                      ? 'bg-muted/50 opacity-60 cursor-not-allowed'
                      : isEquipped
                      ? 'bg-primary/10 border-2 border-primary shadow-md'
                      : 'bg-card border border-border shadow-sm'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-3xl">{item.emoji}</span>
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
                      <p className="text-xs font-semibold">🔒 Exclusivo para assinantes!</p>
                      <p className="text-[10px] text-muted-foreground">Faça upgrade para desbloquear todos os adesivos.</p>
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
