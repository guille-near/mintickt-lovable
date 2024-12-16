export interface ProfilesTable {
  Row: {
    avatar_url: string | null
    bio: string | null
    created_at: string
    email: string
    first_name: string | null
    id: string
    interests: string[] | null
    last_name: string | null
    past_events: Json[] | null
    show_past_events: boolean | null
    show_upcoming_events: boolean | null
    social_media: Json | null
    upcoming_events: Json[] | null
    username: string | null
    wallet_address: string | null
  }
  Insert: {
    avatar_url?: string | null
    bio?: string | null
    created_at?: string
    email: string
    first_name?: string | null
    id?: string
    interests?: string[] | null
    last_name?: string | null
    past_events?: Json[] | null
    show_past_events?: boolean | null
    show_upcoming_events?: boolean | null
    social_media?: Json | null
    upcoming_events?: Json[] | null
    username?: string | null
    wallet_address?: string | null
  }
  Update: {
    avatar_url?: string | null
    bio?: string | null
    created_at?: string
    email?: string
    first_name?: string | null
    id?: string
    interests?: string[] | null
    last_name?: string | null
    past_events?: Json[] | null
    show_past_events?: boolean | null
    show_upcoming_events?: boolean | null
    social_media?: Json | null
    upcoming_events?: Json[] | null
    username?: string | null
    wallet_address?: string | null
  }
  Relationships: []
}