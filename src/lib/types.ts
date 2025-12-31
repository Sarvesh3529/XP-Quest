export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';

export const DIFFICULTY_POINTS: Record<TaskDifficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const DAILY_XP_BUDGET = 30;
export const BOSS_QUEST_XP: Record<'weekly' | 'monthly', number> = {
  weekly: 50,
  monthly: 100,
};

export type BossQuestType = 'weekly' | 'monthly';

export interface Task {
  id: string;
  text: string;
  createdAt: number; // timestamp
  difficulty: TaskDifficulty;
  isBossQuest?: BossQuestType | null;
}

export interface Completion {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  xpGained: number;
  completedAt: number; // timestamp
}

export interface WakeUpTime {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface Workout {
  date: string; // YYYY-MM-DD
  workedOut: boolean;
}

export interface Streak {
  current: number;
  lastDate: string | null; // YYYY-MM-DD
}

export interface Rank {
  name: string;
  xpThreshold: number;
  icon: string; // Lucide icon name
}

// This is for the AI report generation
export interface MonthlyReport {
  generatedDate: string;
  report: string;
  improvementSuggestions: string;
}
