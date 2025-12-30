"use client";

import { useMemo } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { TaskItem } from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';
import { AllQuestsComplete } from './animations/AllQuestsComplete';

export function TaskList() {
  const { tasksForSelectedDate, completionsForSelectedDate, isDateLocked } = useQuest();

  const dailyTasks = useMemo(() => 
    tasksForSelectedDate.filter(t => !t.isBossQuest),
    [tasksForSelectedDate]
  );
  
  const uncompletedTasks = useMemo(() => 
    dailyTasks.filter(task => !completionsForSelectedDate.some(c => c.taskId === task.id)), 
    [dailyTasks, completionsForSelectedDate]
  );

  const completedTasks = useMemo(() => 
    dailyTasks.filter(task => completionsForSelectedDate.some(c => c.taskId === task.id)), 
    [dailyTasks, completionsForSelectedDate]
  );

  const allTasksCompleted = dailyTasks.length > 0 && uncompletedTasks.length === 0 && isDateLocked;
  
  return (
    <div className="relative">
      <AnimatePresence>
        {allTasksCompleted && <AllQuestsComplete />}
      </AnimatePresence>
      <div className="space-y-2">
        {dailyTasks.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-lg bg-card/60">
            <p className="text-muted-foreground">No quests for today.</p>
            <p className="text-sm text-muted-foreground/70">Add a new quest to begin your adventure!</p>
          </div>
        ) : (
          <>
            {uncompletedTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
            {completedTasks.length > 0 && uncompletedTasks.length > 0 && <hr className="border-dashed border-border my-4" />}
            {completedTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
