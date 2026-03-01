import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import { getBreedDefaultImage } from '@/lib/breedImages';
import { getUnlockedStickerCount, getAccountAgeDays } from '@/lib/stickerUnlock';
import { Lock } from 'lucide-react';

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
  const equippedByCategory = (cat: string) => equippedItems.find(i => i.category === cat);

  const petImage = pet?.photo_url || (pet ? getBreedDefaultImage(pet.breed) : null);
  
  const daysToFullUnlock = Math.max(0, 180 - accountAgeDays);

  return (
    <Layout>
      <PageHeader title="Adesivos 🎨" />
      <div className="px-5">
        {/* Avatar preview */}
        <div className="relative mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-3xl bg-gradient-to-b from-accent to-accent/50 shadow-inner">
          {petImage ? (
            <img src={petImage} alt={pet?.name} className="h-32 w-32 rounded-full object-cover shadow-lg" />
          ) : (
            <span className="text-8xl">🐕</span>
          )}

          {equippedByCategory('hat') && (
            <span className="absolute top-2 text-4xl animate-bounce-in">{equippedByCategory('hat')!.emoji}</span>
          )}
          {equippedByCategory('glasses') && (
            <span className="absolute top-16 right-10 text-3xl">{equippedByCategory('glasses')!.emoji}</span>
          )}
          {equippedByCategory('collar') && (
            <span className="absolute bottom-14 text-3xl">{equippedByCategory('collar')!.emoji}</span>
          )}
          {equippedByCategory('outfit') && (
            <span className="absolute bottom-6 left-10 text-3xl">{equippedByCategory('outfit')!.emoji}</span>
          )}
          {equippedByCategory('accessory') && (
            <span className="absolute bottom-6 right-10 text-3xl">{equippedByCategory('accessory')!.emoji}</span>
          )}
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
        <div className="mt-3 grid grid-cols-3 gap-3 pb-4">
          {filteredItems.map((item) => {
            const isEquipped = equipped.has(item.id);
            const isLocked = !item.unlocked;
            return (
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
          })}
        </div>
      </div>
    </Layout>
  );
}
