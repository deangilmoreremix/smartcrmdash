/*
  # Add entitlements table
  
  1. New Tables
    - `entitlements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `feature` (text)
      - `granted_at` (timestamp)
      - `expires_at` (timestamp, nullable)
      - `granted_by` (text, nullable)
      
  2. Security
    - Enable RLS on `entitlements` table
    - Add policies for users to view their own entitlements
    - Add policies for admins to manage all entitlements
*/

CREATE TABLE IF NOT EXISTS entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature text NOT NULL,
  granted_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz,
  granted_by text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entitlements"
  ON entitlements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_feature ON entitlements(feature);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at ON entitlements(expires_at);