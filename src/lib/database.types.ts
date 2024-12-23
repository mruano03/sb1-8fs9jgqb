export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      waitlists: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          tagline: string | null
          description: string | null
          status: 'active' | 'paused' | 'closed'
          user_id: string
          settings: Json
          total_spots: number | null
          spots_remaining: number | null
          launch_date: string | null
          image_url: string | null
          features: Json
          benefits: Json
          pricing: Json
          social_links: Json
          custom_domain: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          tagline?: string | null
          description?: string | null
          status?: 'active' | 'paused' | 'closed'
          user_id: string
          settings?: Json
          total_spots?: number | null
          spots_remaining?: number | null
          launch_date?: string | null
          image_url?: string | null
          features?: Json
          benefits?: Json
          pricing?: Json
          social_links?: Json
          custom_domain?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          tagline?: string | null
          description?: string | null
          status?: 'active' | 'paused' | 'closed'
          user_id?: string
          settings?: Json
          total_spots?: number | null
          spots_remaining?: number | null
          launch_date?: string | null
          image_url?: string | null
          features?: Json
          benefits?: Json
          pricing?: Json
          social_links?: Json
          custom_domain?: string | null
        }
      }
      waitlist_entries: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          waitlist_id: string
          email: string
          name: string
          position: number
          status: 'pending' | 'approved' | 'rejected'
          custom_fields: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          waitlist_id: string
          email: string
          name: string
          position?: number
          status?: 'pending' | 'approved' | 'rejected'
          custom_fields?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          waitlist_id?: string
          email?: string
          name?: string
          position?: number
          status?: 'pending' | 'approved' | 'rejected'
          custom_fields?: Json
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          paypal_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          paypal_subscription_id?: string | null
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          paypal_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          interval: 'month' | 'year'
          features: Json
          limits: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          interval: 'month' | 'year'
          features?: Json
          limits?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          interval?: 'month' | 'year'
          features?: Json
          limits?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
}