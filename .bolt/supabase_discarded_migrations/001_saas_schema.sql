-- SaaS Multi-Tenant Database Schema
-- Run this in your Supabase SQL editor

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  feature_access JSONB DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organizations table (tenants)
CREATE TABLE IF NOT EXISTS saas_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255) UNIQUE,
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  subscription_status VARCHAR(50) DEFAULT 'trial',
  branding_config JSONB DEFAULT '{}',
  feature_flags JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  user_count INTEGER DEFAULT 0,
  max_users INTEGER DEFAULT 5,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 5368709120, -- 5GB default
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table with organization and role relationships
CREATE TABLE IF NOT EXISTS saas_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  organization_id UUID REFERENCES saas_organizations(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  permissions JSONB DEFAULT '[]',
  feature_access JSONB DEFAULT '{}',
  is_master_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES saas_organizations(id) ON DELETE CASCADE,
  plan_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  features_included JSONB DEFAULT '[]',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  amount_cents INTEGER DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES saas_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES saas_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES saas_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES saas_users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(20) NOT NULL,
  permissions JSONB DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert system roles
INSERT INTO roles (id, name, description, permissions, feature_access, is_system_role) VALUES
  (
    'master-admin',
    'Master Admin',
    'Full system access across all organizations',
    '["*"]',
    '{"whiteLabel": true, "aiTools": true, "analytics": true, "multiTenant": true, "api": true, "billing": true}',
    true
  ),
  (
    'org-admin',
    'Organization Admin',
    'Full access within the organization',
    '["org.*", "users.manage", "settings.manage", "branding.manage"]',
    '{"whiteLabel": true, "aiTools": true, "analytics": true, "multiTenant": false, "api": true, "billing": true}',
    true
  ),
  (
    'org-manager',
    'Organization Manager',
    'Management access within the organization',
    '["contacts.*", "deals.*", "tasks.*", "reports.read"]',
    '{"whiteLabel": false, "aiTools": true, "analytics": true, "multiTenant": false, "api": false, "billing": false}',
    true
  ),
  (
    'org-user',
    'Organization User',
    'Standard user access',
    '["contacts.read", "contacts.write", "deals.read", "deals.write", "tasks.*"]',
    '{"whiteLabel": false, "aiTools": true, "analytics": false, "multiTenant": false, "api": false, "billing": false}',
    true
  ),
  (
    'viewer',
    'Viewer',
    'Read-only access',
    '["*.read"]',
    '{"whiteLabel": false, "aiTools": false, "analytics": false, "multiTenant": false, "api": false, "billing": false}',
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saas_organizations_clerk_org_id ON saas_organizations(clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_saas_organizations_slug ON saas_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_saas_organizations_domain ON saas_organizations(domain);
CREATE INDEX IF NOT EXISTS idx_saas_users_clerk_user_id ON saas_users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_saas_users_organization_id ON saas_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Create RLS (Row Level Security) policies
ALTER TABLE saas_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own organization's data
CREATE POLICY "Users can access their organization" ON saas_organizations
  FOR ALL USING (
    clerk_org_id = (auth.jwt() ->> 'org_id') OR
    id IN (
      SELECT organization_id FROM saas_users 
      WHERE clerk_user_id = (auth.jwt() ->> 'sub') AND is_master_admin = true
    )
  );

-- Policy: Users can access other users in their organization
CREATE POLICY "Users can access org members" ON saas_users
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM saas_users 
      WHERE clerk_user_id = (auth.jwt() ->> 'sub')
    ) OR
    clerk_user_id = (auth.jwt() ->> 'sub') OR
    (SELECT is_master_admin FROM saas_users WHERE clerk_user_id = (auth.jwt() ->> 'sub')) = true
  );

-- Policy: Audit logs accessible by organization members
CREATE POLICY "Audit logs for organization" ON audit_logs
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM saas_users 
      WHERE clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- Policy: API keys accessible by organization members
CREATE POLICY "API keys for organization" ON api_keys
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM saas_users 
      WHERE clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_saas_organizations_updated_at BEFORE UPDATE ON saas_organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saas_users_updated_at BEFORE UPDATE ON saas_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create organization
CREATE OR REPLACE FUNCTION create_organization(
  org_name TEXT,
  org_slug TEXT,
  clerk_org_id TEXT,
  owner_clerk_user_id TEXT
)
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
  admin_role_id UUID;
BEGIN
  -- Create the organization
  INSERT INTO saas_organizations (name, slug, clerk_org_id)
  VALUES (org_name, org_slug, clerk_org_id)
  RETURNING id INTO new_org_id;
  
  -- Get the org-admin role
  SELECT id INTO admin_role_id FROM roles WHERE name = 'Organization Admin';
  
  -- Create the owner user
  INSERT INTO saas_users (clerk_user_id, organization_id, role_id, is_active)
  VALUES (owner_clerk_user_id, new_org_id, admin_role_id, true);
  
  -- Update organization user count
  UPDATE saas_organizations 
  SET user_count = 1 
  WHERE id = new_org_id;
  
  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature access
CREATE OR REPLACE FUNCTION user_has_feature_access(
  user_clerk_id TEXT,
  feature_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := false;
BEGIN
  SELECT 
    CASE 
      WHEN su.is_master_admin = true THEN true
      WHEN (su.feature_access ->> feature_name)::boolean = true THEN true
      WHEN (r.feature_access ->> feature_name)::boolean = true THEN true
      ELSE false
    END INTO has_access
  FROM saas_users su
  LEFT JOIN roles r ON su.role_id = r.id
  WHERE su.clerk_user_id = user_clerk_id;
  
  RETURN COALESCE(has_access, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
