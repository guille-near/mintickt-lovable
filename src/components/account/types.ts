export interface Event {
  id: string;
  title: string;
  date: string;
}

export interface SocialMediaLinks {
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  threads: string | null;
}

export interface ProfileData {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  wallet_address: string | null;
  social_media: SocialMediaLinks;
  interests: string[];
  show_upcoming_events: boolean;
  show_past_events: boolean;
  upcoming_events: Event[];
  past_events: Event[];
}