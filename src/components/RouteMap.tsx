import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Save } from 'lucide-react';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSaved, setIsTokenSaved] = useState(false);

  // Check for saved token in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setIsTokenSaved(true);
    }
  }, []);

  const saveToken = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSaved(true);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !isTokenSaved) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [72.8777, 19.0760], // Mumbai coordinates as default
      zoom: 8,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Sample coordinates for demonstration (in real app, these would come from geocoding)
    const routeCoordinates: [number, number][] = [
      [72.8777, 19.0760], // Mumbai
      [73.2619, 18.5204], // Pune
    ];

    // Add markers for origin and destination
    new mapboxgl.Marker({ color: '#FF6B35' })
      .setLngLat(routeCoordinates[0])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${origin}</h3><p>Origin</p>`))
      .addTo(map.current);

    new mapboxgl.Marker({ color: '#4ECDC4' })
      .setLngLat(routeCoordinates[1])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${destination}</h3><p>Destination</p>`))
      .addTo(map.current);

    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      // Sample coordinates for waypoints (in real app, these would come from geocoding)
      const waypointCoords: [number, number] = [
        72.8777 + (index + 1) * 0.1, 
        19.0760 - (index + 1) * 0.1
      ];
      
      new mapboxgl.Marker({ color: '#95A5A6' })
        .setLngLat(waypointCoords)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3>${waypoint.name}</h3>
          <p>${waypoint.weather.temperature}°C, ${waypoint.weather.condition}</p>
          <p>Road: ${waypoint.roadCondition.status}</p>
        `))
        .addTo(map.current);
    });

    // Add route line
    map.current.on('load', () => {
      if (!map.current) return;
      
      map.current.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': routeCoordinates
          }
        }
      });

      map.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#FF6B35',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Fit the map to show the entire route
      const bounds = new mapboxgl.LngLatBounds();
      routeCoordinates.forEach(coord => bounds.extend(coord as [number, number]));
      map.current.fitBounds(bounds, { padding: 50 });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, isTokenSaved, origin, destination, waypoints]);

  if (!isTokenSaved) {
    return (
      <Card className="travel-card">
        <div className="space-y-4">
          <div className="text-center py-4">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Enable Route Map
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to view the interactive route map
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGd0..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
            <Button 
              onClick={saveToken} 
              disabled={!mapboxToken}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Token & Show Map
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Note: Your token will be stored locally in your browser</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="travel-card overflow-hidden">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Route Map
        </h3>
        <div 
          ref={mapContainer} 
          className="w-full h-64 rounded-lg border border-border/50"
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Interactive map with route and waypoints</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              localStorage.removeItem('mapbox_token');
              setIsTokenSaved(false);
              setMapboxToken('');
            }}
          >
            Change Token
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RouteMap;