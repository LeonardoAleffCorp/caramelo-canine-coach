import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

interface PetPhotoUploadProps {
  petId?: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  size?: 'sm' | 'lg';
}

export default function PetPhotoUpload({ petId, currentUrl, onUploaded, size = 'lg' }: PetPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClass = size === 'lg' ? 'h-28 w-28' : 'h-16 w-16';
  const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-4 w-4';
  const badgeSize = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${petId || 'temp'}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(path);

      onUploaded(publicUrl);
      toast.success('Foto atualizada! 📸');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`relative ${sizeClass} rounded-full overflow-hidden bg-accent border-2 border-primary/20 transition-transform active:scale-95`}
      disabled={uploading}
    >
      {currentUrl ? (
        <img src={currentUrl} alt="Pet" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Camera className={iconSize} />
        </div>
      )}
      <div className={`absolute bottom-0 right-0 ${badgeSize} rounded-full bg-primary flex items-center justify-center`}>
        <Camera className="h-3 w-3 text-primary-foreground" />
      </div>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
          <span className="text-xs font-bold animate-pulse">...</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
    </button>
  );
}
