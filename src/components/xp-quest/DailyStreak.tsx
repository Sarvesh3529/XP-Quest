"use client";

import { useQuest } from '@/hooks/useQuest';
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DailyStreak() {
  const { streak } = useQuest();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-4 flex items-center justify-center gap-4">
        <Flame className="h-10 w-10 text-primary text-glow-primary" />
        <div className="text-center">
            <p className="text-4xl font-bold font-code">{isClient ? streak.current : 0}</p>
            <p className="text-xs text-muted-foreground -mt-1">Day Streak</p>
        </div>
      </CardContent>
    </Card>
  );
}
