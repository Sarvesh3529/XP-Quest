"use client";

import { useState } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Plus, Unlock } from 'lucide-react';
import type { TaskDifficulty } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TaskForm() {
  const { addTask, lockDate, isDateLocked, tasksForSelectedDate, flashLock } = useQuest();
  const [newTaskText, setNewTaskText] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Easy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() && !isDateLocked) {
      addTask(newTaskText, difficulty);
      setNewTaskText('');
    }
  };

  const dailyTasksExist = tasksForSelectedDate.some(t => !t.isBossQuest);

  return (
    <div>
      <AnimatePresence>
        {!isDateLocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
              <Input
                placeholder="Add a new quest..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="bg-background/50 focus:bg-background"
              />
              <Select onValueChange={(value: TaskDifficulty) => setDifficulty(value)} defaultValue={difficulty}>
                <SelectTrigger className="w-[120px] bg-background/50 focus:bg-background">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="icon" className="flex-shrink-0">
                <Plus />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {dailyTasksExist && !isDateLocked && (
        <div className="flex justify-center">
            <Button
              onClick={lockDate}
              variant="outline"
              className={cn(
                "border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all w-full",
                flashLock && "animate-flash"
              )}
            >
              <Unlock className="mr-2 h-4 w-4" />
              Lock In Quests for Today
            </Button>
        </div>
      )}
      {isDateLocked && dailyTasksExist && (
         <div className="flex justify-center">
             <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed border-border/50 rounded-full px-4 py-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Quests for this day are locked.</span>
            </div>
        </div>
      )}
    </div>
  );
}
