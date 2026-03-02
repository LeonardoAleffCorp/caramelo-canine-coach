import { getBreedBodyImage } from '@/lib/breedBodyImages';
import { getBreedWeightImage } from '@/lib/breedWeightImages';
import { getBreedColorImage } from '@/lib/breedColorImages';
import { getStickerById, type EquippedSticker, type StickerPosition } from '@/lib/stickerEmojis';

interface PetAvatarPreviewProps {
  breed: string;
  equippedStickers?: EquippedSticker[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  weightStatus?: 'underweight' | 'healthy' | 'overweight' | 'obese';
  colorId?: string; // Add colorId prop
}

const sizeConfig = {
  sm: { container: 'h-28 w-28', img: 'h-24 w-24', emoji: 'text-lg' },
  md: { container: 'h-44 w-44', img: 'h-40 w-40', emoji: 'text-2xl' },
  lg: { container: 'h-64 w-64', img: 'h-56 w-56', emoji: 'text-3xl' },
};

// Position styles for the 8 slots around the avatar
const positionStyles: Record<StickerPosition, React.CSSProperties> = {
  'top-left':      { top: '0px', left: '0px', transform: 'translate(-30%, -30%)' },
  'top-center':    { top: '-10px', left: '50%', transform: 'translate(-50%, -50%)' },
  'top-right':     { top: '0px', right: '0px', transform: 'translate(30%, -30%)' },
  'mid-left':      { top: '50%', left: '-10px', transform: 'translate(-50%, -50%)' },
  'mid-right':     { top: '50%', right: '-10px', transform: 'translate(50%, -50%)' },
  'bottom-left':   { bottom: '0px', left: '0px', transform: 'translate(-30%, 30%)' },
  'bottom-center': { bottom: '-10px', left: '50%', transform: 'translate(-50%, 50%)' },
  'bottom-right':  { bottom: '0px', right: '0px', transform: 'translate(30%, 30%)' },
};

export default function PetAvatarPreview({ 
  breed, 
  equippedStickers = [], 
  size = 'lg', 
  className = '', 
  weightStatus,
  colorId 
}: PetAvatarPreviewProps) {
  const config = sizeConfig[size];
  
  // Logic: 
  // 1. If weightStatus is present, it takes precedence (Saude tab) - uses weight images (no color variants for weight yet)
  // 2. Else if colorId is present and valid, use the color variant image
  // 3. Fallback to default breed body image
  
  let bodyImg = getBreedBodyImage(breed);
  
  if (weightStatus) {
    bodyImg = getBreedWeightImage(breed, weightStatus);
  } else if (colorId) {
    const colorImg = getBreedColorImage(breed, colorId);
    if (colorImg) bodyImg = colorImg;
  }

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
