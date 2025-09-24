import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

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
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!map || !routesLibrary) return;
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [map, routesLibrary]);

  useEffect(() => {
    if (!directionsRenderer || !routesLibrary || !origin || !destination) {
      return;
    }

    const directionsService = new routesLibrary.DirectionsService();

    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: routesLibrary.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        console.error('Directions request failed:', status);
      }
    });

  }, [origin, destination, directionsRenderer, routesLibrary]);

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
          className="relative w-full h-80 rounded-lg border border-border/50"
          style={{ minHeight: '320px' }}
        >
          <Map
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            defaultZoom={5}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Interactive map powered by Google Maps</span>
          <span>Click markers for details</span>
        </div>
      </div>
    </Card>
  );
};

export default RouteMap;