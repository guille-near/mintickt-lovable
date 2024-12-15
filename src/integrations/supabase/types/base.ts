import { EventUpdatesTable } from './event-updates';
import { EventsTable } from './events';
import { ProfilesTable } from './profiles';
import { TicketsTable } from './tickets';

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
      event_updates: EventUpdatesTable
      events: EventsTable
      profiles: ProfilesTable
      tickets: TicketsTable
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