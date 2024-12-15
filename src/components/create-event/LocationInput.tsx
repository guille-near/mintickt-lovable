import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  value: string;
  onChange: (location: string) => void;
}

export const LocationInput = ({ value, onChange }: LocationInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-foreground">Location</Label>
      <Input
        id="location"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter event location"
        className="bg-input text-input-foreground placeholder-muted-foreground border-input"
      />
    </div>
  );
};