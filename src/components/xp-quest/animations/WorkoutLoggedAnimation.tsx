
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface WorkoutLoggedAnimationProps {
  workedOut: boolean;
  onAnimationComplete: () => void;
}

export function WorkoutLoggedAnimation({ workedOut, onAnimationComplete }: WorkoutLoggedAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onAnimationComplete();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
        >
          <CheckCircle2 className="w-10 h-10 text-primary mb-2 text-glow-primary" />
          <h3 className="font-semibold">Activity Logged</h3>
          <p className="text-sm text-muted-foreground">
            You logged a {workedOut ? "workout" : "rest day"}.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
