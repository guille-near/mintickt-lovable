import { Json } from "@/integrations/supabase/types";

export interface SocialMedia {
  [key: string]: string | null;
}

export type ProfileData = {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  wallet_address: string | null;
  created_at: string;
  social_media: SocialMedia;
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
  past_events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
  upcoming_events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
};

export type UpdateProfileData = {
  username?: string | null;
  bio?: string | null;
  wallet_address?: string | null;
  social_media?: { [key: string]: string | null };
  interests?: string[];
  show_upcoming_events?: boolean;
  show_past_events?: boolean;
};

export const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Technology",
  "Art",
  "Food",
  "Fashion",
  "Gaming",
  "Education",
  "Business",
  "Entertainment"
];