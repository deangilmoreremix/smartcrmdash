/*
  # White Label Configuration
  
  1. New Tables
    - `whitelabel_config`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subdomain` (text, unique)
      - `company_name` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `logo_url` (text)
      - `custom_domain` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
  2. Security
    - Enable RLS on `whitelabel_config` table
    - Add policies for users to manage their own configuration
*/

CREATE TABLE IF NOT EXISTS whitelabel_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subdomain text UNIQUE NOT NULL,
  company_name text NOT NULL,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#1e40af',
  logo_url text,
  custom_domain text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE whitelabel_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own whitelabel config"
  ON whitelabel_config FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own whitelabel config"
  ON whitelabel_config FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own whitelabel config"
  ON whitelabel_config FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_whitelabel_subdomain ON whitelabel_config(subdomain);
CREATE INDEX IF NOT EXISTS idx_whitelabel_user_id ON whitelabel_config(user_id);