export interface ProfilesTable {
  Row: {
    avatar_url: string | null
    bio: string | null
    created_at: string
    email: string
    id: string
    username: string | null
    wallet_address: string | null
  }
  Insert: {
    avatar_url?: string | null
    bio?: string | null
    created_at?: string
    email: string
    id?: string
    username?: string | null
    wallet_address?: string | null
  }
  Update: {
    avatar_url?: string | null
    bio?: string | null
    created_at?: string
    email?: string
    id?: string
    username?: string | null
    wallet_address?: string | null
  }
  Relationships: []
}