'use client';

import { useState, useEffect } from 'react';

type MapViewProps = {
  isDark: boolean;
  onLocationClick?: (location: any) => void;
};

export default function ClientMapView({ isDark, onLocationClick }: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import MapView only on client side
    import('./MapView').then((module) => {
      setMapComponent(() => module.MapView);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load MapView:', error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  if (!MapComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="text-muted-foreground">Map unavailable</div>
      </div>
    );
  }

  return <MapComponent isDark={isDark} onLocationClick={onLocationClick} />;
}
