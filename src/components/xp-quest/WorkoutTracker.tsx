
"use client";

import { useState, useEffect } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Dumbbell, Bed } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkoutLoggedAnimation } from './animations/WorkoutLoggedAnimation';

export function WorkoutTracker() {
  const { setWorkoutStatus, workoutForSelectedDate } = useQuest();
  const [isClient, setIsClient] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSetStatus = (workedOut: boolean) => {
    setWorkoutStatus(workedOut);
    setShowAnimation(true);
  };

  if (!isClient) {
    return (
      <Skeleton className="h-[152px] w-full" />
    );
  }

  return (
    <div className="relative h-[152px] flex flex-col gap-2 p-4 rounded-lg bg-card/60 border border-border/60">
      {workoutForSelectedDate && !showAnimation ? (
         <div className="flex flex-col items-center justify-center text-center h-full">
            <Dumbbell className="w-10 h-10 text-primary mb-2"/>
            <h3 className="font-semibold">Activity Logged</h3>
            <p className="text-sm text-muted-foreground">
              You logged a {workoutForSelectedDate.workedOut ? "workout" : "rest day"}.
            </p>
        </div>
      ) : showAnimation ? (
        <WorkoutLoggedAnimation 
          workedOut={workoutForSelectedDate?.workedOut ?? false} 
          onAnimationComplete={() => setShowAnimation(false)} 
        />
      ) : (
        <>
          <h3 className="text-center font-semibold mb-2">Log Daily Activity</h3>
          <Button onClick={() => handleSetStatus(true)} size="lg" className="w-full">
            <Dumbbell className="mr-2" />
            Log Workout
          </Button>
          <Button onClick={() => handleSetStatus(false)} variant="secondary" className="w-full">
            <Bed className="mr-2" />
            Log Rest Day
          </Button>
        </>
      )}
    </div>
  );
}
