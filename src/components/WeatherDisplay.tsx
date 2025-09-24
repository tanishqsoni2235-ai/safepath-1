import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, MapPin, Thermometer } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherDisplayProps {
  weatherData: WeatherData[];
  isLoading: boolean;
}

const WeatherDisplay = ({ weatherData, isLoading }: WeatherDisplayProps) => {
  const getWeatherIcon = (weatherCode: number) => {
    // Mapping Tomorrow.io weather codes to Lucide icons
    // Weather codes reference: https://docs.tomorrow.io/reference/data-layers-weather-codes
    switch (true) {
      case weatherCode >= 1000 && weatherCode <= 1100: // Clear, Mostly Clear
        return <Sun className="h-6 w-6 text-warning" />;
      case weatherCode >= 1101 && weatherCode <= 1102: // Partly Cloudy, Mostly Cloudy
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case weatherCode >= 4000 && weatherCode <= 4215: // Drizzle, Rain, Heavy Rain
      case weatherCode >= 5000 && weatherCode <= 5101: // Snow, Heavy Snow
        return <CloudRain className="h-6 w-6 text-accent" />;
      default:
        return <Sun className="h-6 w-6 text-warning" />;
    }
  };

  const getWeatherConditionText = (weatherCode: number) => {
    switch (true) {
      case weatherCode === 1000:
        return "Clear";
      case weatherCode === 1100:
        return "Mostly Clear";
      case weatherCode === 1101:
        return "Partly Cloudy";
      case weatherCode === 1102:
        return "Mostly Cloudy";
      case weatherCode === 1001:
        return "Cloudy";
      case weatherCode >= 4000 && weatherCode <= 4215:
        return "Rain";
      case weatherCode >= 5000 && weatherCode <= 5101:
        return "Snow";
      case weatherCode === 2000 || weatherCode === 2100:
        return "Fog";
      default:
        return "N/A";
    }
  }

  if (isLoading) {
    return (
      <Card className="travel-card">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Fetching weather data...
          </p>
        </div>
      </Card>
    );
  }

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
                {getWeatherConditionText(weather.condition)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WeatherDisplay;