import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Building2, Stethoscope, Phone, Mail, MapPin, StickyNote } from 'lucide-react';

interface VetClinic {
  id: string;
  clinic_name: string | null;
  vet_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
}

interface VetTabProps {
  petId: string;
}

export default function VetTab({ petId }: VetTabProps) {
  const [vet, setVet] = useState<VetClinic | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    clinic_name: '', vet_name: '', phone: '', email: '', address: '', notes: '',
  });

  const fetchVet = async () => {
    const { data } = await supabase.from('vet_clinics').select('*').eq('pet_id', petId).maybeSingle();
    if (data) setVet(data as VetClinic);
  };

  useEffect(() => { fetchVet(); }, [petId]);

  const openEdit = () => {
    if (vet) {
      setForm({
        clinic_name: vet.clinic_name || '', vet_name: vet.vet_name || '',
        phone: vet.phone || '', email: vet.email || '',
        address: vet.address || '', notes: vet.notes || '',
      });
    } else {
      setForm({ clinic_name: '', vet_name: '', phone: '', email: '', address: '', notes: '' });
    }
    setShowModal(true);
  };

  const save = async () => {
    if (vet) {
      await supabase.from('vet_clinics').update({ ...form }).eq('id', vet.id);
    } else {
      await supabase.from('vet_clinics').insert({ pet_id: petId, ...form });
    }
    toast.success('Dados da veterinária salvos! 🏥');
    setShowModal(false);
    fetchVet();
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
    value ? (
      <div className="flex items-start gap-3 py-2">
        <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="text-sm font-medium text-foreground">{value}</div>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="mt-4">
      <Button onClick={openEdit} className="mb-4 w-full rounded-xl">
        <Pencil className="mr-2 h-4 w-4" /> {vet ? 'Editar Veterinária' : 'Adicionar Veterinária'}
      </Button>

      {vet ? (
        <div className="rounded-2xl bg-card p-5 shadow-sm space-y-1">
          <InfoRow icon={Building2} label="Clínica" value={vet.clinic_name} />
          <InfoRow icon={Stethoscope} label="Veterinário(a)" value={vet.vet_name} />
          <InfoRow icon={Phone} label="Telefone" value={vet.phone} />
          <InfoRow icon={Mail} label="E-mail" value={vet.email} />
          <InfoRow icon={MapPin} label="Endereço" value={vet.address} />
          <InfoRow icon={StickyNote} label="Observações" value={vet.notes} />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">Nenhuma veterinária cadastrada. Toque para adicionar 👆</p>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>🏥 Dados da Veterinária</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome da clínica</label>
              <Input value={form.clinic_name} onChange={e => setForm({ ...form, clinic_name: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome do(a) veterinário(a)</label>
              <Input value={form.vet_name} onChange={e => setForm({ ...form, vet_name: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Telefone</label>
              <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 3333-3333" className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">E-mail</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Endereço completo</label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Observações</label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Horários, convênios..." className="rounded-xl" />
            </div>
            <Button onClick={save} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
