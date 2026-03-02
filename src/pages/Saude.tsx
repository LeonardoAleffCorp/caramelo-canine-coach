import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import VaccinePicker from '@/components/VaccinePicker';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import DiseasesTab from '@/components/DiseasesTab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import { getWeightStatus, getWeightLabel } from '@/lib/weight';
import { vaccineReminders } from '@/lib/vaccineReminders';

interface Vaccine {
  id: string; name: string; applied_date: string; next_dose_date: string | null; notes: string | null;
}
interface WeightLog {
  id: string; weight_kg: number; recorded_at: string;
}
import { type EquippedSticker } from '@/lib/stickerEmojis';

export default function Saude() {
  const { pet } = usePet();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  const [vName, setVName] = useState('');
  const [vDate, setVDate] = useState('');
  const [vNext, setVNext] = useState('');
  const [newWeight, setNewWeight] = useState('1');
  const [breedSize, setBreedSize] = useState('médio');
  const [equippedStickers, setEquippedStickers] = useState<EquippedSticker[]>([]);
  const [petColor, setPetColor] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    if (!pet) return;
    const [{ data: v }, { data: w }] = await Promise.all([
      supabase.from('vaccines').select('*').eq('pet_id', pet.id).order('applied_date', { ascending: false }),
      supabase.from('weight_logs').select('*').eq('pet_id', pet.id).order('recorded_at'),
    ]);
    if (v) setVaccines(v as Vaccine[]);
    if (w) setWeights(w as WeightLog[]);

    const { data: breed } = await supabase.from('breeds').select('size_category').eq('name', pet.breed).maybeSingle();
    if (breed) setBreedSize(breed.size_category);

    // Load stickers from localStorage
    const storedStickers = localStorage.getItem(`avatar_stickers_${pet.id}`);
    if (storedStickers) {
      try { setEquippedStickers(JSON.parse(storedStickers)); } catch { setEquippedStickers([]); }
    }
    
    // Load color
    const storedColor = localStorage.getItem(`avatar_color_${pet.id}`);
    if (storedColor) setPetColor(storedColor);
    else setPetColor(undefined);
  };

  useEffect(() => { fetchData(); }, [pet]);

  const openAddVaccine = () => {
    setEditingVaccine(null); setVName(''); setVDate(''); setVNext('');
    setShowVaccineModal(true);
  };

  const openEditVaccine = (v: Vaccine) => {
    setEditingVaccine(v);
    setVName(v.name); setVDate(v.applied_date); setVNext(v.next_dose_date || '');
    setShowVaccineModal(true);
  };

  const saveVaccine = async () => {
    if (!pet || !vName || !vDate) return;
    if (editingVaccine) {
      await supabase.from('vaccines').update({ name: vName, applied_date: vDate, next_dose_date: vNext || null }).eq('id', editingVaccine.id);
      toast.success('Vacina atualizada! ✏️');
    } else {
      await supabase.from('vaccines').insert({ pet_id: pet.id, name: vName, applied_date: vDate, next_dose_date: vNext || null });
      toast.success('Vacina registrada! 💉');
    }
    setShowVaccineModal(false); setVName(''); setVDate(''); setVNext(''); setEditingVaccine(null);
    fetchData();
  };

  const deleteVaccine = async (id: string) => {
    await supabase.from('vaccines').delete().eq('id', id);
    toast.success('Removido'); fetchData();
  };

  const addWeight = async () => {
    if (!pet || !newWeight) return;
    const weightVal = parseFloat(newWeight);
    await supabase.from('weight_logs').insert({ pet_id: pet.id, weight_kg: weightVal });
    await supabase.from('pets').update({ weight_kg: weightVal }).eq('id', pet.id);
    toast.success('Peso registrado! ⚖️');
    setShowWeightModal(false); setNewWeight('1'); fetchData();
  };

  const chartData = weights.map(w => ({
    date: new Date(w.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: Number(w.weight_kg),
  }));

  const currentWeight = weights.length > 0 ? Number(weights[weights.length - 1].weight_kg) : (pet?.weight_kg ? Number(pet.weight_kg) : null);
  const weightStatus = currentWeight ? getWeightStatus(currentWeight, breedSize) : null;
  const weightInfo = weightStatus ? getWeightLabel(weightStatus) : null;

  return (
    <Layout>
      <PageHeader title="Saúde 🏥" />
      <div className="px-5">
        <Tabs defaultValue="vacinas" className="mt-2">
          <TabsList className="w-full rounded-xl bg-muted">
            <TabsTrigger value="vacinas" className="flex-1 rounded-lg text-[10px] font-bold px-1">💉 Vacinas</TabsTrigger>
            <TabsTrigger value="peso" className="flex-1 rounded-lg text-[10px] font-bold px-1">⚖️ Peso</TabsTrigger>
            <TabsTrigger value="doencas" className="flex-1 rounded-lg text-[10px] font-bold px-1">🦠 Doenças</TabsTrigger>
            <TabsTrigger value="lembretes" className="flex-1 rounded-lg text-[10px] font-bold px-1">🔔 Lembretes</TabsTrigger>
          </TabsList>

          <TabsContent value="vacinas" className="mt-4">
            <Button onClick={openAddVaccine} className="mb-4 w-full rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Vacina
            </Button>
            <div className="space-y-3">
              {vaccines.map((v) => (
                <div key={v.id} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-sm">
                  <span className="text-2xl">💉</span>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">{v.name}</div>
                    <div className="text-xs text-muted-foreground">Aplicada: {new Date(v.applied_date).toLocaleDateString('pt-BR')}</div>
                    {v.next_dose_date && <div className="text-xs text-secondary">Próxima: {new Date(v.next_dose_date).toLocaleDateString('pt-BR')}</div>}
                  </div>
                  <button onClick={() => openEditVaccine(v)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteVaccine(v.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              {vaccines.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhuma vacina registrada</p>}
            </div>
          </TabsContent>

          <TabsContent value="peso" className="mt-4">
            {/* Pet avatar with stickers */}
            {pet && (
              <div className="mb-4 flex flex-col items-center">
                <PetAvatarPreview
                  breed={pet.breed}
                  equippedStickers={equippedStickers}
                  size="md"
                  weightStatus={weightStatus}
                  colorId={petColor}
                />
              </div>
            )}

            {weightInfo && (
              <div className="mb-4 flex flex-col items-center rounded-2xl bg-card p-4 shadow-sm">
                <div className={`text-lg font-extrabold ${weightInfo.color}`}>
                  {weightInfo.emoji} {weightInfo.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentWeight} kg • Porte {breedSize}
                </div>
              </div>
            )}

            {/* Veterinary disclaimer */}
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                <strong>Aviso:</strong> Este é apenas um diagnóstico prévio baseado no porte da raça. Qualquer mudança na alimentação ou atitude do seu pet deve ser consultada com um médico veterinário. Só faça alterações com prescrição profissional.
              </p>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 rounded-2xl bg-card p-4 shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Peso atual</div>
                <div className="text-2xl font-extrabold text-foreground">
                  {currentWeight ? `${currentWeight} kg` : '—'}
                </div>
              </div>
              <Button onClick={() => setShowWeightModal(true)} size="icon" className="h-12 w-12 rounded-xl"><Plus className="h-5 w-5" /></Button>
            </div>
            {chartData.length > 1 && (
              <div className="h-48 rounded-2xl bg-card p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="peso" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="doencas">
            {pet && <DiseasesTab petId={pet.id} />}
          </TabsContent>

          <TabsContent value="lembretes" className="mt-4">
            <p className="mb-3 text-xs text-muted-foreground">
              📋 Calendário completo de cuidados para seu pet. Toque para ver detalhes.
            </p>
            <div className="space-y-3 pb-4">
              {vaccineReminders.map((item) => (
                <details key={item.name} className="group rounded-2xl bg-card shadow-sm overflow-hidden">
                  <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground">{item.frequency}</div>
                    </div>
                    <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </details>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vaccine modal */}
      <Dialog open={showVaccineModal} onOpenChange={setShowVaccineModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editingVaccine ? 'Editar Vacina ✏️' : 'Adicionar Vacina 💉'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <VaccinePicker value={vName} onChange={setVName} />
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Data aplicação</label>
              <Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Próxima dose (opcional)</label>
              <Input type="date" value={vNext} onChange={e => setVNext(e.target.value)} className="rounded-xl" />
            </div>
            <Button onClick={saveVaccine} disabled={!vName || !vDate} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Weight modal */}
      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Registrar Peso ⚖️</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Peso em kg" step="0.5" min="1" value={newWeight} onChange={e => setNewWeight(e.target.value)} className="rounded-xl" />
            <p className="text-[10px] text-muted-foreground">O peso sobe de 0,5 em 0,5 kg, começando em 1 kg.</p>
            <Button onClick={addWeight} disabled={!newWeight} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
