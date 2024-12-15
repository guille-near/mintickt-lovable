export interface EventUpdatesTable {
  Row: {
    created_at: string
    event_id: string
    id: string
    message: string
    title: string
  }
  Insert: {
    created_at?: string
    event_id: string
    id?: string
    message: string
    title: string
  }
  Update: {
    created_at?: string
    event_id?: string
    id?: string
    message?: string
    title?: string
  }
  Relationships: [
    {
      foreignKeyName: "event_updates_event_id_fkey"
      columns: ["event_id"]
      isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
  ]
}