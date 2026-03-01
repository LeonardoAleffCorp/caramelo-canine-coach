import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePet } from '@/hooks/usePet';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

interface Vaccine {
  id: string; name: string; applied_date: string; next_dose_date: string | null; notes: string | null;
}

interface WeightLog {
  id: string; weight_kg: number; recorded_at: string;
}

export default function Saude() {
  const { pet } = usePet();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [vName, setVName] = useState('');
  const [vDate, setVDate] = useState('');
  const [vNext, setVNext] = useState('');
  const [newWeight, setNewWeight] = useState('');

  const fetchData = async () => {
    if (!pet) return;
    const [{ data: v }, { data: w }] = await Promise.all([
      supabase.from('vaccines').select('*').eq('pet_id', pet.id).order('applied_date', { ascending: false }),
      supabase.from('weight_logs').select('*').eq('pet_id', pet.id).order('recorded_at'),
    ]);
    if (v) setVaccines(v as Vaccine[]);
    if (w) setWeights(w as WeightLog[]);
  };

  useEffect(() => { fetchData(); }, [pet]);

  const addVaccine = async () => {
    if (!pet || !vName || !vDate) return;
    await supabase.from('vaccines').insert({ pet_id: pet.id, name: vName, applied_date: vDate, next_dose_date: vNext || null });
    toast.success('Vacina registrada! 💉');
    setShowVaccineModal(false); setVName(''); setVDate(''); setVNext('');
    fetchData();
  };

  const deleteVaccine = async (id: string) => {
    await supabase.from('vaccines').delete().eq('id', id);
    toast.success('Removido');
    fetchData();
  };

  const addWeight = async () => {
    if (!pet || !newWeight) return;
    await supabase.from('weight_logs').insert({ pet_id: pet.id, weight_kg: parseFloat(newWeight) });
    toast.success('Peso registrado! ⚖️');
    setShowWeightModal(false); setNewWeight('');
    fetchData();
  };

  const chartData = weights.map(w => ({
    date: new Date(w.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: Number(w.weight_kg),
  }));

  return (
    <Layout>
      <PageHeader title="Saúde 🏥" />
      <div className="px-5">
        <Tabs defaultValue="vacinas" className="mt-2">
          <TabsList className="w-full rounded-xl bg-muted">
            <TabsTrigger value="vacinas" className="flex-1 rounded-lg text-xs font-bold">💉 Vacinas</TabsTrigger>
            <TabsTrigger value="peso" className="flex-1 rounded-lg text-xs font-bold">⚖️ Peso</TabsTrigger>
            <TabsTrigger value="lembretes" className="flex-1 rounded-lg text-xs font-bold">🔔 Lembretes</TabsTrigger>
          </TabsList>

          <TabsContent value="vacinas" className="mt-4">
            <Button onClick={() => setShowVaccineModal(true)} className="mb-4 w-full rounded-xl">
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
                  <button onClick={() => deleteVaccine(v.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              {vaccines.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhuma vacina registrada</p>}
            </div>
          </TabsContent>

          <TabsContent value="peso" className="mt-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 rounded-2xl bg-card p-4 shadow-sm text-center">
                <div className="text-xs text-muted-foreground">Peso atual</div>
                <div className="text-2xl font-extrabold text-foreground">
                  {weights.length > 0 ? `${weights[weights.length - 1].weight_kg} kg` : '—'}
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

          <TabsContent value="lembretes" className="mt-4">
            <div className="space-y-3">
              {[
                { emoji: '💊', name: 'Vermífugo', desc: 'A cada 3-6 meses' },
                { emoji: '🦟', name: 'Antipulgas', desc: 'Mensal' },
                { emoji: '💉', name: 'Vacina anual', desc: 'Verificar calendário' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showVaccineModal} onOpenChange={setShowVaccineModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Adicionar Vacina 💉</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome da vacina" value={vName} onChange={e => setVName(e.target.value)} className="rounded-xl" />
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Data aplicação</label>
              <Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Próxima dose (opcional)</label>
              <Input type="date" value={vNext} onChange={e => setVNext(e.target.value)} className="rounded-xl" />
            </div>
            <Button onClick={addVaccine} disabled={!vName || !vDate} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Registrar Peso ⚖️</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Peso em kg" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)} className="rounded-xl" />
            <Button onClick={addWeight} disabled={!newWeight} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
