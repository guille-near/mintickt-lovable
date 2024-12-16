export interface ProfileFormData {
  username: string | null;
  bio: string | null;
  email: string;
  wallet_address: string | null;
  social_media: SocialMediaLinks;
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
}

export interface SocialMediaLinks {
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  threads: string | null;
}

export interface Event {
  id: string;
  title: string;
  date: string;
}

export interface ProfileData {
  id: string;
  username: string | null;
  bio: string | null;
  email: string;
  wallet_address: string | null;
  avatar_url: string | null;
  created_at: string;
  social_media: SocialMediaLinks;
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
  past_events: Event[];
  upcoming_events: Event[];
}

export const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Technology",
  "Art",
  "Food",
  "Travel"
];