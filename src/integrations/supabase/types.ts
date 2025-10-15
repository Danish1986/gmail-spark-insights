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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_type: string | null
          bank_name: string
          created_at: string | null
          detected_from_email: boolean | null
          id: string
          last_4_digits: string | null
          logo_url: string | null
          primary_account: boolean | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          bank_name: string
          created_at?: string | null
          detected_from_email?: boolean | null
          id?: string
          last_4_digits?: string | null
          logo_url?: string | null
          primary_account?: boolean | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          bank_name?: string
          created_at?: string | null
          detected_from_email?: boolean | null
          id?: string
          last_4_digits?: string | null
          logo_url?: string | null
          primary_account?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          access_token: string | null
          connected_at: string | null
          email: string
          id: string
          last_synced_at: string | null
          provider: string
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          email: string
          id?: string
          last_synced_at?: string | null
          provider: string
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          email?: string
          id?: string
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          email_consent: boolean | null
          email_consent_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_consent?: boolean | null
          email_consent_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_consent?: boolean | null
          email_consent_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_status: {
        Row: {
          created_at: string | null
          current_status: string | null
          emails_processed: number | null
          error_message: string | null
          estimated_completion_time: string | null
          id: string
          last_sync_at: string | null
          phase_1_complete: boolean | null
          phase_2_complete: boolean | null
          phase_3_complete: boolean | null
          phase_4_complete: boolean | null
          progress_percentage: number | null
          sync_in_progress: boolean | null
          sync_phase: string | null
          total_emails_found: number | null
          transactions_found: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_status?: string | null
          emails_processed?: number | null
          error_message?: string | null
          estimated_completion_time?: string | null
          id?: string
          last_sync_at?: string | null
          phase_1_complete?: boolean | null
          phase_2_complete?: boolean | null
          phase_3_complete?: boolean | null
          phase_4_complete?: boolean | null
          progress_percentage?: number | null
          sync_in_progress?: boolean | null
          sync_phase?: string | null
          total_emails_found?: number | null
          transactions_found?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_status?: string | null
          emails_processed?: number | null
          error_message?: string | null
          estimated_completion_time?: string | null
          id?: string
          last_sync_at?: string | null
          phase_1_complete?: boolean | null
          phase_2_complete?: boolean | null
          phase_3_complete?: boolean | null
          phase_4_complete?: boolean | null
          progress_percentage?: number | null
          sync_in_progress?: boolean | null
          sync_phase?: string | null
          total_emails_found?: number | null
          transactions_found?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_source: string | null
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          confidence_score: number | null
          created_at: string | null
          date: string
          description: string | null
          email_id: string
          id: string
          is_verified: boolean | null
          merchant: string | null
          payment_method: string | null
          raw_email_body: string | null
          raw_email_subject: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_source?: string | null
          amount: number
          category?: Database["public"]["Enums"]["transaction_category"]
          confidence_score?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          email_id: string
          id?: string
          is_verified?: boolean | null
          merchant?: string | null
          payment_method?: string | null
          raw_email_body?: string | null
          raw_email_subject?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_source?: string | null
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          confidence_score?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          email_id?: string
          id?: string
          is_verified?: boolean | null
          merchant?: string | null
          payment_method?: string | null
          raw_email_body?: string | null
          raw_email_subject?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      trigger_type_generation: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      transaction_category:
        | "salary"
        | "food_dining"
        | "shopping"
        | "travel"
        | "utilities"
        | "entertainment"
        | "investment"
        | "refund"
        | "emi"
        | "transfer"
        | "other"
        | "p2a_transfer"
        | "p2m_payment"
        | "credit_card_bill"
      transaction_type: "credit" | "debit" | "refund"
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
      transaction_category: [
        "salary",
        "food_dining",
        "shopping",
        "travel",
        "utilities",
        "entertainment",
        "investment",
        "refund",
        "emi",
        "transfer",
        "other",
        "p2a_transfer",
        "p2m_payment",
        "credit_card_bill",
      ],
      transaction_type: ["credit", "debit", "refund"],
    },
  },
} as const
