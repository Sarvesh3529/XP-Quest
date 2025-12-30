"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const XpGain = ({ xp, onAnimationEnd }: { xp: number; onAnimationEnd: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onAnimationEnd();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span
        className={cn(
          'font-bold font-code text-primary text-glow-primary animate-ping-and-fade-up'
        )}
        style={{
          animation: 'ping-and-fade-up 1.5s ease-out forwards',
        }}
      >
        +{xp} XP
      </span>
      <style jsx>{`
        @keyframes ping-and-fade-up {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) translateY(-20px);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.2) translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
