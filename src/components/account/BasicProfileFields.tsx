import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileFormData } from "./types";

interface BasicProfileFieldsProps {
  profile: ProfileFormData;
  onProfileChange: (field: keyof ProfileFormData, value: any) => void;
}

export function BasicProfileFields({ profile, onProfileChange }: BasicProfileFieldsProps) {
  return (
    <>
      <div className="space-y-4">
        <Label>Email</Label>
        <Input
          type="email"
          value={profile.email}
          onChange={(e) => onProfileChange('email', e.target.value)}
          placeholder="your@email.com"
          disabled
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={profile.first_name || ''}
            onChange={(e) => onProfileChange('first_name', e.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={profile.last_name || ''}
            onChange={(e) => onProfileChange('last_name', e.target.value)}
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
          <Input
            id="username"
            value={profile.username || ''}
            onChange={(e) => onProfileChange('username', e.target.value)}
            placeholder="username"
            className="w-full pl-7"
          />
        </div>
      </div>
    </>
  );
}