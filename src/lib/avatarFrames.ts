export interface AvatarFrame {
  id: string;
  name: string;
  emoji: string;
  borderStyle: string; // Tailwind classes for the frame
  is_premium: boolean;
}

export const avatarFrames: AvatarFrame[] = [
  { id: 'none', name: 'Sem moldura', emoji: '⬜', borderStyle: '', is_premium: false },
  { id: 'golden', name: 'Dourada', emoji: '🟡', borderStyle: 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/30', is_premium: false },
  { id: 'rainbow', name: 'Arco-íris', emoji: '🌈', borderStyle: 'ring-4 ring-pink-400 shadow-lg shadow-pink-400/20', is_premium: false },
  { id: 'fire', name: 'Fogo', emoji: '🔥', borderStyle: 'ring-4 ring-orange-500 shadow-lg shadow-orange-500/30', is_premium: false },
  { id: 'ice', name: 'Gelo', emoji: '❄️', borderStyle: 'ring-4 ring-sky-300 shadow-lg shadow-sky-300/30', is_premium: false },
  { id: 'nature', name: 'Natureza', emoji: '🌿', borderStyle: 'ring-4 ring-green-500 shadow-lg shadow-green-500/30', is_premium: false },
  { id: 'royal', name: 'Real', emoji: '👑', borderStyle: 'ring-[6px] ring-amber-500 shadow-xl shadow-amber-500/40', is_premium: false },
  { id: 'love', name: 'Amor', emoji: '💖', borderStyle: 'ring-4 ring-rose-400 shadow-lg shadow-rose-400/30', is_premium: false },
  { id: 'neon', name: 'Neon', emoji: '💜', borderStyle: 'ring-4 ring-violet-500 shadow-lg shadow-violet-500/40', is_premium: true },
  { id: 'diamond', name: 'Diamante', emoji: '💎', borderStyle: 'ring-[6px] ring-cyan-300 shadow-xl shadow-cyan-300/50', is_premium: true },
  { id: 'galaxy', name: 'Galáxia', emoji: '🌌', borderStyle: 'ring-4 ring-indigo-500 shadow-xl shadow-indigo-500/40', is_premium: true },
  { id: 'champion', name: 'Campeão', emoji: '🏆', borderStyle: 'ring-[6px] ring-yellow-500 shadow-xl shadow-yellow-600/50', is_premium: true },
];

export function getFrameById(id: string): AvatarFrame | undefined {
  return avatarFrames.find(f => f.id === id);
}

export interface AvatarBgColor {
  id: string;
  name: string;
  color: string; // Tailwind bg class
  preview: string; // small preview color
}

export const avatarBgColors: AvatarBgColor[] = [
  { id: 'default', name: 'Padrão', color: 'bg-gradient-to-b from-accent to-accent/50', preview: 'hsl(var(--accent))' },
  { id: 'sky', name: 'Céu', color: 'bg-gradient-to-b from-sky-200 to-sky-100', preview: '#bae6fd' },
  { id: 'sunset', name: 'Pôr do sol', color: 'bg-gradient-to-b from-orange-200 to-amber-100', preview: '#fed7aa' },
  { id: 'forest', name: 'Floresta', color: 'bg-gradient-to-b from-green-200 to-emerald-100', preview: '#bbf7d0' },
  { id: 'lavender', name: 'Lavanda', color: 'bg-gradient-to-b from-violet-200 to-purple-100', preview: '#ddd6fe' },
  { id: 'rose', name: 'Rosa', color: 'bg-gradient-to-b from-rose-200 to-pink-100', preview: '#fecdd3' },
  { id: 'ocean', name: 'Oceano', color: 'bg-gradient-to-b from-blue-300 to-cyan-200', preview: '#93c5fd' },
  { id: 'sand', name: 'Areia', color: 'bg-gradient-to-b from-amber-100 to-yellow-50', preview: '#fef3c7' },
  { id: 'night', name: 'Noite', color: 'bg-gradient-to-b from-slate-700 to-slate-800', preview: '#334155' },
  { id: 'mint', name: 'Menta', color: 'bg-gradient-to-b from-teal-200 to-emerald-100', preview: '#99f6e4' },
];

export function getBgColorById(id: string): AvatarBgColor | undefined {
  return avatarBgColors.find(c => c.id === id);
}
