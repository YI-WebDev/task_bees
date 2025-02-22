/*
  # Board Invitations Schema

  1. Tables
    - board_invitations: Manage board invitations and access control

  2. Security
    - RLS enabled
    - Policies for authenticated access
    
  3. Indexes
    - Optimized for invitation lookups
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS board_invitations CASCADE;

-- Create board invitations table
CREATE TABLE board_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  invitation_token text NOT NULL,
  invited_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Enable Row Level Security
ALTER TABLE board_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only board members can create invitations"
  ON board_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      JOIN workspaces ON workspaces.id = boards.workspace_id
      WHERE boards.id = board_invitations.board_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Only invited users can view their invitations"
  ON board_invitations
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

CREATE POLICY "Only invited users or board members can delete invitations"
  ON board_invitations
  FOR DELETE
  TO authenticated
  USING (
    email = auth.email() OR
    EXISTS (
      SELECT 1 FROM boards
      JOIN workspaces ON workspaces.id = boards.workspace_id
      WHERE boards.id = board_invitations.board_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_board_invitations_board_id ON board_invitations(board_id);
CREATE INDEX idx_board_invitations_email ON board_invitations(email);
CREATE INDEX idx_board_invitations_token ON board_invitations(invitation_token); 