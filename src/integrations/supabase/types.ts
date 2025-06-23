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
          budget_program: string | null
          budget_year: string | null
          category_id: string
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
          budget_program?: string | null
          budget_year?: string | null
          category_id: string
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
          budget_program?: string | null
          budget_year?: string | null
          category_id?: string
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
      can_access_document: {
        Args: { doc_department: string }
        Returns: boolean
      }
      can_modify_documents: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      document_status: "actif" | "archivé"
      market_type: "DC" | "DRPR" | "DRPO" | "AAO"
      user_role: "admin" | "archiviste" | "utilisateur" | "admin_local"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_status: ["actif", "archivé"],
      market_type: ["DC", "DRPR", "DRPO", "AAO"],
      user_role: ["admin", "archiviste", "utilisateur", "admin_local"],
    },
  },
} as const
