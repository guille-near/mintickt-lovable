import { Json } from './base';

export interface EventsTable {
  Row: {
    id: string
    title: string
    description: string | null
    date: string
    location: string | null
    image_url: string | null
    price: number | null
    total_tickets: number
    remaining_tickets: number
    creator_id: string
    created_at: string
    is_free: boolean
    organizer_name: string
    category: string | null
    tags: string[] | null
    website_url: string | null
    virtual_event_url: string | null
    max_tickets_per_user: number | null
    event_type: string | null
    status: string | null
    visibility: string | null
    registration_deadline: string | null
    cancellation_policy: string | null
    age_restriction: string | null
    additional_info: Json | null
    nft_symbol: string | null
    nft_collection_name: string | null
    nft_metadata_uri: string | null
    royalties_percentage: number | null
    nft_description: string | null
    nft_attributes: Json | null
  }
  Insert: {
    id?: string
    title: string
    description?: string | null
    date: string
    location?: string | null
    image_url?: string | null
    price?: number | null
    total_tickets: number
    remaining_tickets: number
    creator_id: string
    created_at?: string
    is_free?: boolean
    organizer_name?: string
    category?: string | null
    tags?: string[] | null
    website_url?: string | null
    virtual_event_url?: string | null
    max_tickets_per_user?: number | null
    event_type?: string | null
    status?: string | null
    visibility?: string | null
    registration_deadline?: string | null
    cancellation_policy?: string | null
    age_restriction?: string | null
    additional_info?: Json | null
    nft_symbol?: string | null
    nft_collection_name?: string | null
    nft_metadata_uri?: string | null
    royalties_percentage?: number | null
    nft_description?: string | null
    nft_attributes?: Json | null
  }
  Update: {
    id?: string
    title?: string
    description?: string | null
    date?: string
    location?: string | null
    image_url?: string | null
    price?: number | null
    total_tickets?: number
    remaining_tickets?: number
    creator_id?: string
    created_at?: string
    is_free?: boolean
    organizer_name?: string
    category?: string | null
    tags?: string[] | null
    website_url?: string | null
    virtual_event_url?: string | null
    max_tickets_per_user?: number | null
    event_type?: string | null
    status?: string | null
    visibility?: string | null
    registration_deadline?: string | null
    cancellation_policy?: string | null
    age_restriction?: string | null
    additional_info?: Json | null
    nft_symbol?: string | null
    nft_collection_name?: string | null
    nft_metadata_uri?: string | null
    royalties_percentage?: number | null
    nft_description?: string | null
    nft_attributes?: Json | null
  }
  Relationships: [
    {
      foreignKeyName: "events_creator_id_fkey"
      columns: ["creator_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}