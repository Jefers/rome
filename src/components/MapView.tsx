'use client';

import { useSyncExternalStore, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { romeLocations, type Location } from '@/lib/markdownParser';

// Fix for default marker icons in react-leaflet
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #ec4899, #db2777);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  map.setView(center, zoom);
  
  return null;
}

// useSyncExternalStore for client-side only rendering
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

interface MapViewProps {
  isDark: boolean;
  onLocationClick?: (location: Location) => void;
}

export function MapView({ isDark, onLocationClick }: MapViewProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const center: [number, number] = [41.9028, 12.4964]; // Rome center
  const zoom = 13;

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden glass-card">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={isDark 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          }
        />
        {romeLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => {
                setSelectedLocation(location);
                onLocationClick?.(location);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h3 className="font-semibold text-foreground text-sm">{location.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {location.dayId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <button
                  onClick={() => onLocationClick?.(location)}
                  className="mt-2 w-full py-1.5 px-3 bg-pink-500 text-white text-xs rounded-lg hover:bg-pink-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-20 left-4 glass-card p-3 z-[1000]">
        <h4 className="text-xs font-semibold text-foreground mb-2">Locations</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
          {romeLocations.slice(0, 5).map((loc) => (
            <button
              key={loc.id}
              onClick={() => onLocationClick?.(loc)}
              className="flex items-center gap-2 w-full text-left hover:bg-pink-500/10 p-1 rounded transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-pink-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{loc.name}</span>
            </button>
          ))}
          {romeLocations.length > 5 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{romeLocations.length - 5} more locations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
