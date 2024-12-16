import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Linkedin, Instagram, AtSign, EyeOff } from "lucide-react";
import { ProfileData, INTEREST_OPTIONS } from "./types";
import { format } from "date-fns";
import { WalletButton } from "../WalletButton";

interface ProfileFormProps {
  profile: ProfileData;
  onProfileChange: (field: keyof ProfileData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  pastEvents?: Array<{ id: string; title: string; date: string }>;
  upcomingEvents?: Array<{ id: string; title: string; date: string }>;
}

export function ProfileForm({ 
  profile, 
  onProfileChange, 
  onSubmit, 
  isLoading,
  pastEvents = [],
  upcomingEvents = []
}: ProfileFormProps) {
  const handleSocialMediaChange = (platform: keyof typeof profile.social_media, value: string) => {
    onProfileChange('social_media', {
      ...profile.social_media,
      [platform]: value
    });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = profile.interests.includes(interest)
      ? profile.interests.filter(i => i !== interest)
      : [...profile.interests, interest];
    onProfileChange('interests', newInterests);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <div className="space-y-4">
        <Label>Wallet Address</Label>
        <div className="flex items-center space-x-2">
          <Input
            value={profile.wallet_address || ''}
            readOnly
            placeholder="Connect your wallet to see address"
            className="flex-1"
          />
          <WalletButton />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Social Media URLs</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5" />
            <Input
              value={profile.social_media?.x || ''}
              onChange={(e) => handleSocialMediaChange("x", e.target.value)}
              placeholder="X (Twitter) URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5" />
            <Input
              value={profile.social_media?.linkedin || ''}
              onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-5 h-5" />
            <Input
              value={profile.social_media?.instagram || ''}
              onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
              placeholder="Instagram URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <AtSign className="w-5 h-5" />
            <Input
              value={profile.social_media?.threads || ''}
              onChange={(e) => handleSocialMediaChange("threads", e.target.value)}
              placeholder="Threads URL"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us about yourself"
          value={profile.bio || ''}
          onChange={(e) => onProfileChange('bio', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <Badge
              key={interest}
              variant={profile.interests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Upcoming Events</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-upcoming-events"
                checked={profile.show_upcoming_events}
                onCheckedChange={(checked) => onProfileChange('show_upcoming_events', checked)}
              />
              <EyeOff className={`w-4 h-4 ${profile.show_upcoming_events ? 'text-gray-400' : 'text-primary'}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastEvents && pastEvents.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Past Events</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-past-events"
                checked={profile.show_past_events}
                onCheckedChange={(checked) => onProfileChange('show_past_events', checked)}
              />
              <EyeOff className={`w-4 h-4 ${profile.show_past_events ? 'text-gray-400' : 'text-primary'}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}