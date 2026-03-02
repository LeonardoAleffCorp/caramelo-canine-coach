import { getBreedBodyImage } from '@/lib/breedBodyImages';
import { getBreedWeightImage } from '@/lib/breedWeightImages';
import { getStickerById, type EquippedSticker, type StickerPosition } from '@/lib/stickerEmojis';

interface PetAvatarPreviewProps {
  breed: string;
  equippedStickers?: EquippedSticker[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  weightStatus?: 'underweight' | 'healthy' | 'overweight' | 'obese';
}

const sizeConfig = {
  sm: { container: 'h-28 w-28', img: 'h-24 w-24', emoji: 'text-lg' },
  md: { container: 'h-44 w-44', img: 'h-40 w-40', emoji: 'text-2xl' },
  lg: { container: 'h-64 w-64', img: 'h-56 w-56', emoji: 'text-3xl' },
};

// Position styles for the 8 slots around the avatar
const positionStyles: Record<StickerPosition, React.CSSProperties> = {
  'top-left':      { top: '-8px', left: '-8px' },
  'top-center':    { top: '-12px', left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: '-8px', right: '-8px' },
  'mid-left':      { top: '50%', left: '-12px', transform: 'translateY(-50%)' },
  'mid-right':     { top: '50%', right: '-12px', transform: 'translateY(-50%)' },
  'bottom-left':   { bottom: '-8px', left: '-8px' },
  'bottom-center': { bottom: '-12px', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: '-8px', right: '-8px' },
};

export default function PetAvatarPreview({ breed, equippedStickers = [], size = 'lg', className = '', weightStatus }: PetAvatarPreviewProps) {
  const config = sizeConfig[size];
  const bodyImg = weightStatus ? getBreedWeightImage(breed, weightStatus) : getBreedBodyImage(breed);

  return (
    <div className={`relative flex items-center justify-center rounded-3xl bg-gradient-to-b from-accent to-accent/50 shadow-inner ${config.container} ${className}`}>
      {/* Base breed body image */}
      <img
        src={bodyImg}
        alt="Avatar"
        className={`${config.img} rounded-2xl object-contain`}
      />

      {/* Emoji stickers around the avatar */}
      {equippedStickers.map((sticker) => {
        const def = getStickerById(sticker.stickerId);
        if (!def) return null;
        return (
          <span
            key={sticker.position}
            className={`absolute ${config.emoji} pointer-events-none drop-shadow-md`}
            style={{ ...positionStyles[sticker.position], zIndex: 10 }}
          >
            {def.emoji}
          </span>
        );
      })}
    </div>
  );
}
