import { getBreedBodyImage } from '@/lib/breedBodyImages';
import { getBreedWeightImage } from '@/lib/breedWeightImages';
import { getBreedColorImage } from '@/lib/breedColorImages';
import { getStickerById, type EquippedSticker, type StickerPosition } from '@/lib/stickerEmojis';
import { getFrameById } from '@/lib/avatarFrames';
import { getBgColorById } from '@/lib/avatarFrames';

interface PetAvatarPreviewProps {
  breed: string;
  equippedStickers?: EquippedSticker[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  weightStatus?: 'underweight' | 'healthy' | 'overweight' | 'obese';
  colorId?: string;
  frameId?: string;
  bgColor?: string;
}

const sizeConfig = {
  sm: { container: 'h-28 w-28', img: 'h-24 w-24', emoji: 'text-lg' },
  md: { container: 'h-44 w-44', img: 'h-40 w-40', emoji: 'text-2xl' },
  lg: { container: 'h-64 w-64', img: 'h-56 w-56', emoji: 'text-3xl' },
};

// Position styles for the 7 slots around the avatar
const positionStyles: Record<StickerPosition, React.CSSProperties> = {
  'top-left':      { top: '0px', left: '0px', transform: 'translate(-30%, -30%)' },
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
  colorId,
  frameId,
  bgColor,
}: PetAvatarPreviewProps) {
  const config = sizeConfig[size];
  
  let bodyImg = getBreedBodyImage(breed);
  
  if (weightStatus) {
    bodyImg = getBreedWeightImage(breed, weightStatus);
  } else if (colorId) {
    const colorImg = getBreedColorImage(breed, colorId);
    if (colorImg) bodyImg = colorImg;
  }

  const frame = frameId ? getFrameById(frameId) : undefined;
  const frameClasses = frame && frame.id !== 'none' ? frame.borderStyle : '';
  
  const bg = bgColor ? getBgColorById(bgColor) : undefined;
  const bgClasses = bg ? bg.color : 'bg-gradient-to-b from-accent to-accent/50';

  return (
    <div className={`relative flex items-center justify-center rounded-3xl ${bgClasses} shadow-inner ${frameClasses} ${config.container} ${className}`}>
      <img
        src={bodyImg}
        alt="Avatar"
        className={`${config.img} rounded-2xl object-contain`}
      />

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
