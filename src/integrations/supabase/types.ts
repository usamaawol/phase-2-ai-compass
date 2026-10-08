export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      catalog_categories: {
        Row: {
          description: string;
          featured: boolean;
          name: string;
          slug: string;
        };
        Insert: {
          description?: string;
          featured?: boolean;
          name: string;
          slug: string;
        };
        Update: {
          description?: string;
          featured?: boolean;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      catalog_tags: {
        Row: {
          name: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
        Relationships: [];
      };
      catalog_tools: {
        Row: {
          data: Json;
          featured_order: number;
          published: boolean;
          slug: string;
        };
        Insert: {
          data?: Json;
          featured_order?: number;
          published?: boolean;
          slug: string;
        };
        Update: {
          data?: Json;
          featured_order?: number;
          published?: boolean;
          slug?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string;
          display_name: string;
          preferences: Json;
          user_id: string;
        };
        Insert: {
          avatar_url?: string;
          display_name?: string;
          preferences?: Json;
          user_id: string;
        };
        Update: {
          avatar_url?: string;
          display_name?: string;
          preferences?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          announcement: string;
          id: string;
          submissions_open: boolean;
          tagline: string;
        };
        Insert: {
          announcement?: string;
          id?: string;
          submissions_open?: boolean;
          tagline?: string;
        };
        Update: {
          announcement?: string;
          id?: string;
          submissions_open?: boolean;
          tagline?: string;
        };
        Relationships: [];
      };
      tool_categories: {
        Row: {
          category_slug: string;
          tool_slug: string;
        };
        Insert: {
          category_slug: string;
          tool_slug: string;
        };
        Update: {
          category_slug?: string;
          tool_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_categories_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "catalog_categories";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "tool_categories_tool_slug_fkey";
            columns: ["tool_slug"];
            isOneToOne: false;
            referencedRelation: "catalog_tools";
            referencedColumns: ["slug"];
          },
        ];
      };
      tool_submissions: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          review_note: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: string;
          review_note?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          review_note?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tool_tags: {
        Row: {
          tag_name: string;
          tool_slug: string;
        };
        Insert: {
          tag_name: string;
          tool_slug: string;
        };
        Update: {
          tag_name?: string;
          tool_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_tags_tag_name_fkey";
            columns: ["tag_name"];
            isOneToOne: false;
            referencedRelation: "catalog_tags";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "tool_tags_tool_slug_fkey";
            columns: ["tool_slug"];
            isOneToOne: false;
            referencedRelation: "catalog_tools";
            referencedColumns: ["slug"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_catalog_action: { Args: { payload: Json }; Returns: undefined };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
