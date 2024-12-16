export interface EventUpdatesTable {
  Row: {
    id: string;
    event_id: string;
    title: string;
    message: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    event_id: string;
    title: string;
    message: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    event_id?: string;
    title?: string;
    message?: string;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "event_updates_event_id_fkey";
      columns: ["event_id"];
      isOneToOne: false;
      referencedRelation: "events";
      referencedColumns: ["id"];
    }
  ];
}