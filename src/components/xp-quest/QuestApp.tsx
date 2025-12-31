
"use client";

import { useQuest } from "@/hooks/useQuest";
import { RankUpAnimation } from "./animations/RankUpAnimation";
import { RankBadge } from "./RankBadge";
import { DatePicker } from "./DatePicker";
import { DailyStreak } from "./DailyStreak";
import { WakeUpTime } from "./WakeUpTime";
import { WorkoutTracker } from "./WorkoutTracker";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { BossQuests } from "./BossQuests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";


export function QuestApp() {
    const { rankUpInfo } = useQuest();

    return (
        <div className="relative">
            {rankUpInfo && <RankUpAnimation />}
            <div className="space-y-6">
                <DatePicker />
                <RankBadge />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Left Column */}
                    <aside className="col-span-1 md:col-span-4 xl:col-span-3 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <DailyStreak />
                            <WakeUpTime />
                        </div>
                        <WorkoutTracker />
                    </aside>

                    {/* Right Column */}
                    <div className="col-span-1 md:col-span-8 xl:col-span-9 space-y-6">
                        <Card className="border-border/60 bg-card/60">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <BookOpenCheck className="h-6 w-6 text-primary text-glow-primary" />
                                    <div>
                                        <CardTitle className="text-xl">Daily Quests</CardTitle>
                                        <CardDescription>Your tasks for the selected day.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <TaskList />
                                <TaskForm />
                            </CardContent>
                        </Card>

                        <BossQuests />
                    </div>
                </div>
            </div>
        </div>
    )
}
