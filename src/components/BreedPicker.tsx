import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Breed {
  id: string;
  name: string;
  size_category: string;
}

interface BreedPickerProps {
  value: string;
  onChange: (breed: string) => void;
}

export default function BreedPicker({ value, onChange }: BreedPickerProps) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.from('breeds').select('*').order('name').then(({ data }) => {
      if (data) setBreeds(data as Breed[]);
    });
  }, []);

  const filtered = breeds.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (name: string) => {
    onChange(name);
    setSearch('');
    setOpen(false);
  };

  const handleAddCustom = async () => {
    if (!search.trim()) return;
    const customName = search.trim();
    await supabase.from('breeds').insert({ name: customName, is_custom: true });
    onChange(customName);
    setBreeds((prev) => [...prev, { id: 'custom', name: customName, size_category: 'variado' }]);
    setSearch('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-semibold text-foreground">Raça</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center rounded-xl border border-input bg-card px-3 text-base cursor-pointer"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value || 'Selecione a raça...'}
        </span>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-hidden rounded-xl border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar raça..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelect(b.name)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent ${
                  value === b.name ? 'bg-accent font-semibold' : ''
                }`}
              >
                <span className="text-base">🐕</span>
                <span>{b.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{b.size_category}</span>
              </button>
            ))}
            {filtered.length === 0 && search.trim() && (
              <button
                type="button"
                onClick={handleAddCustom}
                className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-primary font-semibold hover:bg-accent"
              >
                <span className="text-base">➕</span>
                <span>Adicionar "{search.trim()}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
