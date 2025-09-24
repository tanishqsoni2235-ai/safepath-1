import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation, MapPin, AlertTriangle, Cloud, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import DestinationSearch from "@/components/DestinationSearch";
import RouteDisplay from "@/components/RouteDisplay";
import WeatherDisplay from "@/components/WeatherDisplay";
import ComplaintForm from "@/components/ComplaintForm";
import LanguageToggle from "@/components/LanguageToggle";

import heroImage from "@/assets/hero-travel-india.jpg";

const Index = () => {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const [weatherData, setWeatherData] = useState([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async (location: string) => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.error("OpenWeather API key is missing from environment variables.");
        return null;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (!response.ok || !data || !data.main) {
        console.error("API error:", data);
        toast({
          title: "Weather Data Not Found",
          description: `API returned an error for ${location}: ${data.message || 'Unknown error'}`,
          variant: "destructive"
        });
        return null;
      }
      
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main.toLowerCase(),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
      };

    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      toast({
        title: "Weather Fetch Error",
        description: `Failed to connect to weather service for ${location}.`,
        variant: "destructive"
      });
      return null;
    }
  };

  const handleDestinationSearch = async (destination: string) => {
    // Simulate API call to get route info
    const simulatedRouteInfo = {
      origin: "Bhopal, India",
      destination: "Indore, India",
      distance: "194 km",
      duration: "3h 40m",
      alerts: [
        {
          type: "pothole" as const,
          message: "Multiple potholes reported",
          severity: "medium" as const,
          location: `${destination} City Bypass`,
        },
        {
          type: "construction" as const,
          message: "Road construction ongoing",
          severity: "high" as const,
          location: "National Highway 48",
        },
      ],
      waypoints: [
        {
          name: "Sehore",
          weather: {
            condition: "sunny" as const,
            temperature: 27
          },
          roadCondition: {
            status: "good" as const,
            alerts: []
          }
        },
        {
          name: "Ashta",
          weather: {
            condition: "cloudy" as const,
            temperature: 23
          },
          roadCondition: {
            status: "fair" as const,
            alerts: ["Minor road repairs ongoing"]
          }
        },
        {
          name: "Dewas",
          weather: {
            condition: "rainy" as const,
            temperature: 21
          },
          roadCondition: {
            status: "poor" as const,
            alerts: ["Waterlogging reported", "Reduced visibility due to fog"]
          }
        }
      ]
    };
    setCurrentRoute(simulatedRouteInfo);
    toast({
      title: "Route Planned",
      description: `Route to ${destination} has been calculated`,
    });

    // Fetch weather for both locations simultaneously
    setIsWeatherLoading(true);
    const originCity = "Indore, India";
    const [originWeather, destinationWeather] = await Promise.all([
      fetchWeather(originCity),
      fetchWeather(destination),
    ]);

    const allWeatherData = [];
    if (originWeather) {
      allWeatherData.push(originWeather);
    }
    if (destinationWeather) {
      allWeatherData.push(destinationWeather);
    }
    setWeatherData(allWeatherData);
    setIsWeatherLoading(false);
  };

  const handleComplaintSubmit = (complaint: any) => {
    console.log("Complaint submitted:", complaint);
    toast({
      title: "Complaint Registered",
      description: "Your civic complaint has been submitted to local authorities",
    });
  };

  const handleStartNavigation = () => {
    // Logic for starting navigation, which could use map APIs.
    toast({
      title: "Navigation Started",
      description: "GPS navigation has been initiated",
    });
  };

  const texts = {
    en: {
      title: "SafePath",
      subtitle: "Smart Travel Companion for India",
      description: "Get real-time routes, weather updates, road alerts, and report civic issues - all in one app",
      tabRoute: "Route",
      tabWeather: "Weather",
      tabComplaint: "Report Issue",
      heroAlt: "Indian travel destinations"
    },
    hi: {
      title: "सुरक्षित पथ",
      subtitle: "भारत के लिए स्मार्ट यात्रा साथी",
      description: "वास्तविक समय के मार्ग, मौसम अपडेट, सड़क अलर्ट प्राप्त करें और नागरिक समस्याओं की रिपोर्ट करें",
      tabRoute: "मार्ग",
      tabWeather: "मौसम",
      tabComplaint: "समस्या रिपोर्ट करें",
      heroAlt: "भारतीय यात्रा गंतव्य"
    }
  };

  const t = texts[currentLanguage];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Toggle */}
      <LanguageToggle onLanguageChange={setCurrentLanguage} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="heading-responsive font-bold text-white mb-4">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-2">
              {t.subtitle}
            </p>
            <p className="text-responsive text-white/80 max-w-2xl mx-auto">
              {t.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Navigation className="h-4 w-4 mr-2" />
                Real-time Routes
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Cloud className="h-4 w-4 mr-2" />
                Live Weather
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Road Alerts
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Civic Reports
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="route" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="route" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{t.tabRoute}</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center space-x-2">
                <Cloud className="h-4 w-4" />
                <span>{t.tabWeather}</span>
              </TabsTrigger>
              <TabsTrigger value="complaint" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>{t.tabComplaint}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="route" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DestinationSearch onSearch={handleDestinationSearch} />
                <RouteDisplay 
                  routeInfo={currentRoute} 
                  onStartNavigation={handleStartNavigation}
                />
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <WeatherDisplay weatherData={weatherData} isLoading={isWeatherLoading} />
              </div>
            </TabsContent>

            <TabsContent value="complaint" className="space-y-6">
              <div className="max-w-md mx-auto">
                <ComplaintForm onSubmit={handleComplaintSubmit} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Index;