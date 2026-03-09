'use client';

import { useState, useEffect, useMemo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DayAccordion } from '@/components/DayAccordion';
import { BottomNav, type ViewType } from '@/components/BottomNav';
import { MapView } from '@/components/MapView';
import { GalleryView } from '@/components/GalleryView';
import { parseMarkdown, type ItineraryData } from '@/lib/markdownParser';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MapPin, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('itinerary');
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedStepId, setHighlightedStepId] = useLocalStorage<string | null>('highlighted-step', null);
  const [isDark, setIsDark] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  // Load itinerary data
  useEffect(() => {
    fetch('/itinerary.md')
      .then(res => res.text())
      .then(text => {
        const data = parseMarkdown(text);
        setItinerary(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Handle step highlighting
  const handleHighlightStep = (stepId: string) => {
    // Toggle: if already highlighted, unhighlight; otherwise highlight
    setHighlightedStepId(prev => prev === stepId ? null : stepId);
  };

  // Cost breakdown component
  const CostBreakdown = useMemo(() => {
    if (!itinerary) return null;
    
    return (
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          💰 Cost Breakdown
        </h3>
        <div className="space-y-2">
          {itinerary.costBreakdown.map((item, index) => (
            <div key={index} className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
        {itinerary.outro && (
          <p className="text-sm text-center text-pink-500 font-medium pt-2">
            {itinerary.outro}
          </p>
        )}
      </div>
    );
  }, [itinerary]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-pink-600 animate-pulse shadow-lg shadow-pink-500/30" />
          <p className="text-muted-foreground animate-pulse">Loading your Rome adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-pink-500/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-white text-lg">🇮🇹</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">
                {itinerary?.title || 'Rome Trip'}
              </h1>
              <p className="text-xs text-muted-foreground">5-Day Adventure</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIntro(!showIntro)}
              className="w-10 h-10 rounded-full hover:bg-pink-500/10 flex items-center justify-center transition-colors touch-target"
              aria-label="Show trip info"
            >
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Intro Modal */}
      {showIntro && itinerary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto custom-scrollbar fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Welcome to Rome!</h2>
              <button
                onClick={() => setShowIntro(false)}
                className="w-8 h-8 rounded-full hover:bg-pink-500/10 flex items-center justify-center touch-target"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {itinerary.intro}
            </p>
            <div className="flex items-center gap-2 text-sm text-pink-500">
              <MapPin className="w-4 h-4" />
              <span>Hotel near Spanish Steps</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-4">
        {activeView === 'itinerary' && itinerary && (
          <div className="space-y-4">
            {/* Progress indicator */}
            {highlightedStepId && (
              <div className="glass-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                  <span className="text-sm text-foreground">Current Step</span>
                </div>
                <button
                  onClick={() => setHighlightedStepId(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Days */}
            {itinerary.days.map((day) => (
              <DayAccordion
                key={day.id}
                day={day}
                highlightedStepId={highlightedStepId}
                onHighlightStep={handleHighlightStep}
              />
            ))}

            {/* Cost Breakdown */}
            {CostBreakdown}
          </div>
        )}

        {activeView === 'map' && (
          <div className="h-[calc(100vh-180px)]">
            <MapView 
              isDark={isDark}
              onLocationClick={(location) => {
                // Could show location details or navigate to itinerary
                console.log('Location clicked:', location);
              }}
            />
          </div>
        )}

        {activeView === 'gallery' && (
          <div className="h-[calc(100vh-180px)]">
            <GalleryView />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
