import goldenRetrieverUnder from '@/assets/breed-weight/golden-retriever-underweight.png';
import goldenRetrieverOver from '@/assets/breed-weight/golden-retriever-overweight.png';
import goldenRetrieverObese from '@/assets/breed-weight/golden-retriever-obese.png';

import pugUnder from '@/assets/breed-weight/pug-underweight.png';
import pugOver from '@/assets/breed-weight/pug-overweight.png';
import pugObese from '@/assets/breed-weight/pug-obese.png';

import labradorUnder from '@/assets/breed-weight/labrador-underweight.png';
import labradorOver from '@/assets/breed-weight/labrador-overweight.png';
import labradorObese from '@/assets/breed-weight/labrador-obese.png';

import pastorAlemaoUnder from '@/assets/breed-weight/pastor-alemao-underweight.png';
import pastorAlemaoOver from '@/assets/breed-weight/pastor-alemao-overweight.png';
import pastorAlemaoObese from '@/assets/breed-weight/pastor-alemao-obese.png';

import bulldogFrancesUnder from '@/assets/breed-weight/bulldog-frances-underweight.png';
import bulldogFrancesOver from '@/assets/breed-weight/bulldog-frances-overweight.png';
import bulldogFrancesObese from '@/assets/breed-weight/bulldog-frances-obese.png';

import shihTzuUnder from '@/assets/breed-weight/shih-tzu-underweight.png';
import shihTzuOver from '@/assets/breed-weight/shih-tzu-overweight.png';
import shihTzuObese from '@/assets/breed-weight/shih-tzu-obese.png';

import yorkshireUnder from '@/assets/breed-weight/yorkshire-underweight.png';
import yorkshireOver from '@/assets/breed-weight/yorkshire-overweight.png';
import yorkshireObese from '@/assets/breed-weight/yorkshire-obese.png';

import viraLataUnder from '@/assets/breed-weight/vira-lata-underweight.png';
import viraLataOver from '@/assets/breed-weight/vira-lata-overweight.png';
import viraLataObese from '@/assets/breed-weight/vira-lata-obese.png';

import poodleUnder from '@/assets/breed-weight/poodle-underweight.png';
import poodleOver from '@/assets/breed-weight/poodle-overweight.png';
import poodleObese from '@/assets/breed-weight/poodle-obese.png';

import borderCollieUnder from '@/assets/breed-weight/border-collie-underweight.png';
import borderCollieOver from '@/assets/breed-weight/border-collie-overweight.png';
import borderCollieObese from '@/assets/breed-weight/border-collie-obese.png';

import dachshundUnder from '@/assets/breed-weight/dachshund-underweight.png';
import dachshundOver from '@/assets/breed-weight/dachshund-overweight.png';
import dachshundObese from '@/assets/breed-weight/dachshund-obese.png';

import beagleUnder from '@/assets/breed-weight/beagle-underweight.png';
import beagleOver from '@/assets/breed-weight/beagle-overweight.png';
import beagleObese from '@/assets/breed-weight/beagle-obese.png';

import rottweilerUnder from '@/assets/breed-weight/rottweiler-underweight.png';
import rottweilerOver from '@/assets/breed-weight/rottweiler-overweight.png';
import rottweilerObese from '@/assets/breed-weight/rottweiler-obese.png';

import huskyUnder from '@/assets/breed-weight/husky-underweight.png';
import huskyOver from '@/assets/breed-weight/husky-overweight.png';
import huskyObese from '@/assets/breed-weight/husky-obese.png';

import pitbullUnder from '@/assets/breed-weight/pitbull-underweight.png';
import pitbullOver from '@/assets/breed-weight/pitbull-overweight.png';
import pitbullObese from '@/assets/breed-weight/pitbull-obese.png';

import maltesUnder from '@/assets/breed-weight/maltes-underweight.png';
import maltesOver from '@/assets/breed-weight/maltes-overweight.png';
import maltesObese from '@/assets/breed-weight/maltes-obese.png';

import cockerSpanielUnder from '@/assets/breed-weight/cocker-spaniel-underweight.png';
import cockerSpanielOver from '@/assets/breed-weight/cocker-spaniel-overweight.png';
import cockerSpanielObese from '@/assets/breed-weight/cocker-spaniel-obese.png';

import schnauzerUnder from '@/assets/breed-weight/schnauzer-underweight.png';
import schnauzerOver from '@/assets/breed-weight/schnauzer-overweight.png';
import schnauzerObese from '@/assets/breed-weight/schnauzer-obese.png';

import chihuahuaUnder from '@/assets/breed-weight/chihuahua-underweight.png';
import chihuahuaOver from '@/assets/breed-weight/chihuahua-overweight.png';
import chihuahuaObese from '@/assets/breed-weight/chihuahua-obese.png';

import lhasaApsoUnder from '@/assets/breed-weight/lhasa-apso-underweight.png';
import lhasaApsoOver from '@/assets/breed-weight/lhasa-apso-overweight.png';
import lhasaApsoObese from '@/assets/breed-weight/lhasa-apso-obese.png';

import { getBreedBodyImage } from './breedBodyImages';

// Map normalized breed names to their weight variation images
const breedWeightMap: Record<string, { underweight: string; overweight: string; obese: string }> = {
  'golden retriever': { underweight: goldenRetrieverUnder, overweight: goldenRetrieverOver, obese: goldenRetrieverObese },
  'golden': { underweight: goldenRetrieverUnder, overweight: goldenRetrieverOver, obese: goldenRetrieverObese },
  'pug': { underweight: pugUnder, overweight: pugOver, obese: pugObese },
  'labrador': { underweight: labradorUnder, overweight: labradorOver, obese: labradorObese },
  'labrador retriever': { underweight: labradorUnder, overweight: labradorOver, obese: labradorObese },
  'pastor alemão': { underweight: pastorAlemaoUnder, overweight: pastorAlemaoOver, obese: pastorAlemaoObese },
  'pastor-alemão': { underweight: pastorAlemaoUnder, overweight: pastorAlemaoOver, obese: pastorAlemaoObese },
  'german shepherd': { underweight: pastorAlemaoUnder, overweight: pastorAlemaoOver, obese: pastorAlemaoObese },
  'bulldog francês': { underweight: bulldogFrancesUnder, overweight: bulldogFrancesOver, obese: bulldogFrancesObese },
  'bulldog frances': { underweight: bulldogFrancesUnder, overweight: bulldogFrancesOver, obese: bulldogFrancesObese },
  'french bulldog': { underweight: bulldogFrancesUnder, overweight: bulldogFrancesOver, obese: bulldogFrancesObese },
  'shih tzu': { underweight: shihTzuUnder, overweight: shihTzuOver, obese: shihTzuObese },
  'shih-tzu': { underweight: shihTzuUnder, overweight: shihTzuOver, obese: shihTzuObese },
  'yorkshire': { underweight: yorkshireUnder, overweight: yorkshireOver, obese: yorkshireObese },
  'yorkshire terrier': { underweight: yorkshireUnder, overweight: yorkshireOver, obese: yorkshireObese },
  'vira-lata': { underweight: viraLataUnder, overweight: viraLataOver, obese: viraLataObese },
  'vira-lata/srd': { underweight: viraLataUnder, overweight: viraLataOver, obese: viraLataObese },
  'srd': { underweight: viraLataUnder, overweight: viraLataOver, obese: viraLataObese },
  'poodle': { underweight: poodleUnder, overweight: poodleOver, obese: poodleObese },
  'border collie': { underweight: borderCollieUnder, overweight: borderCollieOver, obese: borderCollieObese },
  'border-collie': { underweight: borderCollieUnder, overweight: borderCollieOver, obese: borderCollieObese },
  'dachshund': { underweight: dachshundUnder, overweight: dachshundOver, obese: dachshundObese },
  'teckel': { underweight: dachshundUnder, overweight: dachshundOver, obese: dachshundObese },
  'salsicha': { underweight: dachshundUnder, overweight: dachshundOver, obese: dachshundObese },
  'beagle': { underweight: beagleUnder, overweight: beagleOver, obese: beagleObese },
  'rottweiler': { underweight: rottweilerUnder, overweight: rottweilerOver, obese: rottweilerObese },
  'husky': { underweight: huskyUnder, overweight: huskyOver, obese: huskyObese },
  'husky siberiano': { underweight: huskyUnder, overweight: huskyOver, obese: huskyObese },
  'pitbull': { underweight: pitbullUnder, overweight: pitbullOver, obese: pitbullObese },
  'pit bull': { underweight: pitbullUnder, overweight: pitbullOver, obese: pitbullObese },
  'american pit bull': { underweight: pitbullUnder, overweight: pitbullOver, obese: pitbullObese },
  'maltês': { underweight: maltesUnder, overweight: maltesOver, obese: maltesObese },
  'maltes': { underweight: maltesUnder, overweight: maltesOver, obese: maltesObese },
  'maltese': { underweight: maltesUnder, overweight: maltesOver, obese: maltesObese },
  'cocker spaniel': { underweight: cockerSpanielUnder, overweight: cockerSpanielOver, obese: cockerSpanielObese },
  'cocker': { underweight: cockerSpanielUnder, overweight: cockerSpanielOver, obese: cockerSpanielObese },
  'schnauzer': { underweight: schnauzerUnder, overweight: schnauzerOver, obese: schnauzerObese },
  'schnauzer miniatura': { underweight: schnauzerUnder, overweight: schnauzerOver, obese: schnauzerObese },
  'chihuahua': { underweight: chihuahuaUnder, overweight: chihuahuaOver, obese: chihuahuaObese },
  'lhasa apso': { underweight: lhasaApsoUnder, overweight: lhasaApsoOver, obese: lhasaApsoObese },
  'lhasa-apso': { underweight: lhasaApsoUnder, overweight: lhasaApsoOver, obese: lhasaApsoObese },
};

export function getBreedWeightImage(breed: string, status: 'underweight' | 'healthy' | 'overweight' | 'obese'): string {
  if (status === 'healthy') return getBreedDefaultImage(breed);
  
  const normalized = breed.toLowerCase().trim();
  let weightImages = breedWeightMap[normalized];
  
  if (!weightImages) {
    // Try to find by partial match
    for (const [key, imgs] of Object.entries(breedWeightMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        weightImages = imgs;
        break;
      }
    }
  }
  
  if (!weightImages) return getBreedDefaultImage(breed);
  
  return weightImages[status];
}

// Re-export this as it's needed by the weight logic but originally in another file
// We import it here to avoid circular dependencies if we were to import getBreedWeightImage elsewhere
function getBreedDefaultImage(breed: string): string {
  return getBreedBodyImage(breed);
}
