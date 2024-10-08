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
      commands_log: {
        Row: {
          args: Json
          command: string
          created_at: string
          id: number
          userId: string
        }
        Insert: {
          args?: Json
          command: string
          created_at?: string
          id?: number
          userId: string
        }
        Update: {
          args?: Json
          command?: string
          created_at?: string
          id?: number
          userId?: string
        }
        Relationships: []
      }
      interaction_logs: {
        Row: {
          created_at: string
          customId: string | null
          data: Json | null
          id: number
          type: Database["public"]["Enums"]["interactionaction_type"]
          userId: string
        }
        Insert: {
          created_at?: string
          customId?: string | null
          data?: Json | null
          id?: number
          type: Database["public"]["Enums"]["interactionaction_type"]
          userId: string
        }
        Update: {
          created_at?: string
          customId?: string | null
          data?: Json | null
          id?: number
          type?: Database["public"]["Enums"]["interactionaction_type"]
          userId?: string
        }
        Relationships: []
      }
      user_data: {
        Row: {
          cls: string | null
          created_at: string
          elective_1x: Database["public"]["Enums"]["subject"] | null
          elective_2x: Database["public"]["Enums"]["subject"] | null
          elective_3x: Database["public"]["Enums"]["subject"] | null
          id: number
          userId: string
        }
        Insert: {
          cls?: string | null
          created_at?: string
          elective_1x?: Database["public"]["Enums"]["subject"] | null
          elective_2x?: Database["public"]["Enums"]["subject"] | null
          elective_3x?: Database["public"]["Enums"]["subject"] | null
          id?: number
          userId: string
        }
        Update: {
          cls?: string | null
          created_at?: string
          elective_1x?: Database["public"]["Enums"]["subject"] | null
          elective_2x?: Database["public"]["Enums"]["subject"] | null
          elective_3x?: Database["public"]["Enums"]["subject"] | null
          id?: number
          userId?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      interactionaction_type:
        | "button_interaction"
        | "select_menu_interaction"
        | "modal_submit"
      subject:
        | "CHIN"
        | "ENG"
        | "MATH"
        | "LS"
        | "L&S"
        | "CS"
        | "MUS"
        | "SCI"
        | "M1"
        | "M2"
        | "BAFS"
        | "BIO"
        | "CHIS"
        | "CLIT"
        | "CHEM"
        | "ECON"
        | "GEOG"
        | "HIST"
        | "ICT"
        | "PHY"
        | "TH"
        | "IA"
        | "PE"
        | "RS"
        | "VA"
        | "CTP"
        | "ASS"
        | "DE"
        | "HEC"
        | "PTH"
        | "IT"
        | "1X"
        | "2X"
        | "3X"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
