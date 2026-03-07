'use client';

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Destination, Step } from '@/lib/markdownParser';
import { StepItem } from './StepItem';

interface DestinationCardProps {
  destination: Destination;
  highlightedStepId: string | null;
  onHighlightStep: (stepId: string) => void;
}

export function DestinationCard({ destination, highlightedStepId, onHighlightStep }: DestinationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this destination has the highlighted step
  const hasHighlightedStep = destination.steps.some(s => s.id === highlightedStepId);

  // Auto-expand if contains highlighted step
  const shouldExpand = isExpanded || hasHighlightedStep;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full p-4 flex items-center justify-between',
          'hover:bg-pink-500/5 transition-colors touch-target'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-pink-500" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground">{destination.name}</h4>
            <p className="text-xs text-muted-foreground">
              {destination.steps.length} steps
              {destination.tips && destination.tips.length > 0 && ` • ${destination.tips.length} tips`}
              {destination.foodRecommendations && destination.foodRecommendations.length > 0 && ` • ${destination.foodRecommendations.length} eats`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-300',
            shouldExpand && 'rotate-180'
          )}
        />
      </button>

      {shouldExpand && (
        <div className="px-4 pb-4 space-y-3 fade-in">
          {/* Steps */}
          <div className="space-y-2">
            {destination.steps.map((step) => (
              <StepItem
                key={step.id}
                step={step}
                isHighlighted={highlightedStepId === step.id}
                onHighlight={onHighlightStep}
              />
            ))}
          </div>

          {/* Tips */}
          {destination.tips && destination.tips.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-pink-400 mb-2 flex items-center gap-2">
                💡 Tips
              </h5>
              <div className="space-y-2">
                {destination.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  >
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Recommendations */}
          {destination.foodRecommendations && destination.foodRecommendations.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-pink-400 mb-2 flex items-center gap-2">
                🍽️ Food & Drinks
              </h5>
              <div className="space-y-2">
                {destination.foodRecommendations.map((food, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <p className="text-sm text-muted-foreground">{food}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
