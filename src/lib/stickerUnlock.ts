/**
 * Sticker unlock logic based on user account age.
 * - Start with 1 per category
 * - Gradually unlock more over time
 * - All unlocked at 6 months (180 days)
 */

export function getUnlockedStickerCount(
  totalInCategory: number,
  accountAgeDays: number
): number {
  if (accountAgeDays >= 180) return totalInCategory; // All at 6 months
  
  // Minimum 1, then linearly unlock
  const progress = Math.min(accountAgeDays / 180, 1);
  const unlocked = Math.max(1, Math.ceil(totalInCategory * progress));
  return Math.min(unlocked, totalInCategory);
}

export function getAccountAgeDays(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / 86400000);
}
