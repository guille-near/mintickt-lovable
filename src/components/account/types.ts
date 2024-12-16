export interface ProfileFormData {
  username: string;
  bio: string;
  email: string;
  wallet_address: string | null;
  social_media: {
    x: string | null;
    linkedin: string | null;
    instagram: string | null;
    threads: string | null;
  };
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
}

export const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Technology",
  "Art",
  "Food",
  "Travel"
];