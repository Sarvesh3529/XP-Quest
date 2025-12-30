"use client";

import { useState } from 'react';
import { useQuest } from '@/hooks/useQuest';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlarmClockCheck, Loader2 } from 'lucide-react';

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export function WakeUpTime() {
  const { setWakeUpTime, wakeUpTimeForSelectedDate } = useQuest();
  const { toast } = useToast();
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogTime = async () => {
    setIsLoading(true);
    const time = `${hour}:${minute}`;
    const message = await setWakeUpTime(time);
    
    toast({
        title: `Wake Up Time Logged: ${time}`,
        description: message || "Keep up the great work!",
    });
    setIsLoading(false);
  };
  
  if (wakeUpTimeForSelectedDate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-lg bg-card/60 border border-border/60">
          <AlarmClockCheck className="w-10 h-10 text-primary mb-2"/>
          <h3 className="font-semibold">Woke Up At</h3>
          <p className="text-3xl font-bold font-code text-primary-foreground">
              {wakeUpTimeForSelectedDate.time}
          </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 p-4 rounded-lg bg-card/60 border border-border/60">
      <h3 className="text-center font-semibold mb-2">Log Wake Up Time</h3>
      <div className="flex gap-2 items-center">
        <Select value={hour} onValueChange={setHour}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="font-bold">:</span>
        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {minutes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleLogTime} disabled={isLoading} className="w-full">
         {isLoading ? <Loader2 className="animate-spin" /> : 'Log Time'}
      </Button>
    </div>
  );
}
