import React, { useState } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  Users, 
  Plus, 
  Settings, 
  Globe, 
  Building2,
  Shield,
  Copy,
  Check,
  Edit,
  Trash2,
  Crown,
  UserCheck
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending';
  users: number;
  branding: {
    companyName: string;
    primaryColor: string;
    logoUrl?: string;
  };
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
}

interface TenantInvite {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'accepted';
  sentAt: string;
}

export const MultiTenantManager: React.FC = () => {
  const { brandingConfig, exportConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('tenants');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [showNewTenantForm, setShowNewTenantForm] = useState(false);

  // Mock data - in real app, this would come from API
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      domain: 'acme.smartcrm.com',
      status: 'active',
      users: 25,
      branding: {
        companyName: 'Acme Corp',
        primaryColor: '#ff6b35',
        logoUrl: 'https://via.placeholder.com/100x40/ff6b35/white?text=ACME'
      },
      plan: 'enterprise',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      domain: 'techstart.smartcrm.com',
      status: 'active',
      users: 12,
      branding: {
        companyName: 'TechStart',
        primaryColor: '#4c51bf',
      },
      plan: 'pro',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Global Solutions',
      domain: 'global.smartcrm.com',
      status: 'pending',
      users: 0,
      branding: {
        companyName: 'Global Solutions',
        primaryColor: '#10b981',
      },
      plan: 'basic',
      createdAt: '2024-03-10'
    }
  ]);

  const [invites] = useState<TenantInvite[]>([
    {
      id: '1',
      email: 'admin@acme.com',
      role: 'admin',
      status: 'accepted',
      sentAt: '2024-01-15'
    },
    {
      id: '2',
      email: 'user@techstart.com',
      role: 'editor',
      status: 'pending',
      sentAt: '2024-03-01'
    }
  ]);

  const copyBrandingToTenant = (tenantId: string) => {
    const config = exportConfig();
    // In real app, would send to API
    console.log(`Copying branding to tenant ${tenantId}:`, config);
  };

  const TenantCard: React.FC<{ tenant: Tenant }> = ({ tenant }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {tenant.branding.logoUrl ? (
              <img 
                src={tenant.branding.logoUrl} 
                alt={`${tenant.name} logo`}
                className="w-10 h-10 object-contain rounded"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: tenant.branding.primaryColor }}
              >
                {tenant.branding.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
              <p className="text-sm text-gray-500">{tenant.domain}</p>
            </div>
          </div>
          <Badge 
            variant={tenant.status === 'active' ? 'default' : 
                    tenant.status === 'pending' ? 'secondary' : 'outline'}
          >
            {tenant.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Users:</span>
            <div className="font-medium">{tenant.users}</div>
          </div>
          <div>
            <span className="text-gray-500">Plan:</span>
            <div className="font-medium capitalize flex items-center">
              {tenant.plan}
              {tenant.plan === 'enterprise' && <Crown className="w-3 h-3 ml-1 text-yellow-500" />}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <div className="font-medium">{tenant.createdAt}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyBrandingToTenant(tenant.id)}
            className="flex items-center space-x-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Branding</span>
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Globe className="w-3 h-3 mr-1" />
            Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const NewTenantForm: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tenant</CardTitle>
        <CardDescription>
          Set up a new white-label instance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tenant-name">Organization Name</Label>
            <Input id="tenant-name" placeholder="Acme Corporation" />
          </div>
          <div>
            <Label htmlFor="tenant-domain">Subdomain</Label>
            <div className="flex">
              <Input id="tenant-domain" placeholder="acme" className="rounded-r-none" />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                .smartcrm.com
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tenant-plan">Plan</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input id="admin-email" type="email" placeholder="admin@acme.com" />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <input type="checkbox" id="copy-branding" className="rounded" />
          <Label htmlFor="copy-branding" className="text-sm">
            Copy current branding configuration to new tenant
          </Label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button>Create Tenant</Button>
          <Button variant="outline" onClick={() => setShowNewTenantForm(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Tenant Management</h2>
          <p className="text-gray-600">Manage white-label instances and organizations</p>
        </div>
        <Button 
          onClick={() => setShowNewTenantForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Tenant</span>
        </Button>
      </div>

      {showNewTenantForm && <NewTenantForm />}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Tenants</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants">
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">{tenants.length}</div>
                  <div className="text-sm text-gray-600">Total Tenants</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {tenants.filter(t => t.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {tenants.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {tenants.reduce((sum, t) => sum + t.users, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
            </div>

            {/* Tenant List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tenants.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users across all tenant organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Invites */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pending Invitations</h4>
                  <div className="space-y-2">
                    {invites.filter(invite => invite.status === 'pending').map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <UserCheck className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium text-sm">{invite.email}</div>
                            <div className="text-xs text-gray-500">Role: {invite.role} • Sent: {invite.sentAt}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Resend</Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invite New User */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Invite New User</h4>
                  <div className="flex space-x-3">
                    <Input placeholder="user@company.com" className="flex-1" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Send Invite</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>
                Configure role-based access control for white-label features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Admin', 'Editor', 'Viewer'].map((role) => (
                  <div key={role} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{role} Permissions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        'Edit Branding',
                        'Manage Colors',
                        'Upload Assets',
                        'Export Config',
                        'View Analytics',
                        'Manage Users',
                        'API Access',
                        'Delete Tenant'
                      ].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            defaultChecked={
                              role === 'Admin' ? true :
                              role === 'Editor' ? !permission.includes('Delete') && !permission.includes('Manage Users') :
                              permission === 'View Analytics'
                            }
                            className="rounded"
                          />
                          <label className="text-sm text-gray-700">{permission}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Settings</CardTitle>
                <CardDescription>
                  Configure system-wide multi-tenant settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Auto-provision Subdomains</div>
                    <div className="text-xs text-gray-500">Automatically create subdomains for new tenants</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Require Admin Approval</div>
                    <div className="text-xs text-gray-500">New tenants require admin approval before activation</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Enable Custom Domains</div>
                    <div className="text-xs text-gray-500">Allow tenants to use custom domains</div>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding Defaults</CardTitle>
                <CardDescription>
                  Set default branding for new tenants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Use current branding as template</span>
                  <Button 
                    variant="outline"
                    onClick={() => copyBrandingToTenant('default')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Set as Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiTenantManager;
