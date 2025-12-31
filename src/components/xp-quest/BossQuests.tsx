
"use client";

import { useMemo, useState, useEffect } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TaskItem } from './TaskItem';
import { Swords, Plus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import type { BossQuestType } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';


export function BossQuests() {
  const { tasks, addBossQuest, completions } = useQuest();
  const [showForm, setShowForm] = useState(false);
  const [newQuestText, setNewQuestText] = useState('');
  const [questType, setQuestType] = useState<BossQuestType>('weekly');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const bossQuests = useMemo(() => {
    return tasks.filter(task => {
      if (!task.isBossQuest) return false;
      const isCompleted = completions.some(c => c.taskId === task.id);
      return !isCompleted;
    });
  }, [tasks, completions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestText.trim()) {
      addBossQuest(newQuestText, questType);
      setNewQuestText('');
      setShowForm(false);
    }
  };

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Swords className="h-6 w-6 text-primary text-glow-primary"/>
                <div>
                    <CardTitle className="text-xl">Boss Quests</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <CardDescription>High-risk, high-reward timed challenges.</CardDescription>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Weekly quests last 7 days. Monthly last 30 days.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(p => !p)}>
                <Plus className="h-5 w-5" />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
            {showForm && (
                 <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-4"
                >
                    <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        placeholder="Add a new boss quest..."
                        value={newQuestText}
                        onChange={(e) => setNewQuestText(e.target.value)}
                        className="bg-background/50 focus:bg-background"
                    />
                    <Select onValueChange={(value: BossQuestType) => setQuestType(value)} defaultValue={questType}>
                        <SelectTrigger className="w-[140px] bg-background/50 focus:bg-background">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" size="icon" className="flex-shrink-0">
                        <Plus />
                    </Button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
        <div className="space-y-2">
          {!isClient ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
            </div>
          ) : bossQuests.length > 0 ? (
            bossQuests.map(quest => (
                <TaskItem key={quest.id} task={quest} />
            ))
           ) : (
             <div className="text-center py-6">
                <p className="text-muted-foreground">No active boss quests.</p>
                <p className="text-sm text-muted-foreground/70">Click the '+' to create one.</p>
             </div>
           )
          }
        </div>
      </CardContent>
    </Card>
  );
}
