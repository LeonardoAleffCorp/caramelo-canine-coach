import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, Bug } from 'lucide-react';

interface DiseaseType {
  id: string;
  name: string;
  category: string;
}

interface PetDisease {
  id: string;
  disease_name: string;
  custom_description: string | null;
  treatment_status: string;
  treatment_start: string | null;
  treatment_end: string | null;
  notes: string | null;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  viral: '🦠 Virais',
  bacteriana: '🧫 Bacterianas',
  parasitária: '🪲 Parasitárias / Pragas',
  fúngica: '🍄 Fúngicas',
  crônica: '💊 Crônicas',
  geral: '🏥 Gerais',
};

const statusLabels: Record<string, { label: string; emoji: string; color: string }> = {
  em_tratamento: { label: 'Em tratamento', emoji: '🔄', color: 'text-amber-600 dark:text-amber-400' },
  tratado: { label: 'Já tratado', emoji: '✅', color: 'text-green-600 dark:text-green-400' },
};

export default function DiseasesTab({ petId }: { petId: string }) {
  const [diseaseTypes, setDiseaseTypes] = useState<DiseaseType[]>([]);
  const [petDiseases, setPetDiseases] = useState<PetDisease[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState<PetDisease | null>(null);

  // Add form
  const [selectedDisease, setSelectedDisease] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const isOther = selectedDisease === '__other__';

  // Treatment form
  const [treatmentStatus, setTreatmentStatus] = useState('em_tratamento');
  const [treatmentStart, setTreatmentStart] = useState('');
  const [treatmentEnd, setTreatmentEnd] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [pendingDiseaseName, setPendingDiseaseName] = useState('');
  const [pendingCustomDesc, setPendingCustomDesc] = useState('');

  const fetchData = async () => {
    const [{ data: types }, { data: diseases }] = await Promise.all([
      supabase.from('disease_types').select('*').order('category').order('name'),
      supabase.from('pet_diseases').select('*').eq('pet_id', petId).order('created_at', { ascending: false }),
    ]);
    if (types) setDiseaseTypes(types as DiseaseType[]);
    if (diseases) setPetDiseases(diseases as PetDisease[]);
  };

  useEffect(() => { fetchData(); }, [petId]);

  const openAdd = () => {
    setEditingDisease(null);
    setSelectedDisease('');
    setCustomDescription('');
    setShowAddModal(true);
  };

  const handleAddNext = () => {
    if (!selectedDisease) return;
    const name = isOther ? 'Outro' : selectedDisease;
    setPendingDiseaseName(name);
    setPendingCustomDesc(isOther ? customDescription : '');
    setShowAddModal(false);
    setTreatmentStatus('em_tratamento');
    setTreatmentStart('');
    setTreatmentEnd('');
    setTreatmentNotes('');
    setShowTreatmentModal(true);
  };

  const saveTreatment = async () => {
    if (editingDisease) {
      await supabase.from('pet_diseases').update({
        treatment_status: treatmentStatus,
        treatment_start: treatmentStart || null,
        treatment_end: treatmentEnd || null,
        notes: treatmentNotes || null,
      }).eq('id', editingDisease.id);
      toast.success('Tratamento atualizado! ✏️');
    } else {
      await supabase.from('pet_diseases').insert({
        pet_id: petId,
        disease_name: pendingDiseaseName,
        custom_description: pendingCustomDesc || null,
        treatment_status: treatmentStatus,
        treatment_start: treatmentStart || null,
        treatment_end: treatmentEnd || null,
        notes: treatmentNotes || null,
      });
      toast.success('Doença registrada! 🏥');
    }
    setShowTreatmentModal(false);
    setEditingDisease(null);
    fetchData();
  };

  const openEditTreatment = (d: PetDisease) => {
    setEditingDisease(d);
    setTreatmentStatus(d.treatment_status);
    setTreatmentStart(d.treatment_start || '');
    setTreatmentEnd(d.treatment_end || '');
    setTreatmentNotes(d.notes || '');
    setShowTreatmentModal(true);
  };

  const deleteDisease = async (id: string) => {
    await supabase.from('pet_diseases').delete().eq('id', id);
    toast.success('Removido');
    fetchData();
  };

  // Group disease types by category
  const grouped = diseaseTypes.reduce<Record<string, DiseaseType[]>>((acc, dt) => {
    if (!acc[dt.category]) acc[dt.category] = [];
    acc[dt.category].push(dt);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <Button onClick={openAdd} className="mb-4 w-full rounded-xl">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Doença
      </Button>

      <div className="space-y-3">
        {petDiseases.map((d) => {
          const st = statusLabels[d.treatment_status] || statusLabels.em_tratamento;
          return (
            <div key={d.id} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-sm">
              <span className="text-2xl"><Bug className="h-6 w-6 text-muted-foreground" /></span>
              <div className="flex-1">
                <div className="font-bold text-foreground">{d.disease_name}</div>
                {d.custom_description && (
                  <div className="text-xs text-muted-foreground mt-0.5">{d.custom_description}</div>
                )}
                <div className={`text-xs font-semibold mt-1 ${st.color}`}>
                  {st.emoji} {st.label}
                </div>
                {d.treatment_start && (
                  <div className="text-[11px] text-muted-foreground">
                    Início: {new Date(d.treatment_start).toLocaleDateString('pt-BR')}
                    {d.treatment_end && ` → Fim: ${new Date(d.treatment_end).toLocaleDateString('pt-BR')}`}
                  </div>
                )}
              </div>
              <button onClick={() => openEditTreatment(d)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => deleteDisease(d.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
        {petDiseases.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhuma doença registrada 🐾</p>}
      </div>

      {/* Add disease modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Adicionar Doença 🏥</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Selecione a doença</label>
            <Select value={selectedDisease} onValueChange={setSelectedDisease}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Escolha uma doença..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground">{categoryLabels[cat] || cat}</div>
                    {items.map((dt) => (
                      <SelectItem key={dt.id} value={dt.name}>{dt.name}</SelectItem>
                    ))}
                  </div>
                ))}
                <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground">📝 Personalizado</div>
                <SelectItem value="__other__">Outro...</SelectItem>
              </SelectContent>
            </Select>

            {isOther && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Descreva a doença</label>
                <Textarea
                  placeholder="Descreva os sintomas ou a doença..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="rounded-xl"
                  maxLength={500}
                />
              </div>
            )}

            <Button
              onClick={handleAddNext}
              disabled={!selectedDisease || (isOther && !customDescription.trim())}
              className="w-full rounded-xl"
            >
              Avançar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Treatment modal */}
      <Dialog open={showTreatmentModal} onOpenChange={setShowTreatmentModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDisease ? 'Editar Tratamento ✏️' : 'Status do Tratamento 💊'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <Select value={treatmentStatus} onValueChange={setTreatmentStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="em_tratamento">🔄 Em tratamento</SelectItem>
                <SelectItem value="tratado">✅ Já foi tratado</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Início do tratamento</label>
              <Input type="date" value={treatmentStart} onChange={(e) => setTreatmentStart(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Fim do tratamento (opcional)</label>
              <Input type="date" value={treatmentEnd} onChange={(e) => setTreatmentEnd(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Observações (opcional)</label>
              <Textarea
                placeholder="Medicação, veterinário, etc..."
                value={treatmentNotes}
                onChange={(e) => setTreatmentNotes(e.target.value)}
                className="rounded-xl"
                maxLength={500}
              />
            </div>

            <Button onClick={saveTreatment} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
