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

export interface ProfileData {
  id: string;
  username: string | null;
  bio: string | null;
  email: string;
  wallet_address: string | null;
  avatar_url: string | null;
  created_at: string;
  social_media: {
    x: string | null;
    linkedin: string | null;
    instagram: string | null;
    threads: string | null;
  };
  interests: string[] | null;
  show_upcoming_events: boolean | null;
  show_past_events: boolean | null;
  pastEvents?: Event[];
  upcomingEvents?: Event[];
  tickets?: Array<{
    event_id: string;
    events: {
      id: string;
      title: string;
      date: string;
    } | null;
  }>;
}

export const INTEREST_OPTIONS = [
  "Music",
  "Sports",
  "Technology",
  "Art",
  "Food",
  "Travel"
];