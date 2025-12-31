"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Swords, Home, BarChart2, Shield, LineChart, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/rank', label: 'Ranks', icon: Shield },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/report', label: 'AI Report', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card/50 px-4 md:hidden sticky top-0 z-30 backdrop-blur-sm">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-card border-r-0">
          <nav className="grid gap-4 text-lg font-medium">
             <Link href="/" className="flex items-center gap-2 mb-4 group">
                <Swords className="h-8 w-8 text-primary text-glow-primary transition-transform group-hover:scale-110" />
                <h1 className="text-2xl font-bold text-glow-primary">XP Quest</h1>
             </Link>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                    isActive && 'text-primary'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
       <Link href="/" className="flex items-center gap-2">
        <Swords className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">XP Quest</h1>
      </Link>
    </header>
  );
}
