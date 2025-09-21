import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, AlertTriangle, Construction, Lightbulb, Trash2, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplaintFormProps {
  onSubmit: (complaint: any) => void;
}

const ComplaintForm = ({ onSubmit }: ComplaintFormProps) => {
  const [complaint, setComplaint] = useState({
    type: "",
    description: "",
    location: "",
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const complaintTypes = [
    { value: "pothole", label: "Pothole", icon: Construction },
    { value: "lighting", label: "Street Lighting", icon: Lightbulb },
    { value: "garbage", label: "Garbage Collection", icon: Trash2 },
    { value: "waterlogging", label: "Waterlogging", icon: Droplets },
    { value: "road_blockage", label: "Road Blockage", icon: AlertTriangle },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComplaint({ ...complaint, photo: file });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setComplaint({
            ...complaint,
            location: `${position.coords.latitude}, ${position.coords.longitude}`
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!complaint.type || !complaint.description || !complaint.location) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...complaint,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: "submitted"
      });
      
      setComplaint({
        type: "",
        description: "",
        location: "",
        photo: null
      });
      
      setIsSubmitting(false);
      
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been registered successfully",
        variant: "default"
      });
    }, 2000);
  };

  const selectedType = complaintTypes.find(t => t.value === complaint.type);

  return (
    <Card className="travel-card w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Report Civic Issue
          </h2>
          <p className="text-muted-foreground text-sm">
            Help improve infrastructure by reporting problems
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Issue Type *
            </label>
            <Select value={complaint.type} onValueChange={(value) => setComplaint({ ...complaint, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {complaintTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter location or use current"
                value={complaint.location}
                onChange={(e) => setComplaint({ ...complaint, location: e.target.value })}
                className="pl-10"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1.5"
                onClick={getCurrentLocation}
              >
                GPS
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description *
            </label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={complaint.description}
              onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Photo (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    {complaint.photo ? "Change Photo" : "Add Photo"}
                  </span>
                </Button>
              </label>
              {complaint.photo && (
                <Badge className="complaint-badge">
                  Photo attached
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
            {selectedType && <selectedType.icon className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ComplaintForm;