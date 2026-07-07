export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      activity_cheers: {
        Row: { activity_id: string; member_id: string }
        Insert: { activity_id: string; member_id: string }
        Update: { activity_id?: string; member_id?: string }
        Relationships: []
      }
      activity_events: {
        Row: {
          base_cheers: number
          class_id: string | null
          detail: Json | null
          id: string
          member_id: string
          minutes_ago: number
          type: string
        }
        Insert: {
          base_cheers?: number
          class_id?: string | null
          detail?: Json | null
          id: string
          member_id: string
          minutes_ago: number
          type: string
        }
        Update: {
          base_cheers?: number
          class_id?: string | null
          detail?: Json | null
          id?: string
          member_id?: string
          minutes_ago?: number
          type?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          checked_in: boolean
          date: string
          id: string
          member_id: string
          session_id: string
        }
        Insert: {
          checked_in?: boolean
          date: string
          id: string
          member_id: string
          session_id: string
        }
        Update: {
          checked_in?: boolean
          date?: string
          id?: string
          member_id?: string
          session_id?: string
        }
        Relationships: []
      }
      challenge_participants: {
        Row: { challenge_id: string; member_id: string }
        Insert: { challenge_id: string; member_id: string }
        Update: { challenge_id?: string; member_id?: string }
        Relationships: []
      }
      challenges: {
        Row: {
          current: number
          description: Json
          ends_in_days: number
          goal: number
          id: string
          title: Json
          unit: Json
        }
        Insert: {
          current?: number
          description: Json
          ends_in_days: number
          goal: number
          id: string
          title: Json
          unit: Json
        }
        Update: {
          current?: number
          description?: Json
          ends_in_days?: number
          goal?: number
          id?: string
          title?: Json
          unit?: Json
        }
        Relationships: []
      }
      classes: {
        Row: { accent: string; category: string; description: Json; id: string; name: Json }
        Insert: { accent: string; category: string; description: Json; id: string; name: Json }
        Update: { accent?: string; category?: string; description?: Json; id?: string; name?: Json }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          member_id: string
          member_name: string
          member_unread: number
          recipient: string
          staff_unread: number
        }
        Insert: {
          id: string
          member_id: string
          member_name: string
          member_unread?: number
          recipient: string
          staff_unread?: number
        }
        Update: {
          id?: string
          member_id?: string
          member_name?: string
          member_unread?: number
          recipient?: string
          staff_unread?: number
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar: string
          dial_code: string
          email: string
          first_name: string
          id: string
          joined: string
          last_name: string
          phone: string
          photo: string | null
          plan_id: string
          sessions_goal: number
          sessions_this_month: number
          status: string
        }
        Insert: {
          avatar: string
          dial_code: string
          email: string
          first_name: string
          id: string
          joined?: string
          last_name: string
          phone: string
          photo?: string | null
          plan_id: string
          sessions_goal?: number
          sessions_this_month?: number
          status?: string
        }
        Update: {
          avatar?: string
          dial_code?: string
          email?: string
          first_name?: string
          id?: string
          joined?: string
          last_name?: string
          phone?: string
          photo?: string | null
          plan_id?: string
          sessions_goal?: number
          sessions_this_month?: number
          status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          at: number
          conversation_id: string
          id: string
          party: string
          sender_name: string | null
          text: string
        }
        Insert: {
          at: number
          conversation_id: string
          id: string
          party: string
          sender_name?: string | null
          text: string
        }
        Update: {
          at?: number
          conversation_id?: string
          id?: string
          party?: string
          sender_name?: string | null
          text?: string
        }
        Relationships: []
      }
      plans: {
        Row: { featured: boolean; id: string; name: Json; price: Json; terms: Json }
        Insert: { featured?: boolean; id: string; name: Json; price: Json; terms: Json }
        Update: { featured?: boolean; id?: string; name?: Json; price?: Json; terms?: Json }
        Relationships: []
      }
      profiles: {
        Row: { created_at: string; id: string; member_id: string | null; role: string }
        Insert: { created_at?: string; id: string; member_id?: string | null; role?: string }
        Update: { created_at?: string; id?: string; member_id?: string | null; role?: string }
        Relationships: []
      }
      sessions: {
        Row: {
          capacity: number
          class_id: string
          end: string
          free_for_members: boolean
          id: string
          instructor: string
          spots_left: number
          start: string
          weekday: number
        }
        Insert: {
          capacity: number
          class_id: string
          end: string
          free_for_members?: boolean
          id: string
          instructor: string
          spots_left: number
          start: string
          weekday: number
        }
        Update: {
          capacity?: number
          class_id?: string
          end?: string
          free_for_members?: boolean
          id?: string
          instructor?: string
          spots_left?: number
          start?: string
          weekday?: number
        }
        Relationships: []
      }
      trainers: {
        Row: {
          avatar: string
          bio: Json
          contactable: boolean
          id: string
          initials: string
          name: string
          role: Json
          specialties: Json
        }
        Insert: {
          avatar: string
          bio: Json
          contactable?: boolean
          id: string
          initials: string
          name: string
          role: Json
          specialties: Json
        }
        Update: {
          avatar?: string
          bio?: Json
          contactable?: boolean
          id?: string
          initials?: string
          name?: string
          role?: Json
          specialties?: Json
        }
        Relationships: []
      }
      treatment_slots: {
        Row: { id: string; provider: string; start: string; treatment_id: string; weekday: number }
        Insert: { id: string; provider: string; start: string; treatment_id: string; weekday: number }
        Update: { id?: string; provider?: string; start?: string; treatment_id?: string; weekday?: number }
        Relationships: []
      }
      treatments: {
        Row: {
          accent: string
          description: Json
          duration: number
          id: string
          kind: string
          name: Json
          price: Json
          provider: string
        }
        Insert: {
          accent: string
          description: Json
          duration: number
          id: string
          kind: string
          name: Json
          price: Json
          provider: string
        }
        Update: {
          accent?: string
          description?: Json
          duration?: number
          id?: string
          kind?: string
          name?: Json
          price?: Json
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      activity_feed_view: {
        Row: {
          base_cheers: number | null
          cheered_by_me: boolean | null
          cheers: number | null
          class_id: string | null
          detail: Json | null
          id: string | null
          member_id: string | null
          minutes_ago: number | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
      my_member_id: { Args: Record<string, never>; Returns: string }
      next_occurrence: { Args: { p_hm: string; p_weekday: number }; Returns: string }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
