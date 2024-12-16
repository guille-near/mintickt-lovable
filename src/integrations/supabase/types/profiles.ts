import { Json } from './base';

export interface ProfilesTable {
  Row: {
    id: string
    wallet_address: string | null
    created_at: string
    email: string
    username: string | null
    avatar_url: string | null
    bio: string | null
    social_media: Json | null
    interests: string[] | null
    show_upcoming_events: boolean | null
    show_past_events: boolean | null
    past_events: Json[] | null
    upcoming_events: Json[] | null
    first_name: string | null
    last_name: string | null
  }
  Insert: {
    id?: string
    wallet_address?: string | null
    created_at?: string
    email: string
    username?: string | null
    avatar_url?: string | null
    bio?: string | null
    social_media?: Json | null
    interests?: string[] | null
    show_upcoming_events?: boolean | null
    show_past_events?: boolean | null
    past_events?: Json[] | null
    upcoming_events?: Json[] | null
    first_name?: string | null
    last_name?: string | null
  }
  Update: {
    id?: string
    wallet_address?: string | null
    created_at?: string
    email?: string
    username?: string | null
    avatar_url?: string | null
    bio?: string | null
    social_media?: Json | null
    interests?: string[] | null
    show_upcoming_events?: boolean | null
    show_past_events?: boolean | null
    past_events?: Json[] | null
    upcoming_events?: Json[] | null
    first_name?: string | null
    last_name?: string | null
  }
  Relationships: []
}