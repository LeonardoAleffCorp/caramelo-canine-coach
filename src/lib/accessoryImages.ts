import hatWizard from '@/assets/accessories/hat-wizard.png';
import hatSanta from '@/assets/accessories/hat-santa.png';
import hatParty from '@/assets/accessories/hat-party.png';
import hatCowboy from '@/assets/accessories/hat-cowboy.png';
import hatCrown from '@/assets/accessories/hat-crown.png';
import glassesSun from '@/assets/accessories/glasses-sun.png';
import glassesHeart from '@/assets/accessories/glasses-heart.png';
import glassesNerd from '@/assets/accessories/glasses-nerd.png';
import glassesStar from '@/assets/accessories/glasses-star.png';
import glassesMonocle from '@/assets/accessories/glasses-monocle.png';
import collarBandana from '@/assets/accessories/collar-bandana.png';
import collarBowtie from '@/assets/accessories/collar-bowtie.png';
import collarBell from '@/assets/accessories/collar-bell.png';
import collarFlowers from '@/assets/accessories/collar-flowers.png';
import collarScarf from '@/assets/accessories/collar-scarf.png';

export interface AccessoryDef {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'collar';
  image: string;
  emoji: string;
  is_premium: boolean;
}

// Position config for each category overlay
export const accessoryPositions = {
  hat: { top: '-12%', left: '15%', width: '70%' },
  glasses: { top: '28%', left: '18%', width: '64%' },
  collar: { top: '62%', left: '10%', width: '80%' },
} as const;

export const specialAccessories: AccessoryDef[] = [
  // Chapéus
  { id: 'hat-wizard', name: 'Mago', category: 'hat', image: hatWizard, emoji: '🧙', is_premium: false },
  { id: 'hat-santa', name: 'Papai Noel', category: 'hat', image: hatSanta, emoji: '🎅', is_premium: false },
  { id: 'hat-party', name: 'Festa', category: 'hat', image: hatParty, emoji: '🥳', is_premium: false },
  { id: 'hat-cowboy', name: 'Cowboy', category: 'hat', image: hatCowboy, emoji: '🤠', is_premium: false },
  { id: 'hat-crown', name: 'Coroa', category: 'hat', image: hatCrown, emoji: '👑', is_premium: true },
  // Óculos
  { id: 'glasses-sun', name: 'Escuros', category: 'glasses', image: glassesSun, emoji: '😎', is_premium: false },
  { id: 'glasses-heart', name: 'Coração', category: 'glasses', image: glassesHeart, emoji: '💖', is_premium: false },
  { id: 'glasses-nerd', name: 'Nerd', category: 'glasses', image: glassesNerd, emoji: '🤓', is_premium: false },
  { id: 'glasses-star', name: 'Estrela', category: 'glasses', image: glassesStar, emoji: '⭐', is_premium: true },
  { id: 'glasses-monocle', name: 'Monóculo', category: 'glasses', image: glassesMonocle, emoji: '🧐', is_premium: true },
  // Colares
  { id: 'collar-bandana', name: 'Bandana', category: 'collar', image: collarBandana, emoji: '🎀', is_premium: false },
  { id: 'collar-bowtie', name: 'Gravata', category: 'collar', image: collarBowtie, emoji: '🎩', is_premium: false },
  { id: 'collar-bell', name: 'Sininho', category: 'collar', image: collarBell, emoji: '🔔', is_premium: false },
  { id: 'collar-flowers', name: 'Flores', category: 'collar', image: collarFlowers, emoji: '🌸', is_premium: true },
  { id: 'collar-scarf', name: 'Cachecol', category: 'collar', image: collarScarf, emoji: '🧣', is_premium: true },
];

export function getAccessoryById(id: string): AccessoryDef | undefined {
  return specialAccessories.find(a => a.id === id);
}

export function getAccessoriesByCategory(category: string): AccessoryDef[] {
  return specialAccessories.filter(a => a.category === category);
}
