import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface VaccineType {
  id: string;
  name: string;
  description: string | null;
}

interface VaccinePickerProps {
  value: string;
  onChange: (name: string) => void;
}

export default function VaccinePicker({ value, onChange }: VaccinePickerProps) {
  const [types, setTypes] = useState<VaccineType[]>([]);
  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    supabase.from('vaccine_types').select('*').order('name').then(({ data }) => {
      if (data) setTypes(data as VaccineType[]);
    });
  }, []);

  const filtered = types.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const hasExactMatch = types.some(t => t.name.toLowerCase() === search.toLowerCase());

  const addCustom = async () => {
    if (!search.trim()) return;
    const { error } = await supabase.from('vaccine_types').insert({ name: search.trim(), is_custom: true });
    if (error) {
      if (error.code === '23505') toast.error('Essa vacina já existe');
      else toast.error('Erro ao adicionar');
      return;
    }
    toast.success('Vacina adicionada! 💉');
    onChange(search.trim());
    setShowList(false);
    // Refresh
    const { data } = await supabase.from('vaccine_types').select('*').order('name');
    if (data) setTypes(data as VaccineType[]);
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome da vacina</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar vacina..."
          value={showList ? search : value}
          onChange={(e) => { setSearch(e.target.value); onChange(e.target.value); setShowList(true); }}
          onFocus={() => { setShowList(true); setSearch(value); }}
          className="rounded-xl pl-10"
        />
      </div>

      {showList && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { onChange(t.name); setShowList(false); }}
              className="flex w-full flex-col px-3 py-2 text-left hover:bg-accent transition-colors"
            >
              <span className="text-sm font-semibold text-foreground">{t.name}</span>
              {t.description && <span className="text-[10px] text-muted-foreground">{t.description}</span>}
            </button>
          ))}
          {search && !hasExactMatch && (
            <button
              type="button"
              onClick={addCustom}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent border-t border-border"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Adicionar "{search}"</span>
            </button>
          )}
          {filtered.length === 0 && !search && (
            <p className="px-3 py-2 text-xs text-muted-foreground">Nenhuma vacina encontrada</p>
          )}
        </div>
      )}
    </div>
  );
}
