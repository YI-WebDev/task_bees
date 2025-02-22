export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          owner_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          owner_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          owner_id?: string;
        };
      };
      boards: {
        Row: {
          id: string;
          name: string;
          workspace_id: string;
          created_at: string;
          position: number;
        };
        Insert: {
          id?: string;
          name: string;
          workspace_id: string;
          created_at?: string;
          position?: number;
        };
        Update: {
          id?: string;
          name?: string;
          workspace_id?: string;
          created_at?: string;
          position?: number;
        };
      };
      lists: {
        Row: {
          id: string;
          title: string;
          board_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          board_id: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          board_id?: string;
          position?: number;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          column_id: string;
          position: number;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          column_id: string;
          position?: number;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          column_id?: string;
          position?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
    };
  };
}
