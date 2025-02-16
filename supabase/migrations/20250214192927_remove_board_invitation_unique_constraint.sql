/*
  # Remove Board Invitations Unique Constraint

  1. Changes
    - Allow multiple invitations to the same email address
    - Remove unique constraint from board_invitations table
    
  2. Purpose
    - Enable sending multiple invitation emails to the same user
    - Support different invitation tokens for each invitation
*/

-- Remove existing unique constraint
ALTER TABLE board_invitations
DROP CONSTRAINT IF EXISTS board_invitations_board_id_email_key; 