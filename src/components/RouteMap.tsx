import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, AlertTriangle, Cloud, Sun, CloudRain } from 'lucide-react';

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
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoadConditionColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="travel-card overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Route Overview
          </h3>
          <Navigation className="h-5 w-5 text-primary" />
        </div>
        
        <div className="relative">
          {/* Visual Route Map */}
          <div className="bg-muted/30 rounded-lg p-6 min-h-[280px] relative overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M 60 60 Q 120 100 180 120 Q 240 140 340 180"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            </svg>

            {/* Origin Point */}
            <div className="absolute top-8 left-8 flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="mt-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border">
                <p className="text-sm font-medium text-foreground">{origin}</p>
                <p className="text-xs text-muted-foreground">Start</p>
              </div>
            </div>

            {/* Waypoints */}
            {waypoints.map((waypoint, index) => (
              <div
                key={index}
                className={`absolute flex flex-col items-center ${
                  index === 0 ? 'top-16 left-32' : 
                  index === 1 ? 'top-24 left-48' : 
                  'top-32 left-56'
                }`}
              >
                <div className="bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg relative">
                  <Navigation className="h-3 w-3" />
                  {waypoint.roadCondition.alerts.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-1">
                      <AlertTriangle className="h-2 w-2 text-destructive-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border max-w-32">
                  <p className="text-xs font-medium text-foreground truncate">{waypoint.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getWeatherIcon(waypoint.weather.condition)}
                    <span className="text-xs text-muted-foreground">
                      {waypoint.weather.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getRoadConditionColor(waypoint.roadCondition.status)}`} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {waypoint.roadCondition.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Destination Point */}
            <div className="absolute top-32 right-8 flex flex-col items-center">
              <div className="bg-accent text-accent-foreground rounded-full p-2 shadow-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="mt-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border">
                <p className="text-sm font-medium text-foreground">{destination}</p>
                <p className="text-xs text-muted-foreground">Destination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-sm font-medium">148 km</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">3h 20m</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Alerts</p>
            <div className="flex justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RouteMap;