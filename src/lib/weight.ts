import weightUnderweight from '@/assets/weight-underweight.png';
import weightHealthy from '@/assets/weight-healthy.png';
import weightOverweight from '@/assets/weight-overweight.png';
import weightObese from '@/assets/weight-obese.png';

// Weight ranges by breed size (in kg)
// Source: general veterinary weight guidelines
const weightRanges: Record<string, { underweight: number; healthy: [number, number]; overweight: number; obese: number }> = {
  'mini': { underweight: 2, healthy: [2, 5], overweight: 6, obese: 8 },
  'pequeno': { underweight: 5, healthy: [5, 10], overweight: 12, obese: 15 },
  'médio': { underweight: 10, healthy: [10, 25], overweight: 28, obese: 35 },
  'grande': { underweight: 20, healthy: [25, 40], overweight: 45, obese: 55 },
  'gigante': { underweight: 35, healthy: [40, 60], overweight: 65, obese: 80 },
};

export type WeightStatus = 'underweight' | 'healthy' | 'overweight' | 'obese';

export function getWeightStatus(weightKg: number, sizeCategory: string = 'médio'): WeightStatus {
  const range = weightRanges[sizeCategory] || weightRanges['médio'];
  if (weightKg < range.underweight) return 'underweight';
  if (weightKg >= range.healthy[0] && weightKg <= range.healthy[1]) return 'healthy';
  if (weightKg > range.healthy[1] && weightKg < range.obese) return 'overweight';
  if (weightKg >= range.obese) return 'obese';
  return 'healthy';
}

export function getWeightImage(status: WeightStatus): string {
  const images: Record<WeightStatus, string> = {
    underweight: weightUnderweight,
    healthy: weightHealthy,
    overweight: weightOverweight,
    obese: weightObese,
  };
  return images[status];
}

export function getWeightLabel(status: WeightStatus): { label: string; emoji: string; color: string } {
  const labels: Record<WeightStatus, { label: string; emoji: string; color: string }> = {
    underweight: { label: 'Abaixo do peso', emoji: '😢', color: 'text-orange-500' },
    healthy: { label: 'Saudável', emoji: '😄', color: 'text-green-500' },
    overweight: { label: 'Sobrepeso', emoji: '😐', color: 'text-yellow-500' },
    obese: { label: 'Obeso', emoji: '😟', color: 'text-red-500' },
  };
  return labels[status];
}
