import { Json } from './base';

export interface EventsTable {
  Row: {
    additional_info: Json | null
    age_restriction: string | null
    cancellation_policy: string | null
    category: string | null
    created_at: string
    creator_id: string
    date: string
    description: string | null
    event_type: string | null
    id: string
    image_url: string | null
    is_free: boolean
    location: string | null
    max_tickets_per_user: number | null
    nft_attributes: Json | null
    nft_collection_name: string | null
    nft_description: string | null
    nft_metadata_uri: string | null
    nft_symbol: string | null
    organizer_name: string
    price: number | null
    registration_deadline: string | null
    remaining_tickets: number
    royalties_percentage: number | null
    status: string | null
    tags: string[] | null
    title: string
    total_tickets: number
    virtual_event_url: string | null
    visibility: string | null
    website_url: string | null
  }
  Insert: {
    additional_info?: Json | null
    age_restriction?: string | null
    cancellation_policy?: string | null
    category?: string | null
    created_at?: string
    creator_id: string
    date: string
    description?: string | null
    event_type?: string | null
    id?: string
    image_url?: string | null
    is_free?: boolean
    location?: string | null
    max_tickets_per_user?: number | null
    nft_attributes?: Json | null
    nft_collection_name?: string | null
    nft_description?: string | null
    nft_metadata_uri?: string | null
    nft_symbol?: string | null
    organizer_name?: string
    price?: number | null
    registration_deadline?: string | null
    remaining_tickets: number
    royalties_percentage?: number | null
    status?: string | null
    tags?: string[] | null
    title: string
    total_tickets: number
    virtual_event_url?: string | null
    visibility?: string | null
    website_url?: string | null
  }
  Update: {
    additional_info?: Json | null
    age_restriction?: string | null
    cancellation_policy?: string | null
    category?: string | null
    created_at?: string
    creator_id?: string
    date?: string
    description?: string | null
    event_type?: string | null
    id?: string
    image_url?: string | null
    is_free?: boolean
    location?: string | null
    max_tickets_per_user?: number | null
    nft_attributes?: Json | null
    nft_collection_name?: string | null
    nft_description?: string | null
    nft_metadata_uri?: string | null
    nft_symbol?: string | null
    organizer_name?: string
    price?: number | null
    registration_deadline?: string | null
    remaining_tickets?: number
    royalties_percentage?: number | null
    status?: string | null
    tags?: string[] | null
    title?: string
    total_tickets?: number
    virtual_event_url?: string | null
    visibility?: string | null
    website_url?: string | null
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