import type { Task } from './types';

export const WEEKLY_BOSS_QUESTS: Omit<Task, 'id' | 'createdAt'>[] = [
  { text: 'Complete 15 quests this week', difficulty: 'Hard', isBossQuest: 'weekly' },
  { text: 'Log 5 workouts in a week', difficulty: 'Hard', isBossQuest: 'weekly' },
  { text: 'Complete all daily quests for 3 days in a row', difficulty: 'Hard', isBossQuest: 'weekly' },
];

export const MONTHLY_BOSS_QUESTS: Omit<Task, 'id' | 'createdAt'>[] = [
  { text: 'Achieve a 20-day workout streak', difficulty: 'Hard', isBossQuest: 'monthly' },
  { text: 'Complete 75 quests this month', difficulty: 'Hard', isBossQuest: 'monthly' },
  { text: 'Rank up to a new tier', difficulty: 'Hard', isBossQuest: 'monthly' },
];
