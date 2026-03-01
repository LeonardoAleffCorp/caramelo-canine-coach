/**
 * Breed-specific age lifecycle classification.
 * Based on veterinary guidelines for dog life stages.
 * Small breeds live longer, giant breeds age faster.
 */

type LifeStage = 'Filhote' | 'Jovem Adulto' | 'Adulto' | 'Idoso';

interface LifeStageInfo {
  stage: LifeStage;
  emoji: string;
  color: string;
}

// Age thresholds in months for each size category
const ageThresholds: Record<string, { jovemAdulto: number; adulto: number; idoso: number }> = {
  'mini':    { jovemAdulto: 10, adulto: 18, idoso: 132 },   // 11 anos
  'pequeno': { jovemAdulto: 10, adulto: 18, idoso: 120 },   // 10 anos
  'médio':   { jovemAdulto: 12, adulto: 24, idoso: 96 },    // 8 anos
  'grande':  { jovemAdulto: 12, adulto: 24, idoso: 84 },    // 7 anos
  'gigante': { jovemAdulto: 14, adulto: 30, idoso: 72 },    // 6 anos
};

// Breed to size mapping
const breedSizeMap: Record<string, string> = {
  'chihuahua': 'mini',
  'yorkshire': 'mini',
  'yorkshire terrier': 'mini',
  'maltês': 'mini',
  'maltes': 'mini',
  'maltese': 'mini',
  'lhasa apso': 'mini',
  'lhasa-apso': 'mini',
  'pug': 'pequeno',
  'shih tzu': 'pequeno',
  'shih-tzu': 'pequeno',
  'dachshund': 'pequeno',
  'teckel': 'pequeno',
  'salsicha': 'pequeno',
  'poodle': 'pequeno',
  'schnauzer': 'pequeno',
  'schnauzer miniatura': 'pequeno',
  'beagle': 'médio',
  'cocker spaniel': 'médio',
  'cocker': 'médio',
  'bulldog francês': 'médio',
  'bulldog frances': 'médio',
  'french bulldog': 'médio',
  'border collie': 'médio',
  'border-collie': 'médio',
  'vira-lata': 'médio',
  'vira-lata/srd': 'médio',
  'srd': 'médio',
  'pitbull': 'médio',
  'pit bull': 'médio',
  'labrador': 'grande',
  'labrador retriever': 'grande',
  'golden retriever': 'grande',
  'golden': 'grande',
  'husky': 'grande',
  'husky siberiano': 'grande',
  'rottweiler': 'grande',
  'pastor alemão': 'grande',
  'pastor-alemão': 'grande',
  'german shepherd': 'grande',
};

function getBreedSize(breed: string): string {
  const normalized = breed.toLowerCase().trim();
  if (breedSizeMap[normalized]) return breedSizeMap[normalized];
  for (const [key, size] of Object.entries(breedSizeMap)) {
    if (normalized.includes(key) || key.includes(normalized)) return size;
  }
  return 'médio';
}

export function getLifeStage(ageMonths: number, breed: string): LifeStageInfo {
  const size = getBreedSize(breed);
  const thresholds = ageThresholds[size] || ageThresholds['médio'];

  if (ageMonths < thresholds.jovemAdulto) {
    return { stage: 'Filhote', emoji: '🐶', color: 'text-blue-500' };
  }
  if (ageMonths < thresholds.adulto) {
    return { stage: 'Jovem Adulto', emoji: '🐕', color: 'text-green-500' };
  }
  if (ageMonths < thresholds.idoso) {
    return { stage: 'Adulto', emoji: '🐕‍🦺', color: 'text-primary' };
  }
  return { stage: 'Idoso', emoji: '🧓', color: 'text-amber-500' };
}
