"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Swords, Shield, LineChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/rank', label: 'Ranks', icon: Shield },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/report', label: 'AI Report', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-card/50 p-4 border-r border-border/50 hidden md:flex flex-col">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <Swords className="h-8 w-8 text-primary text-glow-primary transition-transform group-hover:scale-110" />
        <h1 className="text-2xl font-bold text-glow-primary">XP Quest</h1>
      </Link>
      <nav className="flex flex-col gap-2">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-secondary',
                      isActive && 'bg-primary/20 text-primary border border-primary/50'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
