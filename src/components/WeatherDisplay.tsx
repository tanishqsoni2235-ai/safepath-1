import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, MapPin, Thermometer } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy";
  humidity: number;
  windSpeed: number;
}

interface WeatherDisplayProps {
  weatherData: WeatherData[];
}

const WeatherDisplay = ({ weatherData }: WeatherDisplayProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-warning" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-accent" />;
      default:
        return <Sun className="h-6 w-6 text-warning" />;
    }
  };

  if (!weatherData || weatherData.length === 0) {
    return (
      <Card className="travel-card">
        <div className="text-center py-8">
          <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter a destination to view weather along your route
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Weather Along Your Route
      </h3>
      
      {weatherData.map((weather, index) => (
        <Card key={index} className="travel-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {weather.location}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge className="weather-badge">
                    <Thermometer className="h-3 w-3 mr-1" />
                    {weather.temperature}°C
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {weather.humidity}% humidity
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {weather.windSpeed} km/h wind
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {weather.temperature}°
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {weather.condition}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WeatherDisplay;