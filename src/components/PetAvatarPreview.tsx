import { getBreedDefaultImage } from '@/lib/breedImages';

interface EquippedItem {
  category: string;
  emoji: string;
}

interface PetAvatarPreviewProps {
  breed: string;
  equippedItems: EquippedItem[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { container: 'h-24 w-24', img: 'h-16 w-16', emoji: 'text-xl', positions: { hat: '-top-1', glasses: 'top-5 right-2', collar: 'bottom-4', outfit: 'bottom-1 left-2', accessory: 'bottom-1 right-2' } },
  md: { container: 'h-40 w-40', img: 'h-24 w-24', emoji: 'text-2xl', positions: { hat: 'top-0', glasses: 'top-10 right-5', collar: 'bottom-8', outfit: 'bottom-3 left-4', accessory: 'bottom-3 right-4' } },
  lg: { container: 'h-56 w-56', img: 'h-32 w-32', emoji: 'text-4xl', positions: { hat: 'top-2', glasses: 'top-16 right-10', collar: 'bottom-14', outfit: 'bottom-6 left-10', accessory: 'bottom-6 right-10' } },
};

export default function PetAvatarPreview({ breed, equippedItems, size = 'lg', className = '' }: PetAvatarPreviewProps) {
  const config = sizeConfig[size];
  const breedImg = getBreedDefaultImage(breed);
  const byCategory = (cat: string) => equippedItems.find(i => i.category === cat);

  return (
    <div className={`relative flex items-center justify-center rounded-3xl bg-gradient-to-b from-accent to-accent/50 shadow-inner ${config.container} ${className}`}>
      <img src={breedImg} alt="Avatar" className={`${config.img} rounded-full object-cover shadow-lg`} />

      {byCategory('hat') && (
        <span className={`absolute ${config.positions.hat} ${config.emoji} animate-bounce-in`}>{byCategory('hat')!.emoji}</span>
      )}
      {byCategory('glasses') && (
        <span className={`absolute ${config.positions.glasses} ${config.emoji}`}>{byCategory('glasses')!.emoji}</span>
      )}
      {byCategory('collar') && (
        <span className={`absolute ${config.positions.collar} ${config.emoji}`}>{byCategory('collar')!.emoji}</span>
      )}
      {byCategory('outfit') && (
        <span className={`absolute ${config.positions.outfit} ${config.emoji}`}>{byCategory('outfit')!.emoji}</span>
      )}
      {byCategory('accessory') && (
        <span className={`absolute ${config.positions.accessory} ${config.emoji}`}>{byCategory('accessory')!.emoji}</span>
      )}
    </div>
  );
}
