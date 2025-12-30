"use client";

import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Dumbbell, Bed, CheckCircle2 } from 'lucide-react';

export function WorkoutTracker() {
  const { setWorkoutStatus, workoutForSelectedDate } = useQuest();

  if (workoutForSelectedDate) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card/60 border border-border/60">
            <CheckCircle2 className="w-10 h-10 text-primary mb-2"/>
            <h3 className="font-semibold">Activity Logged</h3>
            <p className="text-sm text-muted-foreground">
                You logged a {workoutForSelectedDate.workedOut ? "workout" : "rest day"} for this day.
            </p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 p-4 rounded-lg bg-card/60 border border-border/60">
      <h3 className="text-center font-semibold mb-2">Log Daily Activity</h3>
      <Button onClick={() => setWorkoutStatus(true)} size="lg" className="w-full">
        <Dumbbell className="mr-2" />
        Log Workout
      </Button>
      <Button onClick={() => setWorkoutStatus(false)} variant="secondary" className="w-full">
        <Bed className="mr-2" />
        Log Rest Day
      </Button>
    </div>
  );
}
