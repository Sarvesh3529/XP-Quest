"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { WakeUpChart } from "./WakeUpChart";
import { BrainCircuit } from 'lucide-react';

export function AnalyticsApp() {
    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            <Card className="border-border/60">
                 <CardHeader>
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-6 w-6 text-primary text-glow-primary"/>
                        <div>
                            <CardTitle className="text-2xl">Your Habits</CardTitle>
                            <CardDescription>Visualizing your patterns over time.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <WakeUpChart />
                </CardContent>
            </Card>
        </div>
    );
}
