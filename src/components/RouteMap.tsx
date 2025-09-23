import React, { useEffect, useRef, useState } from 'react';
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
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  // Geocoding function to get coordinates from city names
  const geocodeCity = async (cityName: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Get actual route from OSRM
  const getRoute = async (originCoords: [number, number], destCoords: [number, number]): Promise<[number, number][]> => {
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`);
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates;
        // Convert from [lon, lat] to [lat, lon] for Leaflet
        return coords.map((coord: [number, number]) => [coord[1], coord[0]]);
      }
    } catch (error) {
      console.error('Routing error:', error);
    }
    return [];
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      setLoading(true);

      // Initialize map
      map.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5); // India center

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);

      // Get coordinates for origin and destination
      const originCoords = await geocodeCity(origin);
      const destCoords = await geocodeCity(destination);

      if (originCoords && destCoords) {
        // Get actual route
        const routePoints = await getRoute(originCoords, destCoords);
        
        if (routePoints.length > 0) {
          setRouteCoordinates(routePoints);
        } else {
          // Fallback to direct line if routing fails
          setRouteCoordinates([originCoords, destCoords]);
        }
      } else {
        // Fallback coordinates if geocoding fails
        const fallbackCoords: [number, number][] = [
          [19.0760, 72.8777], // Mumbai
          [18.5204, 73.8567], // Pune
        ];
        setRouteCoordinates(fallbackCoords);
      }

      setLoading(false);
    };

    initializeMap();
  }, [origin, destination]); // Only re-run when origin/destination changes

  // Separate effect for rendering markers and route when coordinates are available
  useEffect(() => {
    if (!map.current || routeCoordinates.length === 0) return;

    // Clear existing layers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.current?.removeLayer(layer);
      }
    });

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
    if (routeCoordinates[0]) {
      L.marker(routeCoordinates[0], { icon: originIcon })
        .addTo(map.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${origin}</h3>
            <p class="text-xs text-gray-600">Origin</p>
          </div>
        `);
    }

    // Add destination marker
    if (routeCoordinates[routeCoordinates.length - 1]) {
      L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: destinationIcon })
        .addTo(map.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${destination}</h3>
            <p class="text-xs text-gray-600">Destination</p>
          </div>
        `);
    }

    // Add waypoint markers (distribute them along the route)
    waypoints.forEach((waypoint, index) => {
      if (routeCoordinates.length > 2) {
        // Place waypoints evenly along the route
        const waypointIndex = Math.floor((routeCoordinates.length - 1) * (index + 1) / (waypoints.length + 1));
        const waypointCoords = routeCoordinates[waypointIndex];
        
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
      }
    });

    // Add route line
    if (routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map.current);

      // Fit the map to show the entire route
      map.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    }
  }, [routeCoordinates, waypoints, origin, destination]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <Card className="travel-card overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Route Map
          </h3>
          <Navigation className="h-5 w-5 text-primary" />
        </div>
        
        {loading && (
          <div className="w-full h-80 rounded-lg border border-border/50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading route...</span>
            </div>
          </div>
        )}
        
        <div 
          ref={mapContainer} 
          className={`w-full h-80 rounded-lg border border-border/50 ${loading ? 'hidden' : ''}`}
          style={{ minHeight: '320px' }}
        />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Interactive map powered by OpenStreetMap & OSRM</span>
          <span>Click markers for details</span>
        </div>
      </div>
    </Card>
  );
};

export default RouteMap;