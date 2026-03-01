import { getBreedBodyImage } from '@/lib/breedBodyImages';
import { getAccessoryById, accessoryPositions } from '@/lib/accessoryImages';

interface EquippedItem {
  category: string;
  emoji: string;
  accessoryId?: string;
}

interface PetAvatarPreviewProps {
  breed: string;
  equippedItems: EquippedItem[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { container: 'h-28 w-28', img: 'h-24 w-24' },
  md: { container: 'h-44 w-44', img: 'h-40 w-40' },
  lg: { container: 'h-64 w-64', img: 'h-56 w-56' },
};

export default function PetAvatarPreview({ breed, equippedItems, size = 'lg', className = '' }: PetAvatarPreviewProps) {
  const config = sizeConfig[size];
  const bodyImg = getBreedBodyImage(breed);

  // Get unique equipped accessories with images
  const equippedAccessories = equippedItems
    .filter(item => item.accessoryId)
    .map(item => {
      const def = getAccessoryById(item.accessoryId!);
      return def ? { ...def, position: accessoryPositions[def.category] } : null;
    })
    .filter(Boolean);

  return (
    <div className={`relative flex items-center justify-center rounded-3xl bg-gradient-to-b from-accent to-accent/50 shadow-inner ${config.container} ${className}`}>
      {/* Base breed body image */}
      <img
        src={bodyImg}
        alt="Avatar"
        className={`${config.img} rounded-2xl object-contain`}
      />

      {/* Accessory overlays */}
      {equippedAccessories.map((acc) => (
        <img
          key={acc!.id}
          src={acc!.image}
          alt={acc!.name}
          className="absolute pointer-events-none"
          style={{
            top: acc!.position.top,
            left: acc!.position.left,
            width: acc!.position.width,
            objectFit: 'contain',
            zIndex: acc!.category === 'hat' ? 10 : acc!.category === 'glasses' ? 20 : 5,
          }}
        />
      ))}

      {/* Fallback emoji overlays for non-special accessories */}
      {equippedItems
        .filter(item => !item.accessoryId)
        .map((item, i) => (
          <span
            key={`emoji-${i}`}
            className="absolute text-2xl"
            style={{
              top: item.category === 'hat' ? '0' : item.category === 'glasses' ? '30%' : '65%',
              zIndex: 30,
            }}
          >
            {item.emoji}
          </span>
        ))}
    </div>
  );
}
