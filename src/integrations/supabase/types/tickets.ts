export interface TicketsTable {
  Row: {
    id: string;
    event_id: string;
    owner_id: string;
    mint_address: string;
    created_at: string;
    used: boolean | null;
  };
  Insert: {
    id?: string;
    event_id: string;
    owner_id: string;
    mint_address: string;
    created_at?: string;
    used?: boolean | null;
  };
  Update: {
    id?: string;
    event_id?: string;
    owner_id?: string;
    mint_address?: string;
    created_at?: string;
    used?: boolean | null;
  };
  Relationships: [
    {
      foreignKeyName: "tickets_event_id_fkey";
      columns: ["event_id"];
      isOneToOne: false;
      referencedRelation: "events";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "tickets_owner_id_fkey";
      columns: ["owner_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}