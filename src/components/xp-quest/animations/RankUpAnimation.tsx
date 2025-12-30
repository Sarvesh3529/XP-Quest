"use client";

import { motion } from "framer-motion";
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuest } from "@/hooks/useQuest";
import type { Rank } from "@/lib/types";
import { cn } from "@/lib/utils";

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.ShieldQuestion className={className} />;
  return <LucideIcon className={cn(className)} />;
};

export function RankUpAnimation() {
  const { rankUpInfo, clearRankUp } = useQuest();

  if (!rankUpInfo) return null;

  const { oldRank, newRank } = rankUpInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className="w-[350px] text-center border-primary/50 box-glow-primary">
          <CardContent className="p-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">RANK UP!</h2>
            <div className="relative h-32 my-6 flex items-center justify-center">
              <motion.div
                key={oldRank.name}
                initial={{ opacity: 1, scale: 1, y: 0 }}
                animate={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <Icon name={oldRank.icon} className="w-28 h-28 text-muted-foreground" />
              </motion.div>
              <motion.div
                key={newRank.name}
                className="absolute"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <Icon name={newRank.icon} className="w-32 h-32 text-primary text-glow-primary" />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-muted-foreground"
            >
              You have been promoted to
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="text-3xl font-bold text-white"
            >
              {newRank.name}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="mt-8"
            >
              <Button onClick={clearRankUp} className="w-full">Continue</Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
