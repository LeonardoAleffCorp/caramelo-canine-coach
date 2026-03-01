import goldenRetriever from '@/assets/breed-default/golden-retriever.png';
import pug from '@/assets/breed-default/pug.png';
import labrador from '@/assets/breed-default/labrador.png';
import pastorAlemao from '@/assets/breed-default/pastor-alemao.png';
import bulldogFrances from '@/assets/breed-default/bulldog-frances.png';
import shihTzu from '@/assets/breed-default/shih-tzu.png';
import yorkshire from '@/assets/breed-default/yorkshire.png';
import viraLata from '@/assets/breed-default/vira-lata.png';
import poodle from '@/assets/breed-default/poodle.png';
import borderCollie from '@/assets/breed-default/border-collie.png';
import dachshund from '@/assets/breed-default/dachshund.png';
import beagle from '@/assets/breed-default/beagle.png';
import rottweiler from '@/assets/breed-default/rottweiler.png';
import husky from '@/assets/breed-default/husky.png';
import pitbull from '@/assets/breed-default/pitbull.png';
import maltes from '@/assets/breed-default/maltes.png';
import cockerSpaniel from '@/assets/breed-default/cocker-spaniel.png';
import schnauzer from '@/assets/breed-default/schnauzer.png';
import chihuahua from '@/assets/breed-default/chihuahua.png';
import lhasaApso from '@/assets/breed-default/lhasa-apso.png';

const breedImageMap: Record<string, string> = {
  'golden retriever': goldenRetriever,
  'golden': goldenRetriever,
  'pug': pug,
  'labrador': labrador,
  'labrador retriever': labrador,
  'pastor alemão': pastorAlemao,
  'pastor-alemão': pastorAlemao,
  'german shepherd': pastorAlemao,
  'bulldog francês': bulldogFrances,
  'bulldog frances': bulldogFrances,
  'french bulldog': bulldogFrances,
  'shih tzu': shihTzu,
  'shih-tzu': shihTzu,
  'yorkshire': yorkshire,
  'yorkshire terrier': yorkshire,
  'vira-lata': viraLata,
  'vira-lata/srd': viraLata,
  'srd': viraLata,
  'poodle': poodle,
  'border collie': borderCollie,
  'border-collie': borderCollie,
  'dachshund': dachshund,
  'teckel': dachshund,
  'salsicha': dachshund,
  'beagle': beagle,
  'rottweiler': rottweiler,
  'husky': husky,
  'husky siberiano': husky,
  'pitbull': pitbull,
  'pit bull': pitbull,
  'american pit bull': pitbull,
  'maltês': maltes,
  'maltes': maltes,
  'maltese': maltes,
  'cocker spaniel': cockerSpaniel,
  'cocker': cockerSpaniel,
  'schnauzer': schnauzer,
  'schnauzer miniatura': schnauzer,
  'chihuahua': chihuahua,
  'lhasa apso': lhasaApso,
  'lhasa-apso': lhasaApso,
};

export function getBreedDefaultImage(breed: string): string {
  const normalized = breed.toLowerCase().trim();
  
  // Direct match
  if (breedImageMap[normalized]) return breedImageMap[normalized];
  
  // Partial match
  for (const [key, img] of Object.entries(breedImageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  
  // Default to vira-lata
  return viraLata;
}
