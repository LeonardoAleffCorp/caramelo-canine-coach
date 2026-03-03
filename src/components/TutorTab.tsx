import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, User, Phone, Mail, MapPin, Camera, Trash2 } from 'lucide-react';

interface TutorProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address_street: string | null;
  address_number: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  photo_url: string | null;
}

export default function TutorTab() {
  const { user } = useAuth();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    address_street: '', address_number: '', address_neighborhood: '',
    address_city: '', address_state: '', address_zip: '', photo_url: '',
  });

  const fetchTutor = async () => {
    if (!user) return;
    const { data } = await supabase.from('tutor_profiles').select('*').eq('user_id', user.id).maybeSingle();
    if (data) setTutor(data as TutorProfile);
  };

  useEffect(() => { fetchTutor(); }, [user]);

  const openEdit = () => {
    if (tutor) {
      setForm({
        full_name: tutor.full_name || '',
        email: tutor.email || user?.email || '',
        phone: tutor.phone || '',
        address_street: tutor.address_street || '',
        address_number: tutor.address_number || '',
        address_neighborhood: tutor.address_neighborhood || '',
        address_city: tutor.address_city || '',
        address_state: tutor.address_state || '',
        address_zip: tutor.address_zip || '',
        photo_url: tutor.photo_url || '',
      });
    } else {
      setForm({
        full_name: '', email: user?.email || '', phone: '',
        address_street: '', address_number: '', address_neighborhood: '',
        address_city: '', address_state: '', address_zip: '', photo_url: '',
      });
    }
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `tutor/${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(path);

      setForm({ ...form, photo_url: publicUrl });
      toast.success('Foto carregada! 📸');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setForm({ ...form, photo_url: '' });
  };

  const save = async () => {
    if (!user) return;
    if (tutor) {
      await supabase.from('tutor_profiles').update({ ...form }).eq('id', tutor.id);
    } else {
      await supabase.from('tutor_profiles').insert({ user_id: user.id, ...form });
    }
    toast.success('Dados do tutor salvos! 👤');
    setShowModal(false);
    fetchTutor();
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

  const fullAddress = [tutor?.address_street, tutor?.address_number, tutor?.address_neighborhood, tutor?.address_city, tutor?.address_state, tutor?.address_zip].filter(Boolean).join(', ');

  return (
    <div className="mt-4">
      <Button onClick={openEdit} className="mb-4 w-full rounded-xl">
        <Pencil className="mr-2 h-4 w-4" /> {tutor ? 'Editar Dados do Tutor' : 'Adicionar Dados do Tutor'}
      </Button>

      {tutor ? (
        <div className="rounded-2xl bg-card p-5 shadow-sm space-y-1">
          {tutor.photo_url && (
            <div className="flex justify-center mb-4">
              <img src={tutor.photo_url} alt="Foto do tutor" className="h-20 w-20 rounded-full object-cover border-2 border-primary/20" />
            </div>
          )}
          <InfoRow icon={User} label="Nome" value={tutor.full_name} />
          <InfoRow icon={Mail} label="E-mail" value={tutor.email} />
          <InfoRow icon={Phone} label="Telefone" value={tutor.phone} />
          <InfoRow icon={MapPin} label="Endereço" value={fullAddress || null} />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">Nenhum dado cadastrado. Toque para adicionar 👆</p>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>👤 Dados do Tutor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {/* Photo upload section */}
            <div className="flex flex-col items-center gap-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Foto do tutor</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="relative h-20 w-20 rounded-full overflow-hidden bg-accent border-2 border-primary/20 transition-transform active:scale-95"
                  disabled={uploading}
                >
                  {form.photo_url ? (
                    <img src={form.photo_url} alt="Tutor" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Camera className="h-6 w-6" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Camera className="h-3 w-3 text-primary-foreground" />
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                      <span className="text-xs font-bold animate-pulse">...</span>
                    </div>
                  )}
                </button>
                {form.photo_url && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <p className="text-[10px] text-muted-foreground">Toque para tirar foto ou escolher da galeria</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome completo</label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">E-mail</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Telefone</label>
              <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Rua</label>
                <Input value={form.address_street} onChange={e => setForm({ ...form, address_street: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nº</label>
                <Input value={form.address_number} onChange={e => setForm({ ...form, address_number: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Bairro</label>
              <Input value={form.address_neighborhood} onChange={e => setForm({ ...form, address_neighborhood: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Cidade</label>
                <Input value={form.address_city} onChange={e => setForm({ ...form, address_city: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Estado</label>
                <Input value={form.address_state} onChange={e => setForm({ ...form, address_state: e.target.value })} placeholder="SP" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">CEP</label>
              <Input value={form.address_zip} onChange={e => setForm({ ...form, address_zip: e.target.value })} placeholder="00000-000" className="rounded-xl" />
            </div>
            <Button onClick={save} className="w-full rounded-xl">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
