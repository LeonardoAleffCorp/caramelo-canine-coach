export function getLevel(xp: number): string {
  if (xp >= 2000) return 'Gênio Canino';
  if (xp >= 1000) return 'Mestre';
  if (xp >= 500) return 'Esperto';
  if (xp >= 200) return 'Aprendiz';
  return 'Filhote';
}

export function getLevelEmoji(level: string): string {
  switch (level) {
    case 'Gênio Canino': return '🧠';
    case 'Mestre': return '🏆';
    case 'Esperto': return '⭐';
    case 'Aprendiz': return '📚';
    default: return '🐶';
  }
}

export function getXpForDifficulty(difficulty: number): number {
  switch (difficulty) {
    case 1: return 50;
    case 2: return 75;
    case 3: return 100;
    default: return 50;
  }
}

export function getNextLevelXp(xp: number): number {
  if (xp < 200) return 200;
  if (xp < 500) return 500;
  if (xp < 1000) return 1000;
  if (xp < 2000) return 2000;
  return 2000;
}

export function getLevelProgress(xp: number): number {
  const thresholds = [0, 200, 500, 1000, 2000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      const next = thresholds[i + 1] || thresholds[i];
      if (next === thresholds[i]) return 100;
      return ((xp - thresholds[i]) / (next - thresholds[i])) * 100;
    }
  }
  return 0;
}
