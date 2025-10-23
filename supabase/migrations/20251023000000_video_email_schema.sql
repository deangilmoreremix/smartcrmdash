n /*
  # Video Email Database Schema

  This migration creates all necessary tables for the comprehensive Video Email feature,
  including video recordings, AI analysis, thumbnails, captions, and analytics.

  1. Core Tables
     - video_recordings: Main video storage and metadata
     - video_analytics: Performance metrics and engagement data
     - video_thumbnails: Thumbnail variants and A/B testing
     - video_captions: Multi-language captions and transcripts
     - video_segments: Chapter markers and scene tracking
     - video_ai_analysis: AI insights and recommendations

  2. Supporting Tables
     - video_ab_tests: A/B testing for thumbnails and content
     - video_transcripts: Full searchable transcripts
     - video_email_campaigns: Email campaign management
     - video_email_templates: Reusable email templates

  3. Security
     - Row Level Security (RLS) enabled on all tables
     - Tenant-based access control
     - Proper indexing for performance
*/

-- Create video_recordings table
CREATE TABLE IF NOT EXISTS video_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  blob_url TEXT, -- Supabase Storage URL for the video file
  duration INTEGER NOT NULL, -- in seconds
  file_size BIGINT NOT NULL, -- in bytes
  codec TEXT DEFAULT 'video/webm',
  resolution TEXT, -- e.g., "1920x1080"
  bitrate INTEGER, -- in bits per second
  thumbnail_url TEXT,
  status TEXT DEFAULT 'ready' CHECK (status IN ('processing', 'ready', 'failed')),
  is_screen_recording BOOLEAN DEFAULT false,
  is_picture_in_picture BOOLEAN DEFAULT false,
  camera_device_id TEXT,
  microphone_device_id TEXT,
  system_audio_enabled BOOLEAN DEFAULT false,
  recording_quality TEXT DEFAULT 'high' CHECK (recording_quality IN ('low', 'medium', 'high', 'ultra')),
  transcript TEXT,
  ai_analysis JSONB, -- AI insights, sentiment, recommendations
  engagement_score DECIMAL(3,2), -- 0.00 to 1.00
  tags TEXT[] DEFAULT '{}',
  folder_id UUID, -- for organization
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_analytics table
CREATE TABLE IF NOT EXISTS video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,4), -- percentage who watched to end
  average_watch_time INTEGER, -- in seconds
  click_through_rate DECIMAL(5,4),
  bounce_rate DECIMAL(5,4),
  engagement_heatmap JSONB, -- timestamp-based engagement data
  device_breakdown JSONB, -- desktop/mobile/tablet stats
  geographic_data JSONB, -- location-based viewing stats
  referral_sources JSONB, -- how people found the video
  conversion_events JSONB, -- custom conversion tracking
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
  social_shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_thumbnails table
CREATE TABLE IF NOT EXISTS video_thumbnails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  type TEXT DEFAULT 'auto' CHECK (type IN ('auto', 'ai-generated', 'custom')),
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  engagement_score DECIMAL(3,2),
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4), -- click-through rate
  is_active BOOLEAN DEFAULT true,
  ab_test_id UUID, -- reference to A/B test
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_captions table
CREATE TABLE IF NOT EXISTS video_captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  language_code TEXT DEFAULT 'en',
  language_name TEXT DEFAULT 'English',
  start_time DECIMAL(8,3), -- in seconds
  end_time DECIMAL(8,3), -- in seconds
  text TEXT NOT NULL,
  confidence DECIMAL(3,2), -- AI confidence score
  speaker_id TEXT, -- for multi-speaker videos
  keywords TEXT[] DEFAULT '{}',
  is_auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_segments table
CREATE TABLE IF NOT EXISTS video_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  start_time DECIMAL(8,3), -- in seconds
  end_time DECIMAL(8,3), -- in seconds
  segment_type TEXT DEFAULT 'chapter' CHECK (segment_type IN ('chapter', 'scene', 'highlight')),
  thumbnail_url TEXT,
  ai_generated BOOLEAN DEFAULT true,
  engagement_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_ai_analysis table
CREATE TABLE IF NOT EXISTS video_ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('sentiment', 'engagement', 'content', 'performance', 'accessibility')),
  data JSONB NOT NULL,
  confidence DECIMAL(3,2),
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_ab_tests table
CREATE TABLE IF NOT EXISTS video_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  test_type TEXT DEFAULT 'thumbnail' CHECK (test_type IN ('thumbnail', 'subject', 'content')),
  variants JSONB NOT NULL, -- array of test variants
  winner_id TEXT, -- ID of winning variant
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'stopped')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  results JSONB, -- statistical results
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_transcripts table
CREATE TABLE IF NOT EXISTS video_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES video_recordings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  full_text TEXT NOT NULL,
  language_code TEXT DEFAULT 'en',
  word_count INTEGER,
  duration INTEGER, -- in seconds
  speakers JSONB, -- speaker identification data
  searchable_tsv TSVECTOR, -- for full-text search
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_email_campaigns table
CREATE TABLE IF NOT EXISTS video_email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  video_ids UUID[] DEFAULT '{}', -- array of video IDs
  recipient_list JSONB, -- contact list or segment
  email_subject TEXT,
  email_body TEXT,
  email_template_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_date TIMESTAMPTZ,
  sent_date TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  bounced INTEGER DEFAULT 0,
  unsubscribed INTEGER DEFAULT 0,
  analytics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_email_templates table
CREATE TABLE IF NOT EXISTS video_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  subject_template TEXT,
  body_template TEXT,
  thumbnail_position TEXT DEFAULT 'top' CHECK (thumbnail_position IN ('top', 'inline', 'bottom')),
  cta_buttons JSONB DEFAULT '[]'::jsonb,
  branding JSONB, -- colors, fonts, logo
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_folders table for organization
CREATE TABLE IF NOT EXISTS video_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES video_folders(id) ON DELETE CASCADE,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add folder_id reference to video_recordings
ALTER TABLE video_recordings ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES video_folders(id) ON DELETE SET NULL;

-- Enable Row Level Security on all tables
ALTER TABLE video_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_thumbnails ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Tenant-based access)
CREATE POLICY "Tenant access to video_recordings" ON video_recordings
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_recordings.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_recordings.customer_id));

CREATE POLICY "Tenant access to video_analytics" ON video_analytics
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_analytics.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_analytics.customer_id));

CREATE POLICY "Tenant access to video_thumbnails" ON video_thumbnails
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_thumbnails.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_thumbnails.customer_id));

CREATE POLICY "Tenant access to video_captions" ON video_captions
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_captions.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_captions.customer_id));

CREATE POLICY "Tenant access to video_segments" ON video_segments
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_segments.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_segments.customer_id));

CREATE POLICY "Tenant access to video_ai_analysis" ON video_ai_analysis
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_ai_analysis.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_ai_analysis.customer_id));

CREATE POLICY "Tenant access to video_ab_tests" ON video_ab_tests
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_ab_tests.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_ab_tests.customer_id));

CREATE POLICY "Tenant access to video_transcripts" ON video_transcripts
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_transcripts.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_transcripts.customer_id));

CREATE POLICY "Tenant access to video_email_campaigns" ON video_email_campaigns
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_email_campaigns.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_email_campaigns.customer_id));

CREATE POLICY "Tenant access to video_email_templates" ON video_email_templates
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_email_templates.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_email_templates.customer_id));

CREATE POLICY "Tenant access to video_folders" ON video_folders
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_folders.customer_id))
  WITH CHECK (customer_id IN (SELECT customers.id FROM customers WHERE customers.id = video_folders.customer_id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_recordings_customer_id ON video_recordings(customer_id);
CREATE INDEX IF NOT EXISTS idx_video_recordings_user_id ON video_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_video_recordings_status ON video_recordings(status);
CREATE INDEX IF NOT EXISTS idx_video_recordings_created_at ON video_recordings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_recordings_folder_id ON video_recordings(folder_id);

CREATE INDEX IF NOT EXISTS idx_video_analytics_video_id ON video_analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_customer_id ON video_analytics(customer_id);

CREATE INDEX IF NOT EXISTS idx_video_thumbnails_video_id ON video_thumbnails(video_id);
CREATE INDEX IF NOT EXISTS idx_video_thumbnails_ab_test_id ON video_thumbnails(ab_test_id);

CREATE INDEX IF NOT EXISTS idx_video_captions_video_id ON video_captions(video_id);
CREATE INDEX IF NOT EXISTS idx_video_captions_language ON video_captions(language_code);

CREATE INDEX IF NOT EXISTS idx_video_segments_video_id ON video_segments(video_id);

CREATE INDEX IF NOT EXISTS idx_video_ai_analysis_video_id ON video_ai_analysis(video_id);
CREATE INDEX IF NOT EXISTS idx_video_ai_analysis_type ON video_ai_analysis(analysis_type);

CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts(video_id);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_searchable ON video_transcripts USING gin(searchable_tsv);

CREATE INDEX IF NOT EXISTS idx_video_email_campaigns_customer_id ON video_email_campaigns(customer_id);
CREATE INDEX IF NOT EXISTS idx_video_email_campaigns_status ON video_email_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_video_folders_customer_id ON video_folders(customer_id);
CREATE INDEX IF NOT EXISTS idx_video_folders_parent_id ON video_folders(parent_id);

-- Create full-text search trigger for transcripts
CREATE OR REPLACE FUNCTION update_video_transcripts_searchable_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.searchable_tsv = to_tsvector('english', NEW.full_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_transcripts_searchable_tsv_trigger
  BEFORE INSERT OR UPDATE ON video_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_video_transcripts_searchable_tsv();

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_video_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_recordings_updated_at
  BEFORE UPDATE ON video_recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_video_tables_updated_at();

CREATE TRIGGER update_video_analytics_updated_at
  BEFORE UPDATE ON video_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_video_tables_updated_at();

CREATE TRIGGER update_video_email_campaigns_updated_at
  BEFORE UPDATE ON video_email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_video_tables_updated_at();

CREATE TRIGGER update_video_email_templates_updated_at
  BEFORE UPDATE ON video_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_video_tables_updated_at();

-- Create storage buckets for video files
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('video-recordings', 'video-recordings', false),
  ('video-thumbnails', 'video-thumbnails', true),
  ('video-exports', 'video-exports', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for video files
CREATE POLICY "Users can upload video recordings" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'video-recordings');

CREATE POLICY "Users can view own video recordings" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'video-recordings');

CREATE POLICY "Users can update own video recordings" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'video-recordings');

CREATE POLICY "Users can delete own video recordings" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'video-recordings');

-- Public read access for thumbnails
CREATE POLICY "Public read access to video thumbnails" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Users can upload video thumbnails" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'video-thumbnails');

-- Private access for exports
CREATE POLICY "Users can manage video exports" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'video-exports');

-- Insert default email templates
INSERT INTO video_email_templates (customer_id, name, description, subject_template, body_template, is_default) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Simple Video Email', 'Clean, professional template', 'Video message from {sender}', 'Hi {recipient},\n\nI''ve created a short video message for you:\n\n{thumbnail}\n\n{video_link}\n\nBest regards,\n{sender}'),
  ('00000000-0000-0000-0000-000000000000', 'Sales Demo', 'Perfect for product demonstrations', 'Product demo: {product_name}', 'Hi {recipient},\n\nI''d like to show you how {product_name} can help {company}.\n\n{video_embed}\n\n{cta_button}\n\nBest,\n{sender}'),
  ('00000000-0000-0000-0000-000000000000', 'Personal Introduction', 'Warm introduction template', 'Nice to meet you!', 'Hello {recipient},\n\nIt was great speaking with you earlier. Here''s a quick video introduction:\n\n{video_player}\n\nLooking forward to working together!\n\n{sender}')
ON CONFLICT DO NOTHING;