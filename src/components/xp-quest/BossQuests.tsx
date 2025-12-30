"use client";

import { useMemo } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TaskItem } from './TaskItem';
import { Swords } from 'lucide-react';
import { isWithinInterval } from 'date-fns';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export function BossQuests() {
  const { tasks } = useQuest();

  const bossQuests = useMemo(() => {
    const now = new Date();
    const weekInterval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    const monthInterval = { start: startOfMonth(now), end: endOfMonth(now) };

    return tasks.filter(task => {
      if (task.isBossQuest === 'weekly') {
        return isWithinInterval(new Date(task.createdAt), weekInterval);
      }
      if (task.isBossQuest === 'monthly') {
        return isWithinInterval(new Date(task.createdAt), monthInterval);
      }
      return false;
    });
  }, [tasks]);

  if (bossQuests.length === 0) return null;

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Swords className="h-6 w-6 text-primary text-glow-primary"/>
            <div>
                 <CardTitle className="text-xl">Boss Quests</CardTitle>
                <CardDescription>High-risk, high-reward challenges.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {bossQuests.map(quest => (
            <TaskItem key={quest.id} task={quest} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
