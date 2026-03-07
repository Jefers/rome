'use client';

import { cn } from '@/lib/utils';
import type { Step } from '@/lib/markdownParser';

interface StepItemProps {
  step: Step;
  isHighlighted: boolean;
  onHighlight: (stepId: string) => void;
}

export function StepItem({ step, isHighlighted, onHighlight }: StepItemProps) {
  const timeColors: Record<string, string> = {
    'Morning': 'text-yellow-400',
    'Afternoon': 'text-orange-400',
    'Evening': 'text-purple-400',
    'Night': 'text-blue-400',
  };

  return (
    <button
      onClick={() => onHighlight(step.id)}
      className={cn(
        'w-full text-left p-3 rounded-xl transition-all duration-300',
        'hover:bg-pink-500/10 active:scale-[0.98]',
        'glass-card',
        isHighlighted && 'step-highlighted bg-pink-500/10'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{step.icon}</span>
        <div className="flex-1 min-w-0">
          {step.time && (
            <span className={cn(
              'text-xs font-medium uppercase tracking-wider',
              timeColors[step.time] || 'text-muted-foreground'
            )}>
              {step.time}
            </span>
          )}
          <p className={cn(
            'text-sm leading-relaxed',
            isHighlighted ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}>
            {step.content}
          </p>
        </div>
        {isHighlighted && (
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        )}
      </div>
    </button>
  );
}
