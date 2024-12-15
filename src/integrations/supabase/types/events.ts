export interface EventsTable {
  Row: {
    created_at: string
    creator_id: string
    date: string
    description: string | null
    id: string
    image_url: string | null
    is_free: boolean
    location: string | null
    organizer_name: string
    price: number | null
    remaining_tickets: number
    title: string
    total_tickets: number
  }
  Insert: {
    created_at?: string
    creator_id: string
    date: string
    description?: string | null
    id?: string
    image_url?: string | null
    is_free?: boolean
    location?: string | null
    organizer_name?: string
    price?: number | null
    remaining_tickets: number
    title: string
    total_tickets: number
  }
  Update: {
    created_at?: string
    creator_id?: string
    date?: string
    description?: string | null
    id?: string
    image_url?: string | null
    is_free?: boolean
    location?: string | null
    organizer_name?: string
    price?: number | null
    remaining_tickets?: number
    title?: string
    total_tickets?: number
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