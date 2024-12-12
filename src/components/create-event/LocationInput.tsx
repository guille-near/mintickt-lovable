import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Label } from "@/components/ui/label";

interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
}

export const LocationInput = ({ value, onChange }: LocationInputProps) => {
  const [selectedOption, setSelectedOption] = useState(null);

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