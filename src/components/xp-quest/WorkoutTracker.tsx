
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
    <div className="relative h-full flex flex-col gap-2 p-4 rounded-lg bg-card/60 border border-border/60">
      {workoutForSelectedDate || showAnimation ? (
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
