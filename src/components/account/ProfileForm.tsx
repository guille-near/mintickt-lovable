import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Linkedin, Instagram, AtSign } from "lucide-react";
import { ProfileData, INTEREST_OPTIONS } from "./types";
import { WalletButton } from "../WalletButton";

interface ProfileFormProps {
  profile: ProfileData;
  onSubmit: (data: Partial<ProfileData>) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      social_media: profile.social_media || {
        x: null,
        linkedin: null,
        instagram: null,
        threads: null,
      },
      interests: profile.interests || [],
      show_upcoming_events: profile.show_upcoming_events,
      show_past_events: profile.show_past_events,
    },
  });

  const interests = watch("interests");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <Label>Username</Label>
        <div className="relative">
          <span className="absolute left-2 top-2 text-gray-500">@</span>
          <Input
            {...register("username")}
            placeholder="username"
            className="w-full pl-7"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Bio</Label>
        <Textarea
          {...register("bio")}
          placeholder="Tell us about yourself"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <Label>Social Media</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AtSign className="w-5 h-5" />
            <Input
              {...register("social_media.x")}
              placeholder="X (Twitter) profile URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5" />
            <Input
              {...register("social_media.linkedin")}
              placeholder="LinkedIn profile URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-5 h-5" />
            <Input
              {...register("social_media.instagram")}
              placeholder="Instagram profile URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <AtSign className="w-5 h-5" />
            <Input
              {...register("social_media.threads")}
              placeholder="Threads profile URL"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = interests.includes(interest);
            return (
              <Badge
                key={interest}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (isSelected) {
                    setValue(
                      "interests",
                      interests.filter((i) => i !== interest)
                    );
                  } else {
                    setValue("interests", [...interests, interest]);
                  }
                }}
              >
                {interest}
                {isSelected && (
                  <X className="w-3 h-3 ml-1" onClick={() => {}} />
                )}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Event Display Settings</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              {...register("show_upcoming_events")}
              className="w-4 h-4"
            />
            <span>Show upcoming events on my profile</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              {...register("show_past_events")}
              className="w-4 h-4"
            />
            <span>Show past events on my profile</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Wallet Connection</Label>
        <WalletButton />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}