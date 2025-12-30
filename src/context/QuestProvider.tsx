"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { format, parseISO, isSameDay, isYesterday, startOfDay, endOfDay, getMonth, getYear, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import type { Task, Completion, WakeUpTime, Workout, Streak, Rank, TaskDifficulty, BossQuestType, MonthlyReport } from '@/lib/types';
import { DIFFICULTY_POINTS, DAILY_XP_BUDGET, BOSS_QUEST_XP } from '@/lib/types';
import { RANKS } from '@/lib/data';
import { WEEKLY_BOSS_QUESTS, MONTHLY_BOSS_QUESTS } from '@/lib/boss-quests-data';

export interface QuestContextType {
  // State
  selectedDate: Date;
  tasks: Task[];
  completions: Completion[];
  lockedDates: string[];
  wakeUpTimes: WakeUpTime[];
  workouts: Workout[];
  streak: Streak;
  rankUpInfo: { oldRank: Rank; newRank: Rank } | null;
  flashLock: boolean;

  // Derived State
  tasksForSelectedDate: Task[];
  completionsForSelectedDate: Completion[];
  isDateLocked: boolean;
  totalXp: number;
  currentRank: Rank;
  nextRank: Rank | null;
  rankProgress: number;
  xpToNextRank: number;
  workoutForSelectedDate: Workout | undefined;
  wakeUpTimeForSelectedDate: WakeUpTime | undefined;
  getCompletionsForMonth: (date: Date) => Completion[];
  getTasksByIds: (ids: string[]) => Task[];
  
  // Actions
  selectDate: (date: Date) => void;
  addTask: (text: string, difficulty: TaskDifficulty) => void;
  deleteTask: (taskId: string) => void;
  toggleCompletion: (taskId: string) => void;
  lockDate: () => void;
  setWakeUpTime: (time: string) => Promise<string | null>;
  setWorkoutStatus: (workedOut: boolean) => void;
  clearRankUp: () => void;
  resetAllData: () => void;
}

export const QuestContext = createContext<QuestContextType | null>(null);

const LS_PREFIX = 'xp-quest-';

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [tasks, setTasks] = useLocalStorage<Task[]>(`${LS_PREFIX}tasks`, []);
  const [completions, setCompletions] = useLocalStorage<Completion[]>(`${LS_PREFIX}completions`, []);
  const [lockedDates, setLockedDates] = useLocalStorage<string[]>(`${LS_PREFIX}locked-dates`, []);
  const [wakeUpTimes, setWakeUpTimes] = useLocalStorage<WakeUpTime[]>(`${LS_PREFIX}wake-up-times`, []);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(`${LS_PREFIX}workouts`, []);
  const [streak, setStreak] = useLocalStorage<Streak>(`${LS_PREFIX}streak`, { current: 0, lastDate: null });
  const [monthlyReport, setMonthlyReport] = useLocalStorage<MonthlyReport | null>(`${LS_PREFIX}monthly-report`, null);
  const [rankUpInfo, setRankUpInfo] = useState<{ oldRank: Rank; newRank: Rank } | null>(null);
  const [flashLock, setFlashLock] = useState(false);

  // Memoized derived state
  const formattedSelectedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const isDateLocked = useMemo(() => lockedDates.includes(formattedSelectedDate), [lockedDates, formattedSelectedDate]);

  const tasksForSelectedDate = useMemo(() => {
    const dayEnd = endOfDay(selectedDate).getTime();
    return tasks.filter(task => task.createdAt <= dayEnd);
  }, [tasks, selectedDate]);
  
  const completionsForSelectedDate = useMemo(() => {
    return completions.filter(c => c.date === formattedSelectedDate);
  }, [completions, formattedSelectedDate]);

  const workoutForSelectedDate = useMemo(() => workouts.find(w => w.date === formattedSelectedDate), [workouts, formattedSelectedDate]);
  const wakeUpTimeForSelectedDate = useMemo(() => wakeUpTimes.find(w => w.date === formattedSelectedDate), [wakeUpTimes, formattedSelectedDate]);

  const totalXp = useMemo(() => completions.reduce((sum, c) => sum + c.xpGained, 0), [completions]);

  const { currentRank, nextRank, rankProgress, xpToNextRank } = useMemo(() => {
    const current = [...RANKS].reverse().find(r => totalXp >= r.xpThreshold) ?? RANKS[0];
    const next = RANKS.find(r => totalXp < r.xpThreshold) ?? null;
    const xpForCurrent = current.xpThreshold;
    const xpForNext = next?.xpThreshold ?? current.xpThreshold;
    const xpInCurrent = totalXp - xpForCurrent;
    const totalXpForLevel = xpForNext - xpForCurrent;
    const progress = totalXpForLevel > 0 ? (xpInCurrent / totalXpForLevel) * 100 : 100;
    
    return {
      currentRank: current,
      nextRank: next,
      rankProgress: progress,
      xpToNextRank: xpForNext - totalXp,
    };
  }, [totalXp]);

  // Actions
  const selectDate = (date: Date) => setSelectedDate(startOfDay(date));

  const getXpForTask = useCallback((taskId: string): number => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 0;

    if (task.isBossQuest) {
      return BOSS_QUEST_XP[task.isBossQuest];
    }
    
    const dailyTasks = tasksForSelectedDate.filter(t => !t.isBossQuest && isSameDay(t.createdAt, selectedDate));
    const totalPoints = dailyTasks.reduce((sum, t) => sum + DIFFICULTY_POINTS[t.difficulty], 0);

    if (totalPoints === 0) return 0;

    const taskPoints = DIFFICULTY_POINTS[task.difficulty];
    return Math.round((taskPoints / totalPoints) * DAILY_XP_BUDGET);
  }, [tasks, tasksForSelectedDate, selectedDate]);
  
  const toggleCompletion = (taskId: string) => {
    if (!isDateLocked) {
      setFlashLock(true);
      setTimeout(() => setFlashLock(false), 1000);
      return;
    }

    const existingCompletion = completionsForSelectedDate.find(c => c.taskId === taskId);

    if (existingCompletion) {
      // Un-complete task
      setCompletions(prev => prev.filter(c => c.id !== existingCompletion.id));
    } else {
      // Complete task
      const xpGained = getXpForTask(taskId);
      const newCompletion: Completion = {
        id: crypto.randomUUID(),
        taskId,
        date: formattedSelectedDate,
        xpGained,
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  const addTask = (text: string, difficulty: TaskDifficulty) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      difficulty,
      createdAt: selectedDate.getTime(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setCompletions(prev => prev.filter(c => c.taskId !== taskId));
  };
  
  const lockDate = () => setLockedDates(prev => [...prev, formattedSelectedDate]);

  const setWakeUpTime = async (time: string) => {
    const newWakeUpTime = { date: formattedSelectedDate, time };
    setWakeUpTimes(prev => [...prev.filter(w => w.date !== formattedSelectedDate), newWakeUpTime]);

    const { getMotivation } = await import('@/lib/ai-actions');
    try {
      const result = await getMotivation({ wakeUpTime: time });
      return result.message;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const setWorkoutStatus = (workedOut: boolean) => {
    const newWorkout = { date: formattedSelectedDate, workedOut };
    setWorkouts(prev => [...prev.filter(w => w.date !== formattedSelectedDate), newWorkout]);

    // Streak Logic
    const today = parseISO(formattedSelectedDate);
    const lastWorkoutDate = streak.lastDate ? parseISO(streak.lastDate) : null;
    
    if (workedOut) {
      if (lastWorkoutDate && isYesterday(lastWorkoutDate, today)) {
        setStreak(prev => ({ current: prev.current + 1, lastDate: formattedSelectedDate }));
      } else if (!lastWorkoutDate || !isSameDay(lastWorkoutDate, today)) {
        setStreak({ current: 1, lastDate: formattedSelectedDate });
      }
    } else { // Rest day or missed day before logging
       if (lastWorkoutDate && !isSameDay(lastWorkoutDate, today)) {
        setStreak(prev => ({ ...prev, current: 0 }));
      }
    }
  };

  const clearRankUp = () => setRankUpInfo(null);
  
  const resetAllData = () => {
    setTasks([]);
    setCompletions([]);
    setLockedDates([]);
    setWakeUpTimes([]);
    setWorkouts([]);
    setStreak({ current: 0, lastDate: null });
    setMonthlyReport(null);
    setSelectedDate(startOfDay(new Date()));
  };

  const getCompletionsForMonth = (date: Date) => {
      const month = getMonth(date);
      const year = getYear(date);
      return completions.filter(c => {
          const compDate = parseISO(c.date);
          return getMonth(compDate) === month && getYear(compDate) === year;
      });
  };
  
  const getTasksByIds = (ids: string[]) => tasks.filter(t => ids.includes(t.id));

  // Effect for Rank Up
  useEffect(() => {
    const previousXp = totalXp - (completions[completions.length-1]?.xpGained || 0);
    const prevRank = [...RANKS].reverse().find(r => previousXp >= r.xpThreshold) ?? RANKS[0];

    if (prevRank.name !== currentRank.name) {
      setRankUpInfo({ oldRank: prevRank, newRank: currentRank });
    }
  }, [totalXp, currentRank, completions]);

  // Effect for Auto-adding Boss Quests
  useEffect(() => {
    const now = new Date();
    
    // Weekly
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const weeklyQuestExists = tasks.some(t => t.isBossQuest === 'weekly' && t.createdAt >= startOfCurrentWeek.getTime());
    if (!weeklyQuestExists) {
        const activeWeeklyQuests = tasks.filter(t => t.isBossQuest === 'weekly');
        const lastWeeklyQuestText = activeWeeklyQuests[activeWeeklyQuests.length - 1]?.text;
        const lastIndex = WEEKLY_BOSS_QUESTS.findIndex(q => q.text === lastWeeklyQuestText);
        const nextQuest = WEEKLY_BOSS_QUESTS[(lastIndex + 1) % WEEKLY_BOSS_QUESTS.length];
        
        const newQuest: Task = {
            id: `boss-weekly-${crypto.randomUUID()}`,
            createdAt: startOfCurrentWeek.getTime(),
            ...nextQuest
        };
        setTasks(prev => [...prev, newQuest]);
    }

    // Monthly
    const startOfCurrentMonth = startOfMonth(now);
    const monthlyQuestExists = tasks.some(t => t.isBossQuest === 'monthly' && t.createdAt >= startOfCurrentMonth.getTime());
     if (!monthlyQuestExists) {
        const activeMonthlyQuests = tasks.filter(t => t.isBossQuest === 'monthly');
        const lastMonthlyQuestText = activeMonthlyQuests[activeMonthlyQuests.length - 1]?.text;
        const lastIndex = MONTHLY_BOSS_QUESTS.findIndex(q => q.text === lastMonthlyQuestText);
        const nextQuest = MONTHLY_BOSS_QUESTS[(lastIndex + 1) % MONTHLY_BOSS_QUESTS.length];

        const newQuest: Task = {
            id: `boss-monthly-${crypto.randomUUID()}`,
            createdAt: startOfCurrentMonth.getTime(),
            ...nextQuest,
        };
        setTasks(prev => [...prev, newQuest]);
    }
}, [tasks, setTasks]);

  const contextValue: QuestContextType = {
    selectedDate,
    tasks,
    completions,
    lockedDates,
    wakeUpTimes,
    workouts,
    streak,
    rankUpInfo,
    flashLock,
    tasksForSelectedDate,
    completionsForSelectedDate,
    isDateLocked,
    totalXp,
    currentRank,
    nextRank,
    rankProgress,
    xpToNextRank,
    workoutForSelectedDate,
    wakeUpTimeForSelectedDate,
    getCompletionsForMonth,
    getTasksByIds,
    selectDate,
    addTask,
    deleteTask,
    toggleCompletion,
    lockDate,
    setWakeUpTime,
    setWorkoutStatus,
    clearRankUp,
    resetAllData,
  };

  return (
    <QuestContext.Provider value={contextValue}>
      {children}
    </QuestContext.Provider>
  );
}
