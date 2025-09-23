import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Navigation } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  origin: string;
  destination: string;
  waypoints: Array<{
    name: string;
    weather: {
      condition: string;
      temperature: number;
    };
    roadCondition: {
      status: string;
      alerts: string[];
    };
  }>;
}

const RouteMap = ({ origin, destination, waypoints }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([19.0760, 72.8777], 8);

    // Add OpenStreetMap tiles (free, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Sample coordinates for demonstration (Mumbai to Pune route)
    const routeCoordinates: [number, number][] = [
      [19.0760, 72.8777], // Mumbai
      [18.9068, 73.1602], // Kalyan (waypoint)
      [18.7539, 73.4263], // Lonavala (waypoint) 
      [18.7279, 73.4394], // Khandala (waypoint)
      [18.5204, 73.8567], // Pune
    ];

    // Create custom icons
    const originIcon = L.divIcon({
      html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const destinationIcon = L.divIcon({
      html: '<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const waypointIcon = L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: 'custom-div-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add origin marker
    L.marker(routeCoordinates[0], { icon: originIcon })
      .addTo(map.current)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${origin}</h3>
          <p class="text-xs text-gray-600">Origin</p>
        </div>
      `);

    // Add destination marker
    L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: destinationIcon })
      .addTo(map.current)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${destination}</h3>
          <p class="text-xs text-gray-600">Destination</p>
        </div>
      `);

    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      const waypointCoords = routeCoordinates[index + 1]; // Skip origin
      if (waypointCoords) {
        const alertsHtml = waypoint.roadCondition.alerts.length > 0 
          ? `<div class="mt-2 p-2 bg-amber-50 rounded text-xs">
               <strong class="text-amber-700">Alerts:</strong><br>
               ${waypoint.roadCondition.alerts.map(alert => `• ${alert}`).join('<br>')}
             </div>`
          : '';

        L.marker(waypointCoords, { icon: waypointIcon })
          .addTo(map.current)
          .bindPopup(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-sm">${waypoint.name}</h3>
              <div class="mt-1 text-xs">
                <div class="flex justify-between">
                  <span>Weather:</span>
                  <span>${waypoint.weather.temperature}°C, ${waypoint.weather.condition}</span>
                </div>
                <div class="flex justify-between">
                  <span>Road:</span>
                  <span class="capitalize ${
                    waypoint.roadCondition.status === 'good' ? 'text-green-600' :
                    waypoint.roadCondition.status === 'fair' ? 'text-yellow-600' : 'text-red-600'
                  }">${waypoint.roadCondition.status}</span>
                </div>
              </div>
              ${alertsHtml}
            </div>
          `);
      }
    });

    // Add route line
    const polyline = L.polyline(routeCoordinates, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(map.current);

    // Fit the map to show the entire route
    map.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [origin, destination, waypoints]);

  return (
    <Card className="travel-card overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Route Map
          </h3>
          <Navigation className="h-5 w-5 text-primary" />
        </div>
        
        <div 
          ref={mapContainer} 
          className="w-full h-80 rounded-lg border border-border/50"
          style={{ minHeight: '320px' }}
        />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Interactive map powered by OpenStreetMap</span>
          <span>Click markers for details</span>
        </div>
      </div>
    </Card>
  );
};

export default RouteMap;