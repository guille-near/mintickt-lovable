import { Json } from "@/integrations/supabase/types";

export interface SocialMedia {
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  threads: string | null;
}

export interface ProfileData {
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
}

export type UpdateProfileData = Partial<Omit<ProfileData, 'id' | 'created_at' | 'email'>>;

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