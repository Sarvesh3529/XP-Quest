import type { Rank } from './types';

export const RANKS: Rank[] = [
  { name: 'Novice', xpThreshold: 0, icon: 'Shield' },
  { name: 'Iron Warrior', xpThreshold: 500, icon: 'Award' },
  { name: 'Golden Knight', xpThreshold: 1200, icon: 'Star' },
  { name: 'Dragon Slayer', xpThreshold: 2500, icon: 'Gem' },
  { name: 'Vanguard', xpThreshold: 5000, icon: 'Trophy' },
  { name: 'Alpha Goggins', xpThreshold: 7500, icon: 'Sparkles' },
  { name: 'Grandmaster', xpThreshold: 10000, icon: 'Crown' },
];
