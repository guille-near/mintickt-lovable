export interface ProfileFormData {
  username: string | null;
  bio: string | null;
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

export interface Event {
  id: string;
  title: string;
  date: string;
}

export interface ProfileData extends Omit<ProfileFormData, 'social_media'> {
  social_media: ProfileFormData['social_media'] | null;
  pastEvents?: Event[];
  upcomingEvents?: Event[];
}

export const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Technology",
  "Art",
  "Food",
  "Travel"
];