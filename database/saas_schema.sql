-- White-Label SaaS Database Schema
-- This extends your existing Supabase schema

-- Organizations table for multi-tenant support
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_org_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE,
    subscription_tier TEXT NOT NULL DEFAULT 'starter',
    branding_config JSONB DEFAULT '{}',
    feature_flags JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{"allowSelfSignup": false, "maxUsers": 5}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for SaaS user management
CREATE TABLE IF NOT EXISTS saas_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role_id TEXT NOT NULL DEFAULT 'org_user',
    custom_permissions JSONB DEFAULT '[]',
    feature_access JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table for permission management
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '[]',
    feature_access JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table for billing management
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    features_included JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}',
    billing_cycle TEXT DEFAULT 'monthly',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branding configurations table
CREATE TABLE IF NOT EXISTS branding_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES saas_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table for API access management
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES saas_users(id),
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage analytics table
CREATE TABLE IF NOT EXISTS usage_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES saas_users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert system roles
INSERT INTO roles (id, name, description, is_system_role, permissions, feature_access) VALUES
('master_admin', 'Master Admin', 'System administrator with full access', true, 
 '[{"resource": "*", "actions": ["*"], "scope": "system"}]',
 '{"whiteLabel": true, "aiTools": true, "analytics": true, "masterAdmin": true, "billing": true, "userManagement": true}'),
('org_admin', 'Organization Admin', 'Organization administrator', true,
 '[{"resource": "organization", "actions": ["read", "write", "admin"], "scope": "organization"}, {"resource": "users", "actions": ["read", "write", "invite"], "scope": "organization"}]',
 '{"whiteLabel": true, "aiTools": true, "analytics": true, "masterAdmin": false, "billing": true, "userManagement": true}'),
('org_user', 'Organization User', 'Standard organization user', true,
 '[{"resource": "contacts", "actions": ["read", "write"], "scope": "organization"}, {"resource": "deals", "actions": ["read", "write"], "scope": "organization"}]',
 '{"whiteLabel": false, "aiTools": true, "analytics": false, "masterAdmin": false, "billing": false, "userManagement": false}'),
('viewer', 'Viewer', 'Read-only access', true,
 '[{"resource": "*", "actions": ["read"], "scope": "organization"}]',
 '{"whiteLabel": false, "aiTools": false, "analytics": false, "masterAdmin": false, "billing": false, "userManagement": false}')
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM saas_users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Users policies
CREATE POLICY "Users can view organization members" ON saas_users
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM saas_users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Branding configurations policies
CREATE POLICY "Users can view organization branding" ON branding_configurations
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM saas_users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saas_users_updated_at BEFORE UPDATE ON saas_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_configurations_updated_at BEFORE UPDATE ON branding_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saas_users_clerk_id ON saas_users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_saas_users_org_id ON saas_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_org_id ON organizations(clerk_org_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_org_id ON usage_analytics(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at);
