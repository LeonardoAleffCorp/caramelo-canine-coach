import goldenRetriever from '@/assets/breed-body/golden-retriever.png';
import pug from '@/assets/breed-body/pug.png';
import labrador from '@/assets/breed-body/labrador.png';
import pastorAlemao from '@/assets/breed-body/pastor-alemao.png';
import bulldogFrances from '@/assets/breed-body/bulldog-frances.png';
import shihTzu from '@/assets/breed-body/shih-tzu.png';
import yorkshire from '@/assets/breed-body/yorkshire.png';
import viraLata from '@/assets/breed-body/vira-lata.png';
import poodle from '@/assets/breed-body/poodle.png';
import borderCollie from '@/assets/breed-body/border-collie.png';
import dachshund from '@/assets/breed-body/dachshund.png';
import beagle from '@/assets/breed-body/beagle.png';
import rottweiler from '@/assets/breed-body/rottweiler.png';
import husky from '@/assets/breed-body/husky.png';
import pitbull from '@/assets/breed-body/pitbull.png';
import maltes from '@/assets/breed-body/maltes.png';
import cockerSpaniel from '@/assets/breed-body/cocker-spaniel.png';
import schnauzer from '@/assets/breed-body/schnauzer.png';
import chihuahua from '@/assets/breed-body/chihuahua.png';
import lhasaApso from '@/assets/breed-body/lhasa-apso.png';

const breedBodyMap: Record<string, string> = {
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

export function getBreedBodyImage(breed: string): string {
  const normalized = breed.toLowerCase().trim();
  if (breedBodyMap[normalized]) return breedBodyMap[normalized];
  for (const [key, img] of Object.entries(breedBodyMap)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  return viraLata;
}
