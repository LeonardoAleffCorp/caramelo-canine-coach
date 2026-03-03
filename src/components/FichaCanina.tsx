import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePet } from '@/hooks/usePet';
import PetAvatarPreview from '@/components/PetAvatarPreview';
import { getWeightLabel } from '@/lib/weight';
import { type EquippedSticker } from '@/lib/stickerEmojis';
import { User, Phone, Mail, MapPin, Building2, Dog, Syringe, Pill, HeartPulse, Share2, Download, FileDown, Loader2 } from 'lucide-react';
import { getLifeStage } from '@/lib/breedAge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FichaProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age_months: number;
    birth_date: string | null;
    weight_kg: number | null;
    photo_url: string | null;
  };
}

export default function FichaCanina({ pet }: FichaProps) {
  const { user } = useAuth();
  const { weightStatus } = usePet();
  const [tutor, setTutor] = useState<any>(null);
  const [vet, setVet] = useState<any>(null);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [breedSize, setBreedSize] = useState('médio');
  const [equippedStickers, setEquippedStickers] = useState<EquippedSticker[]>([]);
  const [petColor, setPetColor] = useState<string | undefined>();
  const [frameId, setFrameId] = useState<string | undefined>();
  const [bgColorId, setBgColorId] = useState<string | undefined>();
  const fichaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pet || !user) return;
    const load = async () => {
      const [tutorRes, vetRes, vaccRes, disRes, medRes, breedRes] = await Promise.all([
        supabase.from('tutor_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('vet_clinics').select('*').eq('pet_id', pet.id).maybeSingle(),
        supabase.from('vaccines').select('*').eq('pet_id', pet.id).order('applied_date', { ascending: false }).limit(5),
        supabase.from('pet_diseases').select('*').eq('pet_id', pet.id).is('deleted_at', null).limit(5),
        supabase.from('pet_medications').select('*').eq('pet_id', pet.id).is('deleted_at', null).limit(5),
        supabase.from('breeds').select('size_category').eq('name', pet.breed).maybeSingle(),
      ]);
      if (tutorRes.data) setTutor(tutorRes.data);
      if (vetRes.data) setVet(vetRes.data);
      if (vaccRes.data) setVaccines(vaccRes.data);
      if (disRes.data) setDiseases(disRes.data);
      if (medRes.data) setMedications(medRes.data);
      if (breedRes.data) setBreedSize(breedRes.data.size_category);
    };
    load();

    const storedStickers = localStorage.getItem(`avatar_stickers_${pet.id}`);
    if (storedStickers) try { setEquippedStickers(JSON.parse(storedStickers)); } catch { }
    const storedColor = localStorage.getItem(`avatar_color_${pet.id}`);
    if (storedColor) setPetColor(storedColor);
    const storedFrame = localStorage.getItem(`avatar_frame_${pet.id}`);
    if (storedFrame) setFrameId(storedFrame);
    const storedBg = localStorage.getItem(`avatar_bg_${pet.id}`);
    if (storedBg) setBgColorId(storedBg);
  }, [pet, user]);

  const currentWeight = pet.weight_kg ? Number(pet.weight_kg) : null;
  const weightInfo = weightStatus ? getWeightLabel(weightStatus) : null;

  const lifeStage = getLifeStage(pet.age_months, pet.breed);
  const ageText = `${Math.floor(pet.age_months / 12)} anos e ${pet.age_months % 12} meses (${lifeStage.emoji} ${lifeStage.stage})`;

  const [exporting, setExporting] = useState(false);

  const exportFichaPdf = async () => {
    if (!fichaRef.current) return;
    setExporting(true);
    toast.loading('Gerando PDF bonito... 🐾', { id: 'pdf-export' });

    try {
      // Capture the ficha div as an image
      const canvas = await html2canvas(fichaRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      
      // Scale image to fit page width
      const ratio = contentWidth / (imgWidth / 2); // /2 because scale:2
      const scaledHeight = (imgHeight / 2) * ratio;

      const pdf = new jsPDF('p', 'mm', 'a4');

      // If content fits in one page
      if (scaledHeight <= pdfHeight - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, scaledHeight);
      } else {
        // Multi-page: slice the canvas
        const pageContentHeight = pdfHeight - margin * 2;
        const sourceSliceHeight = pageContentHeight / ratio * 2; // in canvas pixels
        let yOffset = 0;
        let page = 0;

        while (yOffset < imgHeight) {
          if (page > 0) pdf.addPage();
          
          // Create a slice canvas
          const sliceHeight = Math.min(sourceSliceHeight, imgHeight - yOffset);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = imgWidth;
          sliceCanvas.height = sliceHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, -yOffset);
            const sliceData = sliceCanvas.toDataURL('image/png');
            const displayHeight = (sliceHeight / 2) * ratio;
            pdf.addImage(sliceData, 'PNG', margin, margin, contentWidth, displayHeight);
          }
          
          yOffset += sourceSliceHeight;
          page++;
        }
      }

      // Add footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      const footerText = `Ficha Canina - ${pet.name} | Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | Caramelo Canine Coach`;
      pdf.text(footerText, pdfWidth / 2, pdfHeight - 5, { align: 'center' });

      const fileName = `ficha-${pet.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;

      // Try to share as file on mobile
      if (navigator.share && navigator.canShare) {
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Ficha Canina - ${pet.name}`,
              files: [file],
            });
            toast.success('Ficha compartilhada! 📤', { id: 'pdf-export' });
            return;
          } catch {
            // User cancelled, fall through to download
          }
        }
      }

      // Fallback: download
      pdf.save(fileName);
      toast.success('PDF baixado! 📥', { id: 'pdf-export' });
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Erro ao gerar PDF 😔', { id: 'pdf-export' });
    } finally {
      setExporting(false);
    }
  };

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoLine = ({ label, value }: { label: string; value: string | null | undefined }) => (
    value ? (
      <div className="flex justify-between py-1 border-b border-border/50 last:border-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground text-right max-w-[60%]">{value}</span>
      </div>
    ) : null
  );

  const tutorAddress = tutor ? [tutor.address_street, tutor.address_number, tutor.address_neighborhood, tutor.address_city, tutor.address_state].filter(Boolean).join(', ') : null;

  return (
    <div className="mt-4 space-y-4 pb-4" ref={fichaRef}>
      {/* Export button */}
      <Button onClick={exportFichaPdf} variant="outline" className="w-full rounded-xl gap-2" disabled={exporting}>
        {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        {exporting ? 'Gerando PDF...' : 'Baixar / Compartilhar PDF'}
      </Button>

      {/* Pet header */}
      <div className="flex flex-col items-center">
        <PetAvatarPreview
          breed={pet.breed}
          equippedStickers={equippedStickers}
          size="md"
          weightStatus={weightStatus || undefined}
          colorId={petColor}
          frameId={frameId}
          bgColor={bgColorId}
        />
        <h2 className="mt-2 text-xl font-extrabold text-foreground">{pet.name}</h2>
        {weightInfo && (
          <span className={`text-xs font-bold ${weightInfo.color}`}>{weightInfo.emoji} {weightInfo.label}</span>
        )}
      </div>

      {/* Dog data */}
      <Section icon={Dog} title="Dados do Dog 🐶">
        <InfoLine label="Nome" value={pet.name} />
        <InfoLine label="Raça" value={pet.breed} />
        <InfoLine label="Idade" value={ageText} />
        <InfoLine label="Peso" value={currentWeight ? `${currentWeight} kg` : null} />
        <InfoLine label="Nascimento" value={pet.birth_date ? new Date(pet.birth_date + 'T12:00:00').toLocaleDateString('pt-BR') : null} />
        <InfoLine label="Porte" value={breedSize} />
      </Section>

      {/* Tutor data */}
      <Section icon={User} title="Dados do Tutor 👤">
        {tutor ? (
          <>
            <InfoLine label="Nome" value={tutor.full_name} />
            <InfoLine label="E-mail" value={tutor.email} />
            <InfoLine label="Telefone" value={tutor.phone} />
            <InfoLine label="Endereço" value={tutorAddress} />
            <InfoLine label="CEP" value={tutor.address_zip} />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Não cadastrado — vá na aba Tutor para adicionar.</p>
        )}
      </Section>

      {/* Vet data */}
      <Section icon={Building2} title="Dados da Veterinária 🏥">
        {vet ? (
          <>
            <InfoLine label="Clínica" value={vet.clinic_name} />
            <InfoLine label="Veterinário(a)" value={vet.vet_name} />
            <InfoLine label="Telefone" value={vet.phone} />
            <InfoLine label="E-mail" value={vet.email} />
            <InfoLine label="Endereço" value={vet.address} />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Não cadastrado — vá na aba Veterinária para adicionar.</p>
        )}
      </Section>

      {/* Vaccines */}
      <Section icon={Syringe} title="Vacinas 💉">
        {vaccines.length > 0 ? vaccines.map(v => (
          <InfoLine key={v.id} label={v.name} value={new Date(v.applied_date).toLocaleDateString('pt-BR')} />
        )) : <p className="text-xs text-muted-foreground">Nenhuma vacina registrada.</p>}
      </Section>

      {/* Diseases */}
      <Section icon={HeartPulse} title="Doenças 🦠">
        {diseases.length > 0 ? diseases.map(d => (
          <InfoLine key={d.id} label={d.disease_name} value={d.treatment_status === 'em_tratamento' ? '🔴 Em tratamento' : '🟢 Concluído'} />
        )) : <p className="text-xs text-muted-foreground">Nenhuma doença registrada.</p>}
      </Section>

      {/* Medications */}
      <Section icon={Pill} title="Medicações 💊">
        {medications.length > 0 ? medications.map(m => (
          <InfoLine key={m.id} label={m.name} value={m.dosage || m.treatment_status} />
        )) : <p className="text-xs text-muted-foreground">Nenhuma medicação registrada.</p>}
      </Section>
    </div>
  );
}
