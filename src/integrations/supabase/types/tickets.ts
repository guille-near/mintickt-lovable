export interface TicketsTable {
  Row: {
    created_at: string
    event_id: string
    id: string
    mint_address: string
    owner_id: string
    used: boolean | null
  }
  Insert: {
    created_at?: string
    event_id: string
    id?: string
    mint_address: string
    owner_id: string
    used?: boolean | null
  }
  Update: {
    created_at?: string
    event_id?: string
    id?: string
    mint_address?: string
    owner_id?: string
    used?: boolean | null
  }
  Relationships: [
    {
      foreignKeyName: "tickets_event_id_fkey"
      columns: ["event_id"]
      isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "tickets_owner_id_fkey"
      columns: ["owner_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}