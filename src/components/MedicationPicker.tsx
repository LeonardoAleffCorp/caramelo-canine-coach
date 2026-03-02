import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface MedicationType {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

const categoryLabels: Record<string, string> = {
  antibiotico: '💊 Antibióticos',
  anti_inflamatorio: '🔥 Anti-inflamatórios',
  antiparasitario: '🐛 Antiparasitários',
  analgesico: '💉 Analgésicos',
  antialergico: '🤧 Antialérgicos',
  gastrointestinal: '🫁 Gastrointestinais',
  cardiaco: '❤️ Cardíacos',
  dermatologico: '🧴 Dermatológicos',
  suplemento: '🥗 Suplementos',
  geral: '📋 Geral',
};

export default function MedicationPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [types, setTypes] = useState<MedicationType[]>([]);
  const [search, setSearch] = useState('');
  const [isOther, setIsOther] = useState(false);

  useEffect(() => {
    supabase.from('medication_types').select('*').order('category').order('name').then(({ data }) => {
      if (data) setTypes(data as MedicationType[]);
    });
  }, []);

  const filtered = types.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce<Record<string, MedicationType[]>>((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  if (isOther) {
    return (
      <div className="space-y-2">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do medicamento</label>
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Digite o nome do medicamento"
          className="rounded-xl"
        />
        <button
          type="button"
          onClick={() => { setIsOther(false); onChange(''); }}
          className="text-xs text-primary underline"
        >
          ← Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">Medicamento</label>
      <Input
        placeholder="🔍 Buscar medicamento..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="rounded-xl"
      />
      <div className="max-h-48 overflow-y-auto rounded-xl border bg-background p-1 space-y-1">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 sticky top-0 bg-background">
              {categoryLabels[cat] || cat}
            </div>
            {items.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange(t.name)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-accent transition-colors ${value === t.name ? 'bg-primary/10 font-semibold text-primary' : ''}`}
              >
                {t.name}
                {t.description && <span className="text-[10px] text-muted-foreground ml-1">— {t.description}</span>}
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && search && (
          <p className="text-xs text-muted-foreground text-center py-2">Nenhum encontrado</p>
        )}
        <button
          type="button"
          onClick={() => { setIsOther(true); onChange(''); }}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-accent transition-colors border-t"
        >
          ✏️ Outro medicamento...
        </button>
      </div>
    </div>
  );
}
