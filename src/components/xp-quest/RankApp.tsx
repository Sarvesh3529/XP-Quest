"use client";

import { useQuest } from "@/hooks/useQuest";
import { RANKS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as LucideIcons from 'lucide-react';
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const Icon = ({ name, className }: { name: string, className?: string }) => {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <LucideIcons.ShieldQuestion className={className} />;
    return <LucideIcon className={cn(className)} />;
};

export function RankApp() {
    const { totalXp, currentRank, nextRank, rankProgress, xpToNextRank } = useQuest();

    return (
        <div className="container mx-auto max-w-2xl space-y-8">
            <Card className="border-primary/30 bg-card/80 overflow-hidden box-glow-primary">
                <div className="p-6 bg-gradient-to-br from-primary/20 to-transparent">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Icon name={currentRank.icon} className="w-24 h-24 text-primary text-glow-primary" />
                        <div className="flex-grow text-center md:text-left">
                            <p className="text-sm text-muted-foreground">Current Rank</p>
                            <h1 className="text-4xl font-bold text-primary-foreground">{currentRank.name}</h1>
                            <p className="text-lg text-muted-foreground font-code">{totalXp.toLocaleString()} XP</p>
                        </div>
                    </div>
                </div>

                {nextRank && (
                    <div className="p-6 border-t border-border/50">
                        <p className="text-sm text-center text-muted-foreground mb-2">Progress to {nextRank.name}</p>
                        <Progress value={rankProgress} className="h-4 bg-primary/20 [&>div]:bg-primary" />
                        <p className="text-xs text-center text-muted-foreground mt-2 font-code">{xpToNextRank.toLocaleString()} XP remaining</p>
                    </div>
                )}
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">All Ranks</h2>
                <div className="flex flex-col gap-4">
                    {RANKS.map(rank => {
                        const isAchieved = totalXp >= rank.xpThreshold;
                        const isCurrent = rank.name === currentRank.name;
                        return (
                            <Card key={rank.name} className={cn(
                                "flex items-center p-4",
                                isCurrent && "border-primary/80 ring-2 ring-primary/50 box-glow-primary",
                                !isAchieved && !isCurrent && "opacity-50"
                            )}>
                                <div className="flex-shrink-0 mr-4">
                                     <Icon name={rank.icon} className="w-12 h-12 text-primary/80" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold">{rank.name}</h3>
                                    <p className="text-sm font-code text-muted-foreground">{rank.xpThreshold.toLocaleString()} XP</p>
                                </div>
                                {isAchieved && <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />}
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
