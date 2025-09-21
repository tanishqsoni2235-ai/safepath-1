import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  onLanguageChange: (language: "en" | "hi") => void;
}

const LanguageToggle = ({ onLanguageChange }: LanguageToggleProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "hi" : "en";
    setCurrentLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50"
    >
      <Globe className="h-4 w-4 mr-2" />
      {currentLanguage === "en" ? "हिंदी" : "English"}
    </Button>
  );
};

export default LanguageToggle;