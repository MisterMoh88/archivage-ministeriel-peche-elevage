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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      document_access: {
        Row: {
          can_download: boolean
          can_view: boolean
          document_id: string
          granted_at: string
          granted_by: string
          id: string
          user_id: string
        }
        Insert: {
          can_download?: boolean
          can_view?: boolean
          document_id: string
          granted_at?: string
          granted_by: string
          id?: string
          user_id: string
        }
        Update: {
          can_download?: boolean
          can_view?: boolean
          document_id?: string
          granted_at?: string
          granted_by?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_access_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_tags: {
        Row: {
          document_id: string
          id: string
          tag: string
        }
        Insert: {
          document_id: string
          id?: string
          tag: string
        }
        Update: {
          document_id?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          archive_box: string | null
          archive_cabinet: string | null
          archive_code: string | null
          archive_folder: string | null
          archive_room: string | null
          archive_shelf: string | null
          archive_zone: string | null
          budget_program: string | null
          budget_year: string | null
          category_id: string
          confidentiality_level: Database["public"]["Enums"]["confidentiality_level"]
          description: string | null
          document_date: string
          document_type: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          issuing_department: string | null
          last_modified: string
          market_type: Database["public"]["Enums"]["market_type"] | null
          modified_by: string | null
          original_filename: string | null
          reference_number: string
          status: Database["public"]["Enums"]["document_status"] | null
          title: string
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          archive_box?: string | null
          archive_cabinet?: string | null
          archive_code?: string | null
          archive_folder?: string | null
          archive_room?: string | null
          archive_shelf?: string | null
          archive_zone?: string | null
          budget_program?: string | null
          budget_year?: string | null
          category_id: string
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_level"]
          description?: string | null
          document_date: string
          document_type: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          issuing_department?: string | null
          last_modified?: string
          market_type?: Database["public"]["Enums"]["market_type"] | null
          modified_by?: string | null
          original_filename?: string | null
          reference_number: string
          status?: Database["public"]["Enums"]["document_status"] | null
          title: string
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          archive_box?: string | null
          archive_cabinet?: string | null
          archive_code?: string | null
          archive_folder?: string | null
          archive_room?: string | null
          archive_shelf?: string | null
          archive_zone?: string | null
          budget_program?: string | null
          budget_year?: string | null
          category_id?: string
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_level"]
          description?: string | null
          document_date?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          issuing_department?: string | null
          last_modified?: string
          market_type?: Database["public"]["Enums"]["market_type"] | null
          modified_by?: string | null
          original_filename?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["document_status"] | null
          title?: string
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          department: string | null
          full_name: string | null
          id: string
          last_active: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
        }
        Insert: {
          department?: string | null
          full_name?: string | null
          id: string
          last_active?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
        }
        Update: {
          department?: string | null
          full_name?: string | null
          id?: string
          last_active?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
        }
        Relationships: []
      }
      user_actions: {
        Row: {
          action_type: string
          details: Json | null
          document_id: string | null
          id: string
          performed_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          details?: Json | null
          document_id?: string | null
          id?: string
          performed_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          details?: Json | null
          document_id?: string | null
          id?: string
          performed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_actions_profiles"
            columns: ["user_id"]
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
      can_access_by_confidentiality: {
        Args: {
          doc_confidentiality: Database["public"]["Enums"]["confidentiality_level"]
          doc_department: string
        }
        Returns: boolean
      }
      can_access_document: {
        Args: { doc_department: string }
        Returns: boolean
      }
      can_modify_documents: { Args: never; Returns: boolean }
      create_admin_user: { Args: never; Returns: undefined }
      generate_archive_code: {
        Args: { dept: string; yr: string }
        Returns: string
      }
      has_nominal_access: { Args: { doc_id: string }; Returns: boolean }
      user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      confidentiality_level: "C0" | "C1" | "C2" | "C3"
      document_status: "actif" | "archivé"
      market_type: "DC" | "DRPR" | "DRPO" | "AAO"
      user_role:
        | "admin"
        | "archiviste"
        | "utilisateur"
        | "admin_local"
        | "auditeur"
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
      confidentiality_level: ["C0", "C1", "C2", "C3"],
      document_status: ["actif", "archivé"],
      market_type: ["DC", "DRPR", "DRPO", "AAO"],
      user_role: [
        "admin",
        "archiviste",
        "utilisateur",
        "admin_local",
        "auditeur",
      ],
    },
  },
} as const
