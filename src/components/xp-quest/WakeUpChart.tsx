"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useQuest } from "@/hooks/useQuest";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subDays, startOfDay, format, parse } from 'date-fns';

type TimeView = 'weekly' | 'monthly' | 'yearly';

export function WakeUpChart() {
    const { wakeUpTimes } = useQuest();
    const [timeView, setTimeView] = useState<TimeView>('weekly');

    const processData = (days: number) => {
        const endDate = startOfDay(new Date());
        const startDate = subDays(endDate, days - 1);
        
        const dataMap = new Map<string, number>();

        for (let i = 0; i < days; i++) {
            const date = subDays(endDate, i);
            const formattedDate = format(date, 'yyyy-MM-dd');
            dataMap.set(formattedDate, -1); // Use -1 to indicate no data
        }

        wakeUpTimes.forEach(w => {
            const date = parse(w.date, 'yyyy-MM-dd', new Date());
            if (date >= startDate && date <= endDate) {
                const [hours, minutes] = w.time.split(':').map(Number);
                dataMap.set(w.date, hours + minutes / 60);
            }
        });
        
        const chartData = Array.from(dataMap.entries())
            .map(([date, time]) => ({
                date: format(parse(date, 'yyyy-MM-dd', new Date()), 'MMM d'),
                time: time >= 0 ? time : null,
            }))
            .reverse();
            
        return chartData;
    }

    const views = {
        weekly: { data: processData(7), label: "Last 7 Days" },
        monthly: { data: processData(30), label: "Last 30 Days" },
        yearly: { data: processData(365), label: "Last 365 Days" },
    };

    const chartData = views[timeView].data;
    
    const chartConfig = {
        time: {
            label: "Wake Up Time",
            color: "hsl(var(--primary))",
        },
    }

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>Wake Up Time consistency</CardTitle>
                <CardDescription>{views[timeView].label}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={timeView} onValueChange={(v) => setTimeView(v as TimeView)} className="space-y-4">
                     <TabsList>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value={timeView} className="w-full">
                         <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value, index) => {
                                        if (timeView === 'yearly') {
                                           return index % 60 === 0 ? value : '';
                                        }
                                        if (timeView === 'monthly') {
                                           return index % 5 === 0 ? value : '';
                                        }
                                        return value;
                                    }}
                                />
                                <YAxis 
                                    domain={[4, 12]} 
                                    tickFormatter={(value) => `${String(value).padStart(2, '0')}:00`}
                                />
                                <Tooltip 
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        formatter={(value) => {
                                            const hours = Math.floor(value as number);
                                            const minutes = Math.round(((value as number) % 1) * 60);
                                            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                        }}
                                        label="Wake Up Time"
                                     />} 
                                />
                                <Bar dataKey="time" fill="var(--color-time)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
