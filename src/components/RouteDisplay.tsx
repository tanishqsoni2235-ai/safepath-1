import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, AlertTriangle, Clock, MapPin, Car } from "lucide-react";

interface RouteAlert {
  type: "pothole" | "construction" | "weather" | "traffic";
  message: string;
  severity: "low" | "medium" | "high";
  location: string;
}

interface RouteInfo {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  alerts: RouteAlert[];
  waypoints: string[];
}

interface RouteDisplayProps {
  routeInfo: RouteInfo | null;
  onStartNavigation: () => void;
}

const RouteDisplay = ({ routeInfo, onStartNavigation }: RouteDisplayProps) => {
  if (!routeInfo) {
    return (
      <Card className="travel-card">
        <div className="text-center py-8">
          <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Plan a route to see navigation details
          </p>
        </div>
      </Card>
    );
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "pothole":
      case "construction":
        return AlertTriangle;
      case "weather":
        return AlertTriangle;
      case "traffic":
        return Car;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="travel-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Route Overview
            </h3>
            <Button variant="hero" onClick={onStartNavigation}>
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">From:</span>
              <span className="font-medium text-foreground">{routeInfo.origin}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">To:</span>
              <span className="font-medium text-foreground">{routeInfo.destination}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Badge className="route-badge">
                {routeInfo.distance}
              </Badge>
              <Badge className="route-badge">
                <Clock className="h-3 w-3 mr-1" />
                {routeInfo.duration}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {routeInfo.alerts && routeInfo.alerts.length > 0 && (
        <Card className="travel-card">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
              Route Alerts ({routeInfo.alerts.length})
            </h4>
            
            <div className="space-y-2">
              {routeInfo.alerts.map((alert, index) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <AlertIcon className="h-4 w-4 mt-0.5 text-warning" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {alert.message}
                        </span>
                        <Badge
                          variant={getAlertColor(alert.severity) as any}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Near {alert.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {routeInfo.waypoints && routeInfo.waypoints.length > 0 && (
        <Card className="travel-card">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">
              Waypoints
            </h4>
            
            <div className="space-y-2">
              {routeInfo.waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-sm text-foreground">{waypoint}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RouteDisplay;