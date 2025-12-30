"use client";

import { useQuest } from '@/hooks/useQuest';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, isToday } from 'date-fns';

export function DatePicker() {
  const { selectedDate, selectDate } = useQuest();

  return (
    <Card className="border-border/60 bg-card/60">
        <div className="p-3 text-center border-b border-border/60">
            <h2 className="text-lg font-semibold">{format(selectedDate, "eeee, MMMM d")}</h2>
            <p className="text-sm text-muted-foreground">{isToday(selectedDate) ? "Today's Quests" : "Viewing Past Quests"}</p>
        </div>
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && selectDate(date)}
            className="p-2"
            disabled={(date) => date > new Date()}
          />
        </CardContent>
    </Card>
  );
}
