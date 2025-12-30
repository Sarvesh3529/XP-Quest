import type { Rank } from './types';

export const RANKS: Rank[] = [
  { name: 'Iron Recruit', xpThreshold: 0, icon: 'Shield' },
  { name: 'Bronze Mercenary', xpThreshold: 100, icon: 'Award' },
  { name: 'Silver Vanguard', xpThreshold: 300, icon: 'Star' },
  { name: 'Gold Paladin', xpThreshold: 700, icon: 'Gem' },
  { name: 'Platinum Guardian', xpThreshold: 1500, icon: 'Crown' },
  { name: 'Diamond Legend', xpThreshold: 3000, icon: 'Sparkles' },
];
