import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormData } from "./types";

interface ProfileFormProps {
  profile: ProfileFormData;
  onProfileChange: (field: keyof ProfileFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onProfileChange, onSubmit, isLoading }: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => onProfileChange("email", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={profile.username}
            onChange={(e) => onProfileChange("username", e.target.value)}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => onProfileChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            className="h-32"
          />
        </div>

        <div>
          <Label htmlFor="wallet_address">Wallet Address</Label>
          <Input
            id="wallet_address"
            type="text"
            value={profile.wallet_address || ''}
            readOnly
            className="bg-muted"
            placeholder="Connect your wallet to see your address"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}