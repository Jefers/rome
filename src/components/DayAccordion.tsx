'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Day } from '@/lib/markdownParser';
import { DestinationCard } from './DestinationCard';

interface DayAccordionProps {
  day: Day;
  highlightedStepId: string | null;
  onHighlightStep: (stepId: string) => void;
}

export function DayAccordion({ day, highlightedStepId, onHighlightStep }: DayAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Check if this day has the highlighted step
  const hasHighlightedStep = day.destinations.some(d => 
    d.steps.some(s => s.id === highlightedStepId)
  );

  // Auto-expand if contains highlighted step
  const shouldExpand = isExpanded || hasHighlightedStep;

  // Scroll to highlighted step when it changes
  useEffect(() => {
    if (highlightedStepId && hasHighlightedStep && highlightRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [highlightedStepId, hasHighlightedStep]);

  // Extract day number from title
  const dayNumber = day.title.match(/Day (\d+)/)?.[1] || '1';
  const dayTitle = day.title.replace(/Day \d+:?\s*/, '');

  // Calculate total steps for this day
  const totalSteps = day.destinations.reduce((acc, d) => acc + d.steps.length, 0);

  return (
    <div
      ref={highlightRef}
      className={cn(
        'glass-card overflow-hidden transition-all duration-300',
        hasHighlightedStep && 'ring-2 ring-pink-500/50'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full p-4 flex items-center justify-between',
          'hover:bg-pink-500/5 transition-colors touch-target'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="card-glow-wrapper">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
              <span className="text-xs opacity-80">Day</span>
              <span className="text-lg leading-tight">{dayNumber}</span>
            </div>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">{dayTitle}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{day.description}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {day.destinations.length} stops
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {totalSteps} steps
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-6 h-6 text-pink-500 transition-transform duration-300 flex-shrink-0',
            shouldExpand && 'rotate-180'
          )}
        />
      </button>

      <div
        ref={contentRef}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          shouldExpand ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 space-y-3">
          {day.destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              highlightedStepId={highlightedStepId}
              onHighlightStep={onHighlightStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Import MapPin for the display
function MapPin({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
