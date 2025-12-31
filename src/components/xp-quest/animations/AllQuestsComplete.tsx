
"use client";

import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

const ConfettiPiece = ({ left, top, delay, duration, color }: any) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ left, top, backgroundColor: color }}
    initial={{ y: 0, opacity: 1 }}
    animate={{ y: '100vh', opacity: 0 }}
    transition={{ delay, duration, ease: "linear" }}
  />
);

export function AllQuestsComplete() {
  const [visible, setVisible] = useState(true);
  const confettiColors = ['#39FF14', '#7DF9FF', '#FFFFFF'];
  const numConfetti = 100;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000); // Hide after 4 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <PartyPopper className="w-24 h-24 text-primary text-glow-primary" />
        <h2 className="text-4xl font-bold text-white">All Quests Complete!</h2>
        <p className="text-lg text-muted-foreground">Amazing work. See you tomorrow!</p>
      </motion.div>
      {Array.from({ length: numConfetti }).map((_, i) => (
        <ConfettiPiece
          key={i}
          left={`${Math.random() * 100}%`}
          top={`${-10 - Math.random() * 20}%`}
          delay={Math.random() * 2}
          duration={3 + Math.random() * 3}
          color={confettiColors[Math.floor(Math.random() * confettiColors.length)]}
        />
      ))}
    </div>
  );
}
