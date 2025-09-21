import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Search } from "lucide-react";

interface DestinationSearchProps {
  onSearch: (destination: string) => void;
}

const DestinationSearch = ({ onSearch }: DestinationSearchProps) => {
  const [destination, setDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const handleSearch = () => {
    if (destination.trim()) {
      onSearch(destination);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        () => {
          setCurrentLocation("Location access denied");
        }
      );
    }
  };

  return (
    <Card className="travel-card w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Plan Your Journey
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter your destination to get routes, weather & alerts
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Current location"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="pl-10"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1.5"
              onClick={getCurrentLocation}
            >
              <Navigation className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Where do you want to go?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Button 
            variant="hero" 
            className="w-full" 
            onClick={handleSearch}
            disabled={!destination.trim()}
          >
            <Search className="mr-2 h-4 w-4" />
            Plan Route
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {["Mumbai", "Delhi", "Goa", "Bangalore"].map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => setDestination(city)}
              className="text-xs"
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DestinationSearch;