// Breed coat color variants — realistic colors per breed
// Each breed has a default color + 1-2 extra color variants

export interface BreedColor {
  id: string;
  name: string; // Display name in Portuguese
}

export interface BreedColorConfig {
  defaultColor: string;
  colors: BreedColor[];
}

// Color configs per breed (normalized lowercase key)
export const breedColorConfigs: Record<string, BreedColorConfig> = {
  'golden-retriever': {
    defaultColor: 'dourado',
    colors: [
      { id: 'dourado', name: 'Dourado' },
      { id: 'creme', name: 'Creme' },
      { id: 'vermelho', name: 'Vermelho Escuro' },
    ],
  },
  'pug': {
    defaultColor: 'bege',
    colors: [
      { id: 'bege', name: 'Bege' },
      { id: 'preto', name: 'Preto' },
      { id: 'prata', name: 'Prata' },
    ],
  },
  'labrador': {
    defaultColor: 'amarelo',
    colors: [
      { id: 'amarelo', name: 'Amarelo' },
      { id: 'chocolate', name: 'Chocolate' },
      { id: 'preto', name: 'Preto' },
    ],
  },
  'pastor-alemao': {
    defaultColor: 'preto-castanho',
    colors: [
      { id: 'preto-castanho', name: 'Preto e Castanho' },
      { id: 'preto', name: 'Preto' },
      { id: 'cinza', name: 'Cinza Lobo' },
    ],
  },
  'bulldog-frances': {
    defaultColor: 'tigrado',
    colors: [
      { id: 'tigrado', name: 'Tigrado' },
      { id: 'creme', name: 'Creme' },
      { id: 'azul', name: 'Azul' },
    ],
  },
  'shih-tzu': {
    defaultColor: 'branco-dourado',
    colors: [
      { id: 'branco-dourado', name: 'Branco e Dourado' },
      { id: 'preto-branco', name: 'Preto e Branco' },
      { id: 'marrom', name: 'Marrom' },
    ],
  },
  'yorkshire': {
    defaultColor: 'azul-castanho',
    colors: [
      { id: 'azul-castanho', name: 'Azul e Castanho' },
      { id: 'preto-castanho', name: 'Preto e Castanho' },
      { id: 'dourado', name: 'Dourado' },
    ],
  },
  'vira-lata': {
    defaultColor: 'caramelo',
    colors: [
      { id: 'caramelo', name: 'Caramelo' },
      { id: 'preto', name: 'Preto' },
      { id: 'malhado', name: 'Malhado' },
    ],
  },
  'poodle': {
    defaultColor: 'branco',
    colors: [
      { id: 'branco', name: 'Branco' },
      { id: 'preto', name: 'Preto' },
      { id: 'marrom', name: 'Marrom' },
    ],
  },
  'border-collie': {
    defaultColor: 'preto-branco',
    colors: [
      { id: 'preto-branco', name: 'Preto e Branco' },
      { id: 'vermelho-branco', name: 'Vermelho e Branco' },
      { id: 'tricolor', name: 'Tricolor' },
    ],
  },
  'dachshund': {
    defaultColor: 'vermelho',
    colors: [
      { id: 'vermelho', name: 'Vermelho' },
      { id: 'preto-castanho', name: 'Preto e Castanho' },
      { id: 'chocolate', name: 'Chocolate' },
    ],
  },
  'beagle': {
    defaultColor: 'tricolor',
    colors: [
      { id: 'tricolor', name: 'Tricolor' },
      { id: 'limao-branco', name: 'Limão e Branco' },
      { id: 'vermelho-branco', name: 'Vermelho e Branco' },
    ],
  },
  'rottweiler': {
    defaultColor: 'preto-castanho',
    colors: [
      { id: 'preto-castanho', name: 'Preto e Castanho' },
      { id: 'preto-mogno', name: 'Preto e Mogno' },
    ],
  },
  'husky': {
    defaultColor: 'cinza-branco',
    colors: [
      { id: 'cinza-branco', name: 'Cinza e Branco' },
      { id: 'preto-branco', name: 'Preto e Branco' },
      { id: 'vermelho-branco', name: 'Vermelho e Branco' },
    ],
  },
  'pitbull': {
    defaultColor: 'tigrado',
    colors: [
      { id: 'tigrado', name: 'Tigrado' },
      { id: 'azul', name: 'Azul' },
      { id: 'vermelho', name: 'Vermelho' },
    ],
  },
  'maltes': {
    defaultColor: 'branco',
    colors: [
      { id: 'branco', name: 'Branco' },
      { id: 'creme', name: 'Creme' },
    ],
  },
  'cocker-spaniel': {
    defaultColor: 'dourado',
    colors: [
      { id: 'dourado', name: 'Dourado' },
      { id: 'preto', name: 'Preto' },
      { id: 'vermelho', name: 'Vermelho' },
    ],
  },
  'schnauzer': {
    defaultColor: 'sal-pimenta',
    colors: [
      { id: 'sal-pimenta', name: 'Sal e Pimenta' },
      { id: 'preto', name: 'Preto' },
      { id: 'branco', name: 'Branco' },
    ],
  },
  'chihuahua': {
    defaultColor: 'bege',
    colors: [
      { id: 'bege', name: 'Bege' },
      { id: 'preto', name: 'Preto' },
      { id: 'chocolate', name: 'Chocolate' },
    ],
  },
  'lhasa-apso': {
    defaultColor: 'dourado',
    colors: [
      { id: 'dourado', name: 'Dourado' },
      { id: 'branco', name: 'Branco' },
      { id: 'preto', name: 'Preto' },
    ],
  },
};

// Normalize breed name to key
function normalizeBreedKey(breed: string): string {
  const normalized = breed.toLowerCase().trim();
  const keyMap: Record<string, string> = {
    'golden retriever': 'golden-retriever',
    'golden': 'golden-retriever',
    'pug': 'pug',
    'labrador': 'labrador',
    'labrador retriever': 'labrador',
    'pastor alemão': 'pastor-alemao',
    'pastor-alemão': 'pastor-alemao',
    'german shepherd': 'pastor-alemao',
    'bulldog francês': 'bulldog-frances',
    'bulldog frances': 'bulldog-frances',
    'french bulldog': 'bulldog-frances',
    'shih tzu': 'shih-tzu',
    'shih-tzu': 'shih-tzu',
    'yorkshire': 'yorkshire',
    'yorkshire terrier': 'yorkshire',
    'vira-lata': 'vira-lata',
    'vira-lata/srd': 'vira-lata',
    'srd': 'vira-lata',
    'poodle': 'poodle',
    'border collie': 'border-collie',
    'border-collie': 'border-collie',
    'dachshund': 'dachshund',
    'teckel': 'dachshund',
    'salsicha': 'dachshund',
    'beagle': 'beagle',
    'rottweiler': 'rottweiler',
    'husky': 'husky',
    'husky siberiano': 'husky',
    'pitbull': 'pitbull',
    'pit bull': 'pitbull',
    'american pit bull': 'pitbull',
    'maltês': 'maltes',
    'maltes': 'maltes',
    'maltese': 'maltes',
    'cocker spaniel': 'cocker-spaniel',
    'cocker': 'cocker-spaniel',
    'schnauzer': 'schnauzer',
    'schnauzer miniatura': 'schnauzer',
    'chihuahua': 'chihuahua',
    'lhasa apso': 'lhasa-apso',
    'lhasa-apso': 'lhasa-apso',
  };

  if (keyMap[normalized]) return keyMap[normalized];
  for (const [key, val] of Object.entries(keyMap)) {
    if (normalized.includes(key) || key.includes(normalized)) return val;
  }
  return 'vira-lata';
}

export function getBreedColorConfig(breed: string): BreedColorConfig {
  const key = normalizeBreedKey(breed);
  return breedColorConfigs[key] || breedColorConfigs['vira-lata'];
}

export function getBreedKey(breed: string): string {
  return normalizeBreedKey(breed);
}

// Dynamic import map for color variant images
// Color variants are stored as: src/assets/breed-colors/{breed}-{colorId}.png
// The default color uses the existing breed-body image
const colorImageModules = import.meta.glob('/src/assets/breed-colors/*.png', { eager: true, import: 'default' }) as Record<string, string>;

export function getBreedColorImage(breed: string, colorId: string): string | null {
  const key = normalizeBreedKey(breed);
  const config = breedColorConfigs[key];
  if (!config) return null;

  // If it's the default color, return null so the caller uses the normal breed-body image
  if (colorId === config.defaultColor) return null;

  // Look for the color variant image
  const path = `/src/assets/breed-colors/${key}-${colorId}.png`;
  return colorImageModules[path] || null;
}
