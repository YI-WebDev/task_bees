/*
  # Initial Database Setup for TaskBees

  1. Tables
    - workspaces: Container for boards
    - boards: Kanban boards
    - lists: Task lists
    - tasks: Individual tasks
    - users: Basic user users

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated access
    
  3. Indexes
    - Optimized for common queries
*/

-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_task_positions() CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users NOT NULL
);

CREATE TABLE boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  workspace_id uuid REFERENCES workspaces ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  position integer NOT NULL DEFAULT 0
);

CREATE TABLE lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  board_id uuid REFERENCES boards ON DELETE CASCADE NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  color text DEFAULT '#f59e0b'
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  list_id uuid REFERENCES lists ON DELETE CASCADE NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  is_completed boolean DEFAULT false
);

CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text NOT NULL,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can view and manage boards in their workspaces"
  ON boards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE id = boards.workspace_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view and manage lists in their boards"
  ON lists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards
      JOIN workspaces ON workspaces.id = boards.workspace_id
      WHERE boards.id = lists.board_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view and manage tasks in their lists"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON boards.id = lists.board_id
      JOIN workspaces ON workspaces.id = boards.workspace_id
      WHERE lists.id = tasks.list_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_boards_workspace_id ON boards(workspace_id);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_tasks_list_id ON tasks(list_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);

-- Create trigger for new user users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    email,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();