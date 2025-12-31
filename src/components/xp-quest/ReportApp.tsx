
"use client";

import { useState, useEffect } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateMonthlyReport } from '@/lib/ai-actions';
import { Loader2 } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { MonthlyReport } from '@/lib/types';
import { format, getMonth, getYear } from 'date-fns';

export function ReportApp() {
  const { getCompletionsForMonth, getTasksByIds } = useQuest();
  const [monthlyReport, setMonthlyReport] = useLocalStorage<MonthlyReport | null>('xp-quest-monthly-report', null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    
    const completions = getCompletionsForMonth(currentDate);
    const completedTaskIds = completions.map(c => c.taskId);
    const tasks = getTasksByIds(completedTaskIds);
    
    if (tasks.length === 0) {
      toast({
        title: `No quests completed in ${format(currentDate, 'MMMM')}`,
        description: "Complete some quests to generate a report.",
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const taskDescriptions = tasks.map(t => `${t.text} (Difficulty: ${t.difficulty})`).join(', ');
      const result = await generateMonthlyReport({ completedTasks: taskDescriptions });
      
      const newReport: MonthlyReport = {
        ...result,
        generatedDate: new Date().toISOString(),
      };
      
      setMonthlyReport(newReport);

      toast({
        title: "Report Generated Successfully!",
        description: "Your new monthly report is now available.",
      });

    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        title: "Error Generating Report",
        description: "Something went wrong. Please try again later.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const reportIsForCurrentMonth = monthlyReport && getMonth(new Date(monthlyReport.generatedDate)) === getMonth(currentDate) && getYear(new Date(monthlyReport.generatedDate)) === getYear(currentDate);

  const showReport = isClient && reportIsForCurrentMonth && monthlyReport;

  return (
    <div className="container mx-auto max-w-4xl">
        <Card className="border-border/60">
        <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                    <CardTitle className="text-2xl text-glow-primary">Monthly Performance Debrief</CardTitle>
                    <CardDescription>
                        AI-powered insights for {format(currentDate, 'MMMM yyyy')}.
                    </CardDescription>
                </div>
                <Button onClick={handleGenerateReport} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
                    Generate This Month's Report
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {showReport ? (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                <h3 className="font-bold text-lg mb-2 text-primary">Performance Debrief</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{monthlyReport.report}</p>
                </div>
                <div>
                <h3 className="font-bold text-lg mb-2 text-accent">Actionable Directives</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{monthlyReport.improvementSuggestions}</p>
                </div>
            </div>
            ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No report generated for {format(currentDate, 'MMMM')} yet.</p>
                <p className="text-muted-foreground/70 text-sm">Complete some quests and generate your first report!</p>
            </div>
            )}
        </CardContent>
        </Card>
    </div>
  );
}
