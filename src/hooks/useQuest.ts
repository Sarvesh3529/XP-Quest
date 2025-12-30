"use client";

import { useContext } from 'react';
import { QuestContext, type QuestContextType } from '@/context/QuestProvider';

export const useQuest = (): QuestContextType => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};
