export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_updates: {
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
          },
        ]
      }
      events: {
        Row: {
          additional_info: Json | null
          age_restriction: string | null
          cancellation_policy: string | null
          candy_machine_address: string | null
          candy_machine_config: Json | null
          category: string | null
          collection_mint: string | null
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
          sugar_cache: Json | null
          sugar_config: Json | null
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
          candy_machine_address?: string | null
          candy_machine_config?: Json | null
          category?: string | null
          collection_mint?: string | null
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
          sugar_cache?: Json | null
          sugar_config?: Json | null
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
          candy_machine_address?: string | null
          candy_machine_config?: Json | null
          category?: string | null
          collection_mint?: string | null
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
          sugar_cache?: Json | null
          sugar_config?: Json | null
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
          },
        ]
      }
      profiles: {
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
      tickets: {
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
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
