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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: number
          description: string
          emoji: string
          id: string
          name: string
        }
        Insert: {
          condition_type: string
          condition_value?: number
          description: string
          emoji: string
          id?: string
          name: string
        }
        Update: {
          condition_type?: string
          condition_value?: number
          description?: string
          emoji?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      avatar_items: {
        Row: {
          category: string
          color: string
          emoji: string
          id: string
          is_premium: boolean
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          color?: string
          emoji: string
          id?: string
          is_premium?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          color?: string
          emoji?: string
          id?: string
          is_premium?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      breeds: {
        Row: {
          created_at: string
          id: string
          is_custom: boolean
          name: string
          size_category: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_custom?: boolean
          name: string
          size_category?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_custom?: boolean
          name?: string
          size_category?: string
        }
        Relationships: []
      }
      disease_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_custom: boolean
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name?: string
        }
        Relationships: []
      }
      medication_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_custom: boolean
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name?: string
        }
        Relationships: []
      }
      pet_achievements: {
        Row: {
          achievement_id: string
          id: string
          pet_id: string
          unlocked_at: string
        }
        Insert: {
          achievement_id: string
          id?: string
          pet_id: string
          unlocked_at?: string
        }
        Update: {
          achievement_id?: string
          id?: string
          pet_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_achievements_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_avatar: {
        Row: {
          equipped_at: string
          id: string
          item_id: string
          pet_id: string
        }
        Insert: {
          equipped_at?: string
          id?: string
          item_id: string
          pet_id: string
        }
        Update: {
          equipped_at?: string
          id?: string
          item_id?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_avatar_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "avatar_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_avatar_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_diseases: {
        Row: {
          created_at: string
          custom_description: string | null
          deleted_at: string | null
          disease_name: string
          id: string
          notes: string | null
          pet_id: string
          treatment_end: string | null
          treatment_start: string | null
          treatment_status: string
        }
        Insert: {
          created_at?: string
          custom_description?: string | null
          deleted_at?: string | null
          disease_name: string
          id?: string
          notes?: string | null
          pet_id: string
          treatment_end?: string | null
          treatment_start?: string | null
          treatment_status?: string
        }
        Update: {
          created_at?: string
          custom_description?: string | null
          deleted_at?: string | null
          disease_name?: string
          id?: string
          notes?: string | null
          pet_id?: string
          treatment_end?: string | null
          treatment_start?: string | null
          treatment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_diseases_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medications: {
        Row: {
          created_at: string
          deleted_at: string | null
          dosage: string | null
          frequency_hours: number
          id: string
          name: string
          notes: string | null
          pet_id: string
          treatment_end: string | null
          treatment_start: string
          treatment_status: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          dosage?: string | null
          frequency_hours?: number
          id?: string
          name: string
          notes?: string | null
          pet_id: string
          treatment_end?: string | null
          treatment_start?: string
          treatment_status?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          dosage?: string | null
          frequency_hours?: number
          id?: string
          name?: string
          notes?: string | null
          pet_id?: string
          treatment_end?: string | null
          treatment_start?: string
          treatment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_stats: {
        Row: {
          current_streak: number
          id: string
          last_training_date: string | null
          level: string
          longest_streak: number
          pet_id: string
          xp: number
        }
        Insert: {
          current_streak?: number
          id?: string
          last_training_date?: string | null
          level?: string
          longest_streak?: number
          pet_id: string
          xp?: number
        }
        Update: {
          current_streak?: number
          id?: string
          last_training_date?: string | null
          level?: string
          longest_streak?: number
          pet_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "pet_stats_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: true
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_trainings: {
        Row: {
          attempts: number
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          pet_id: string
          training_id: string
        }
        Insert: {
          attempts?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          pet_id: string
          training_id: string
        }
        Update: {
          attempts?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          pet_id?: string
          training_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_trainings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_trainings_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age_months: number
          birth_date: string | null
          breed: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          owner_id: string
          photo_url: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age_months?: number
          birth_date?: string | null
          breed?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          owner_id: string
          photo_url?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age_months?: number
          birth_date?: string | null
          breed?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          photo_url?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          deleted_at: string | null
          expires_at: string
          id: string
          is_active: boolean
          plan_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          plan_type?: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          plan_type?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_categories: {
        Row: {
          emoji: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          emoji: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          emoji?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      training_steps: {
        Row: {
          description: string
          id: string
          image_url: string | null
          sort_order: number
          step_number: number
          title: string
          training_id: string
        }
        Insert: {
          description: string
          id?: string
          image_url?: string | null
          sort_order?: number
          step_number: number
          title: string
          training_id: string
        }
        Update: {
          description?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          step_number?: number
          title?: string
          training_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_steps_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          category_id: string
          difficulty: number
          duration_minutes: number
          id: string
          is_premium: boolean
          name: string
          sort_order: number
        }
        Insert: {
          category_id: string
          difficulty?: number
          duration_minutes?: number
          id?: string
          is_premium?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          difficulty?: number
          duration_minutes?: number
          id?: string
          is_premium?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "training_categories"
            referencedColumns: ["id"]
          },
        ]
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
      vaccine_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_custom: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean
          name?: string
        }
        Relationships: []
      }
      vaccines: {
        Row: {
          applied_date: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          next_dose_date: string | null
          notes: string | null
          pet_id: string
        }
        Insert: {
          applied_date: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          next_dose_date?: string | null
          notes?: string | null
          pet_id: string
        }
        Update: {
          applied_date?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          next_dose_date?: string | null
          notes?: string | null
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccines_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          id: string
          pet_id: string
          recorded_at: string
          weight_kg: number
        }
        Insert: {
          id?: string
          pet_id: string
          recorded_at?: string
          weight_kg: number
        }
        Update: {
          id?: string
          pet_id?: string
          recorded_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_logs_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
