import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, Pill } from 'lucide-react';

interface PetMedication {
  id: string;
  name: string;
  dosage: string | null;
  frequency_hours: number;
  treatment_start: string;
  treatment_end: string | null;
  notes: string | null;
  treatment_status: string;
  created_at: string;
}

function computeStatus(endDate: string | null): string {
  if (!endDate) return 'em_tratamento';
  return new Date(endDate) < new Date(new Date().toDateString()) ? 'tratado' : 'em_tratamento';
}

const statusLabels: Record<string, { label: string; emoji: string; color: string }> = {
  em_tratamento: { label: 'Em tratamento', emoji: '🔄', color: 'text-amber-600 dark:text-amber-400' },
  tratado: { label: 'Concluído', emoji: '✅', color: 'text-green-600 dark:text-green-400' },
};

const frequencyOptions = [
  { value: 4, label: 'De 4 em 4 horas' },
  { value: 6, label: 'De 6 em 6 horas' },
  { value: 8, label: 'De 8 em 8 horas' },
  { value: 12, label: 'De 12 em 12 horas' },
  { value: 24, label: '1x ao dia (24h)' },
];

export default function MedicationsTab({ petId, petName }: { petId: string; petName: string }) {
  const [meds, setMeds] = useState<PetMedication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PetMedication | null>(null);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequencyHours, setFrequencyHours] = useState('8');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    const { data } = await supabase
      .from('pet_medications')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false });
    if (data) setMeds(data as PetMedication[]);
  };

  useEffect(() => { fetchData(); }, [petId]);

  // Set up browser notification reminders
  useEffect(() => {
    const activeMeds = meds.filter(m => computeStatus(m.treatment_end) === 'em_tratamento');
    if (activeMeds.length === 0) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const intervals: ReturnType<typeof setInterval>[] = [];

    activeMeds.forEach(med => {
      const ms = med.frequency_hours * 60 * 60 * 1000;
      const interval = setInterval(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`💊 Hora da medicação - ${petName}`, {
            body: `${med.name}${med.dosage ? ` (${med.dosage})` : ''} - de ${med.frequency_hours} em ${med.frequency_hours}h`,
            icon: '/favicon.ico',
            tag: `med-${med.id}`,
          });
        }
        toast.info(`💊 Hora da medicação de ${petName}: ${med.name}`, { duration: 10000 });
      }, ms);
      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [meds, petName]);

  const openAdd = () => {
    setEditing(null);
    setName(''); setDosage(''); setFrequencyHours('8');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(''); setNotes('');
    setShowModal(true);
  };

  const openEdit = (m: PetMedication) => {
    setEditing(m);
    setName(m.name); setDosage(m.dosage || '');
    setFrequencyHours(String(m.frequency_hours));
    setStartDate(m.treatment_start);
    setEndDate(m.treatment_end || ''); setNotes(m.notes || '');
    setShowModal(true);
  };

  const save = async () => {
    const status = computeStatus(endDate || null);
    if (editing) {
      await supabase.from('pet_medications').update({
        name, dosage: dosage || null,
        frequency_hours: parseInt(frequencyHours),
        treatment_start: startDate,
        treatment_end: endDate || null,
        notes: notes || null,
        treatment_status: status,
      }).eq('id', editing.id);
      toast.success('Medicação atualizada! ✏️');
    } else {
      await supabase.from('pet_medications').insert({
        pet_id: petId, name, dosage: dosage || null,
        frequency_hours: parseInt(frequencyHours),
        treatment_start: startDate,
        treatment_end: endDate || null,
        notes: notes || null,
        treatment_status: status,
      });
      toast.success('Medicação registrada! 💊');
    }
    setShowModal(false);
    fetchData();
  };

  const deleteMed = async (id: string) => {
    await supabase.from('pet_medications').delete().eq('id', id);
    toast.success('Removido');
    fetchData();
  };

  return (
    <div className="mt-4">
      <Button onClick={openAdd} className="mb-4 w-full rounded-xl">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Medicação
      </Button>

      <div className="space-y-3">
        {meds.map((m) => {
          const status = computeStatus(m.treatment_end);
          const st = statusLabels[status];
          return (
            <div key={m.id} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-sm">
              <Pill className="h-6 w-6 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="font-bold text-foreground">{m.name}</div>
                {m.dosage && <div className="text-xs text-muted-foreground">{m.dosage}</div>}
                <div className="text-xs text-muted-foreground mt-0.5">
                  ⏰ De {m.frequency_hours} em {m.frequency_hours}h
                </div>
                <div className={`text-xs font-semibold mt-1 ${st.color}`}>
                  {st.emoji} {st.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(m.treatment_start).toLocaleDateString('pt-BR')}
                  {m.treatment_end && ` → ${new Date(m.treatment_end).toLocaleDateString('pt-BR')}`}
                </div>
              </div>
              <button onClick={() => openEdit(m)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => deleteMed(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
        {meds.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhuma medicação registrada 💊</p>}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Medicação ✏️' : 'Adicionar Medicação 💊'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do medicamento</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Amoxicilina" className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Dosagem (opcional)</label>
              <Input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Ex: 250mg, 1 comprimido" className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Frequência</label>
              <Select value={frequencyHours} onValueChange={setFrequencyHours}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(f => (
                    <SelectItem key={f.value} value={String(f.value)}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Início do tratamento</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Fim do tratamento (opcional)</label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Observações (opcional)</label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instruções, veterinário..." className="rounded-xl" maxLength={500} />
            </div>
            <Button onClick={save} disabled={!name || !startDate} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
