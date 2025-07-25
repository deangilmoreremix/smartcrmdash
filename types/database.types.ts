type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      'business_analyzer': {
        Row: {
          id: number
          created_at: string | null
          business_name: string | null
          industry: string | null
          website_url: string | null
          social_links: Json | null
          analysis_results: Json | null
          user_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          business_name?: string | null
          industry?: string | null
          website_url?: string | null
          social_links?: Json | null
          analysis_results?: Json | null
          user_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          business_name?: string | null
          industry?: string | null
          website_url?: string | null
          social_links?: Json | null
          analysis_results?: Json | null
          user_id?: string | null
        }
      }
      'Business Analyzer': {
        Row: {
          id: number
          created_at: string
          business_name: string | null
          industry: string | null
          website_url: string | null
          social_link: Json | null
          analysis_results: Json | null
          user_id: string | null
        }
        Insert: {
          id: number
          created_at?: string
          business_name?: string | null
          industry?: string | null
          website_url?: string | null
          social_link?: Json | null
          analysis_results?: Json | null
          user_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          business_name?: string | null
          industry?: string | null
          website_url?: string | null
          social_link?: Json | null
          analysis_results?: Json | null
          user_id?: string | null
        }
      }
      'content_items': {
        Row: {
          id: string
          title: string
          type: string
          url: string
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          type: string
          url: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          type?: string
          url?: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      'content_item': {
        Row: {
          id: number
          created_at: string
        }
        Insert: {
          id: number
          created_at?: string
        }
        Update: {
          id?: number
          created_at?: string
        }
      }
      'voice_profiles': {
        Row: {
          id: string
          name: string
          voice_id: string
          settings: Json | null
          created_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          voice_id: string
          settings?: Json | null
          created_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          voice_id?: string
          settings?: Json | null
          created_at?: string | null
          user_id?: string | null
        }
      }
      'image_assets': {
        Row: {
          id: string
          title: string
          url: string
          prompt: string | null
          style: string | null
          source: string | null
          tags: string[] | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          url: string
          prompt?: string | null
          style?: string | null
          source?: string | null
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          url?: string
          prompt?: string | null
          style?: string | null
          source?: string | null
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
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