"use client";

import { useQuest } from '@/hooks/useQuest';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Icon = ({ name, className }: { name: string, className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.ShieldQuestion className={className} />;
  return <LucideIcon className={cn(className)} />;
};

export function RankBadge() {
  const { totalXp, currentRank, nextRank, rankProgress, xpToNextRank } = useQuest();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return (
        <Card className="border-border/60 bg-card/60">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-4">
        <Link href="/rank" className="flex items-center gap-4 group">
          <div className="flex-shrink-0">
            <Icon name={currentRank.icon} className="h-12 w-12 text-primary text-glow-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground">{currentRank.name}</p>
            <p className="text-2xl font-bold font-code">{totalXp.toLocaleString()} XP</p>
            <div className="mt-1 space-y-1">
               <Progress value={rankProgress} className="h-2 bg-primary/20 [&>div]:bg-primary" />
               {nextRank && (
                <p className="text-xs text-muted-foreground font-code">
                  {xpToNextRank.toLocaleString()} XP to {nextRank.name}
                </p>
               )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
