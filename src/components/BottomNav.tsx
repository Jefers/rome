'use client';

import { Map, List, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'itinerary' | 'map' | 'gallery';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const tabs: { id: ViewType; label: string; icon: typeof List }[] = [
    { id: 'itinerary', label: 'Itinerary', icon: List },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'gallery', label: 'Gallery', icon: Camera },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav">
      <div className="mx-4 mb-4 glass-card shadow-lg shadow-pink-500/10">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-6 rounded-xl transition-all duration-300 touch-target',
                  isActive 
                    ? 'bg-pink-500/20 text-pink-500' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-pink-500/10'
                )}
              >
                <Icon className={cn(
                  'w-6 h-6 transition-transform duration-300',
                  isActive && 'scale-110'
                )} />
                <span className={cn(
                  'text-xs mt-1 font-medium',
                  isActive && 'text-pink-500'
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-pink-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
