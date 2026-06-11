export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      article_comments: {
        Row: {
          approved: boolean
          article_slug: string
          body: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          article_slug: string
          body: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          article_slug?: string
          body?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      article_likes: {
        Row: {
          article_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          altitude: string
          author: string
          body: string
          cover_image: string
          created_at: string
          created_by: string | null
          designer: string | null
          designer_id: string | null
          excerpt: string
          fabric_tags: string[]
          id: string
          published: boolean
          search_vector: unknown
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          altitude?: string
          author?: string
          body?: string
          cover_image?: string
          created_at?: string
          created_by?: string | null
          designer?: string | null
          designer_id?: string | null
          excerpt?: string
          fabric_tags?: string[]
          id?: string
          published?: boolean
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          altitude?: string
          author?: string
          body?: string
          cover_image?: string
          created_at?: string
          created_by?: string | null
          designer?: string | null
          designer_id?: string | null
          excerpt?: string
          fabric_tags?: string[]
          id?: string
          published?: boolean
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          approved: boolean
          caption: string
          created_at: string
          designer_id: string | null
          fabric_tags: string[]
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          caption?: string
          created_at?: string
          designer_id?: string | null
          fabric_tags?: string[]
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          approved?: boolean
          caption?: string
          created_at?: string
          designer_id?: string | null
          fabric_tags?: string[]
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designers: {
        Row: {
          avatar_url: string
          bio: string
          categories: string[]
          cover_image: string
          created_at: string
          created_by: string | null
          id: string
          location: string
          name: string
          slug: string
          social_ig: string | null
          social_web: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string
          bio?: string
          categories?: string[]
          cover_image?: string
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string
          name: string
          slug: string
          social_ig?: string | null
          social_web?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string
          bio?: string
          categories?: string[]
          cover_image?: string
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string
          name?: string
          slug?: string
          social_ig?: string | null
          social_web?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image: string
          created_at: string
          created_by: string | null
          description: string
          ends_at: string | null
          free: boolean
          id: string
          location: string
          published: boolean
          slug: string
          starts_at: string
          ticket_url: string | null
          title: string
        }
        Insert: {
          cover_image?: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          free?: boolean
          id?: string
          location?: string
          published?: boolean
          slug: string
          starts_at: string
          ticket_url?: string | null
          title: string
        }
        Update: {
          cover_image?: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          free?: boolean
          id?: string
          location?: string
          published?: boolean
          slug?: string
          starts_at?: string
          ticket_url?: string | null
          title?: string
        }
        Relationships: []
      }
      model_booking_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          model_id: string
          name: string
          project_type: string
          requester_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          model_id: string
          name: string
          project_type?: string
          requester_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          model_id?: string
          name?: string
          project_type?: string
          requester_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_booking_requests_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      model_profiles: {
        Row: {
          available: boolean
          avatar_url: string
          bio: string
          cover_image: string
          created_at: string
          display_name: string
          experience_tags: string[]
          height_cm: number | null
          id: string
          location: string
          portfolio_urls: string[]
          slug: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available?: boolean
          avatar_url?: string
          bio?: string
          cover_image?: string
          created_at?: string
          display_name: string
          experience_tags?: string[]
          height_cm?: number | null
          id?: string
          location?: string
          portfolio_urls?: string[]
          slug: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available?: boolean
          avatar_url?: string
          bio?: string
          cover_image?: string
          created_at?: string
          display_name?: string
          experience_tags?: string[]
          height_cm?: number | null
          id?: string
          location?: string
          portfolio_urls?: string[]
          slug?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mood_board: {
        Row: {
          article_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          preferred_date: string | null
          requester_id: string | null
          service_id: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          preferred_date?: string | null
          requester_id?: string | null
          service_id: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          preferred_date?: string | null
          requester_id?: string | null
          service_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available: boolean
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          image_url: string
          provider: string
          rate_display: string
          slug: string
          title: string
        }
        Insert: {
          available?: boolean
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string
          provider: string
          rate_display?: string
          slug: string
          title: string
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string
          provider?: string
          rate_display?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
