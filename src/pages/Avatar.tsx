import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AvatarItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  color: string;
  is_premium: boolean;
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
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [equipped, setEquipped] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('hat');

  useEffect(() => {
    supabase.from('avatar_items').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data as AvatarItem[]);
    });
  }, []);

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
      toast.success('Item removido!');
    } else {
      await supabase.from('pet_avatar').insert({ pet_id: pet.id, item_id: itemId });
      setEquipped(prev => new Set(prev).add(itemId));
      toast.success('Item equipado! 🎉');
    }
  };

  const filteredItems = items.filter(i => i.category === selectedCategory);
  const equippedItems = items.filter(i => equipped.has(i.id));

  // Get equipped items by category for avatar display
  const equippedByCategory = (cat: string) => equippedItems.find(i => i.category === cat);

  return (
    <Layout>
      <PageHeader title="Avatar 🎨" />
      <div className="px-5">
        {/* Avatar preview */}
        <div className="relative mx-auto mb-6 flex h-56 w-56 items-center justify-center rounded-3xl bg-gradient-to-b from-accent to-accent/50 shadow-inner">
          {/* Base pet */}
          {pet?.photo_url ? (
            <img src={pet.photo_url} alt={pet?.name} className="h-32 w-32 rounded-full object-cover shadow-lg" />
          ) : (
            <span className="text-8xl">🐕</span>
          )}

          {/* Equipped items overlay */}
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

        {/* Pet name */}
        <p className="text-center text-lg font-extrabold text-foreground mb-4">{pet?.name}</p>

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
        <div className="mt-3 grid grid-cols-3 gap-3 pb-4">
          {filteredItems.map((item) => {
            const isEquipped = equipped.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl p-4 transition-all active:scale-95 ${
                  isEquipped
                    ? 'bg-primary/10 border-2 border-primary shadow-md'
                    : 'bg-card border border-border shadow-sm'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-[10px] font-bold text-foreground text-center leading-tight">{item.name}</span>
                {isEquipped && <span className="text-[10px] text-primary font-bold">Equipado ✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
