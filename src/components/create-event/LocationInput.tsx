import { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
}

export const LocationInput = ({ value, onChange }: LocationInputProps) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      console.log('Google Maps script loaded successfully');
      setIsScriptLoaded(true);
    });

    script.addEventListener('error', () => {
      console.error('Error loading Google Maps script');
      setIsScriptError(true);
    });

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isScriptError) {
    return (
      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">Location</Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter event location"
          className="bg-input text-input-foreground placeholder-muted-foreground border-input"
        />
      </div>
    );
  }

  if (!isScriptLoaded) {
    return (
      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">Location</Label>
        <Input
          type="text"
          disabled
          placeholder="Loading location search..."
          className="bg-input text-input-foreground placeholder-muted-foreground border-input"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-foreground">Location</Label>
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        selectProps={{
          value: selectedOption,
          onChange: (option: any) => {
            setSelectedOption(option);
            onChange(option.label);
          },
          placeholder: "Enter event location",
          className: "text-foreground",
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: 'var(--input)',
              borderColor: 'var(--input)',
              minHeight: '40px',
            }),
            input: (provided) => ({
              ...provided,
              color: 'var(--foreground)',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? 'var(--accent)' : 'var(--background)',
              color: 'var(--foreground)',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'var(--foreground)',
            }),
          },
        }}
      />
    </div>
  );
};