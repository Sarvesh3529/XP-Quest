"use client";

import { useState, useMemo, useEffect } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Zap, Trophy, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, TaskDifficulty } from '@/lib/types';
import { XpGain } from './animations/XpGain';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { differenceInDays, differenceInHours, differenceInMinutes, addDays, addMonths } from 'date-fns';

const difficultyConfig: Record<TaskDifficulty, { className: string; icon: React.ElementType }> = {
  Easy: { className: "bg-green-500/20 text-green-400 border-green-500/30", icon: Zap },
  Medium: { className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Zap },
  Hard: { className: "bg-red-500/20 text-red-400 border-red-500/30", icon: Zap },
};

const bossQuestConfig: Record<string, { className: string; icon: React.ElementType }> = {
  weekly: { className: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Calendar },
  monthly: { className: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Trophy },
};

const TimeRemaining = ({ task }: { task: Task }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        if (!task.isBossQuest) return;
        const interval = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(interval);
    }, [task.isBossQuest]);

    if (!task.isBossQuest) return null;

    const deadline = task.isBossQuest === 'weekly' 
        ? addDays(task.createdAt, 7) 
        : addMonths(task.createdAt, 1);

    const daysLeft = differenceInDays(deadline, now);
    const hoursLeft = differenceInHours(deadline, now) % 24;
    const minutesLeft = differenceInMinutes(deadline, now) % 60;

    let timeText = 'Time is up!';
    if (daysLeft > 0) {
        timeText = `${daysLeft}d ${hoursLeft}h left`;
    } else if (hoursLeft > 0) {
        timeText = `${hoursLeft}h ${minutesLeft}m left`;
    } else if (minutesLeft > 0) {
        timeText = `${minutesLeft}m left`;
    }
    
    return (
        <Badge variant="outline" className="font-code text-xs border-dashed">
            <Clock className="h-3 w-3 mr-1.5"/>
            {timeText}
        </Badge>
    );
};

export function TaskItem({ task }: { task: Task }) {
  const { toggleCompletion, deleteTask, completions, isDateLocked } = useQuest();
  const [showXp, setShowXp] = useState<number | null>(null);

  const isCompleted = useMemo(() => 
    completions.some(c => c.taskId === task.id),
    [completions, task.id]
  );
  
  const completion = useMemo(() => 
    completions.find(c => c.taskId === task.id),
    [completions, task.id]
  );

  const handleComplete = () => {
    const wasCompleted = isCompleted;
    const xp = toggleCompletion(task.id);
    if (!wasCompleted && xp) {
      setShowXp(xp);
    }
  };

  const canBeDeleted = !isDateLocked && !task.isBossQuest;

  const config = task.isBossQuest 
    ? bossQuestConfig[task.isBossQuest]
    : difficultyConfig[task.difficulty];

  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-4 p-3 rounded-lg border transition-all relative overflow-hidden",
      isCompleted ? "bg-primary/10 border-primary/20" : "bg-card/60 hover:bg-secondary/50",
       task.isBossQuest ? "border-amber-500/30" : "border-transparent hover:border-border"
    )}>
      {showXp !== null && (isDateLocked || task.isBossQuest) && (
        <XpGain xp={showXp} onAnimationEnd={() => setShowXp(null)} />
      )}
      <div className="flex-shrink-0">
        <Button
          size="icon"
          variant={isCompleted ? "default" : "outline"}
          onClick={handleComplete}
          disabled={!task.isBossQuest && !isDateLocked}
          className={cn(
            "h-8 w-8 rounded-full transition-all",
            isCompleted && "bg-primary border-primary hover:bg-primary/90",
            !isCompleted && "border-border/50"
          )}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow">
        <p className={cn("font-medium", isCompleted && "line-through text-muted-foreground")}>
          {task.text}
        </p>
         {task.isBossQuest && <div className="mt-1.5"><TimeRemaining task={task} /></div>}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                     <Badge variant="outline" className={cn("font-code uppercase", config.className)}>
                        <Icon className="h-3 w-3 mr-1.5" />
                        {task.isBossQuest || task.difficulty}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{task.isBossQuest ? 'Boss Quest' : `${task.difficulty} Difficulty`}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        {canBeDeleted ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteTask(task.id)}
            className="h-7 w-7 text-muted-foreground hover:text-destructive/80"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : <div className="h-7"/>}
      </div>
    </div>
  );
}