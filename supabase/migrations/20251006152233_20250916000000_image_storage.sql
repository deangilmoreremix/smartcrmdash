/*
  # Image Storage Setup
  
  1. Storage Buckets
    - Create generated-images bucket for AI-generated images
    
  2. New Tables
    - `user_generated_images` - Track user-generated images
    
  3. Security
    - Enable RLS
    - Public read access for generated images
    - Users can only manage their own images
*/

-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for tracking user-generated images
CREATE TABLE IF NOT EXISTS user_generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  prompt_text TEXT,
  feature TEXT,
  format TEXT,
  aspect_ratio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_generated_images_user_id ON user_generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_generated_images_created_at ON user_generated_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_generated_images_feature ON user_generated_images(feature);

-- Enable Row Level Security
ALTER TABLE user_generated_images ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own images" ON user_generated_images
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images" ON user_generated_images
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images" ON user_generated_images
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images" ON user_generated_images
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);