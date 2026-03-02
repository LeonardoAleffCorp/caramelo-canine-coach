// Dog-themed emoji stickers that can be placed around the avatar
export interface StickerDef {
  id: string;
  emoji: string;
  name: string;
  category: 'emotions' | 'activities' | 'food' | 'misc';
  is_premium: boolean;
}

export const dogStickers: StickerDef[] = [
  // Emoções
  { id: 'happy', emoji: '😊', name: 'Feliz', category: 'emotions', is_premium: false },
  { id: 'love', emoji: '😍', name: 'Apaixonado', category: 'emotions', is_premium: false },
  { id: 'angry', emoji: '😡', name: 'Brabo', category: 'emotions', is_premium: false },
  { id: 'sad', emoji: '😢', name: 'Triste', category: 'emotions', is_premium: false },
  { id: 'sleepy', emoji: '😴', name: 'Soninho', category: 'emotions', is_premium: false },
  { id: 'tongue', emoji: '😋', name: 'Delícia', category: 'emotions', is_premium: false },
  { id: 'cool', emoji: '😎', name: 'Estiloso', category: 'emotions', is_premium: false },
  { id: 'scared', emoji: '😱', name: 'Assustado', category: 'emotions', is_premium: false },
  { id: 'wink', emoji: '😜', name: 'Sapeca', category: 'emotions', is_premium: false },
  { id: 'cry-laugh', emoji: '🤣', name: 'Chorando de rir', category: 'emotions', is_premium: false },
  // Atividades
  { id: 'bone', emoji: '🦴', name: 'Ossinho', category: 'activities', is_premium: false },
  { id: 'ball', emoji: '⚾', name: 'Bolinha', category: 'activities', is_premium: false },
  { id: 'paw', emoji: '🐾', name: 'Patinha', category: 'activities', is_premium: false },
  { id: 'running', emoji: '🏃', name: 'Correndo', category: 'activities', is_premium: false },
  { id: 'sleeping', emoji: '💤', name: 'Dormindo', category: 'activities', is_premium: false },
  { id: 'playing', emoji: '🎾', name: 'Brincar', category: 'activities', is_premium: false },
  // Comida
  { id: 'meat', emoji: '🍖', name: 'Carne', category: 'food', is_premium: false },
  { id: 'bowl', emoji: '🥣', name: 'Ração', category: 'food', is_premium: false },
  { id: 'cookie', emoji: '🍪', name: 'Biscoito', category: 'food', is_premium: false },
  { id: 'water', emoji: '💧', name: 'Água', category: 'food', is_premium: false },
  // Misc
  { id: 'heart', emoji: '❤️', name: 'Coração', category: 'misc', is_premium: false },
  { id: 'star', emoji: '⭐', name: 'Estrela', category: 'misc', is_premium: false },
  { id: 'fire', emoji: '🔥', name: 'Fogo', category: 'misc', is_premium: false },
  { id: 'sparkle', emoji: '✨', name: 'Brilho', category: 'misc', is_premium: false },
  { id: 'rainbow', emoji: '🌈', name: 'Arco-íris', category: 'misc', is_premium: true },
  { id: 'crown', emoji: '👑', name: 'Coroa', category: 'misc', is_premium: true },
  { id: 'sunglasses', emoji: '🕶️', name: 'Óculos', category: 'misc', is_premium: true },
  { id: 'party', emoji: '🎉', name: 'Festa', category: 'misc', is_premium: true },
];

export function getStickerById(id: string): StickerDef | undefined {
  return dogStickers.find(s => s.id === id);
}

export function getStickersByCategory(category: string): StickerDef[] {
  return dogStickers.filter(s => s.category === category);
}

// 8 positions around the avatar square
export const STICKER_POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'mid-left', 'mid-right',
  'bottom-left', 'bottom-center', 'bottom-right',
] as const;

export type StickerPosition = typeof STICKER_POSITIONS[number];

export interface EquippedSticker {
  stickerId: string;
  position: StickerPosition;
}
