"use client";

import { useQuest } from '@/hooks/useQuest';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Icon = ({ name, className }: { name: string, className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.ShieldQuestion className={className} />;
  return <LucideIcon className={cn(className)} />;
};

export function RankBadge() {
  const { totalXp, currentRank, nextRank, rankProgress, xpToNextRank } = useQuest();

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
