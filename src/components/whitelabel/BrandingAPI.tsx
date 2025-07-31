import React, { useState } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  Code, 
  Key, 
  Webhook, 
  Database, 
  Copy,
  Check,
  Play,
  Zap,
  Globe,
  Shield,
  Clock,
  Activity
} from 'lucide-react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  example: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'disabled';
}

export const BrandingAPI: React.FC = () => {
  const { brandingConfig, exportConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/branding/config',
      description: 'Get current branding configuration',
      example: `fetch('/api/branding/config', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})`
    },
    {
      method: 'POST',
      path: '/api/branding/config',
      description: 'Update branding configuration',
      example: `fetch('/api/branding/config', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companyName: 'New Company',
    colorScheme: {
      primary: '#ff6b35'
    }
  })
})`
    },
    {
      method: 'POST',
      path: '/api/branding/assets/upload',
      description: 'Upload logo or favicon',
      example: `const formData = new FormData();
formData.append('file', logoFile);
formData.append('type', 'logo');

fetch('/api/branding/assets/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})`
    },
    {
      method: 'GET',
      path: '/api/branding/preview',
      description: 'Generate preview URL with branding',
      example: `fetch('/api/branding/preview?theme=dark', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})`
    }
  ];

  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'wb_live_****************************',
      permissions: ['read', 'write', 'upload'],
      createdAt: '2024-01-15',
      lastUsed: '2024-03-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API',
      key: 'wb_test_****************************',
      permissions: ['read', 'write'],
      createdAt: '2024-02-01',
      lastUsed: '2024-03-09',
      status: 'active'
    }
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock: React.FC<{ code: string; language?: string; id: string }> = ({ 
    code, 
    language = 'javascript',
    id 
  }) => (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branding API</h2>
          <p className="text-gray-600">Programmatically manage white-label configurations</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Key className="w-4 h-4" />
          <span>Generate API Key</span>
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Endpoints</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center space-x-2">
            <Webhook className="w-4 h-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Testing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Get started with the Branding API in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        1
                      </div>
                      <span className="font-medium">Generate API Key</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Create an API key with the required permissions
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        2
                      </div>
                      <span className="font-medium">Make API Call</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Use the API endpoints to manage branding
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        3
                      </div>
                      <span className="font-medium">Apply Changes</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Changes are applied instantly across the platform
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Example: Get Current Branding</h4>
                  <CodeBlock
                    id="quick-start"
                    code={`// Get current branding configuration
const response = await fetch('/api/branding/config', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const branding = await response.json();
console.log(branding);`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Current Configuration</CardTitle>
                <CardDescription>
                  Your current branding configuration as JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  id="current-config"
                  language="json"
                  code={JSON.stringify({
                    companyName: brandingConfig.companyName,
                    tagline: brandingConfig.tagline,
                    colorScheme: brandingConfig.colorScheme,
                    typography: brandingConfig.typography,
                    logoUrl: brandingConfig.logoUrl || null,
                    faviconUrl: brandingConfig.faviconUrl || null
                  }, null, 2)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints">
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 
                                endpoint.method === 'POST' ? 'secondary' : 'outline'}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id={`endpoint-${index}`}
                    code={endpoint.example}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keys">
          <div className="space-y-6">
            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{key.name}</h4>
                          <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                            {key.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>Created: {key.createdAt}</span>
                            {key.lastUsed && <span>Last used: {key.lastUsed}</span>}
                          </div>
                          <div className="mt-1">
                            Permissions: {key.permissions.join(', ')}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {key.key}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.key, `key-${key.id}`)}
                          >
                            {copiedCode === `key-${key.id}` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Disable</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Key */}
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
                <CardDescription>
                  Generate a new API key with specific permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input id="key-name" placeholder="My API Key" />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {['read', 'write', 'upload', 'delete', 'admin'].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input type="checkbox" id={permission} className="rounded" />
                        <Label htmlFor={permission} className="capitalize text-sm">
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button>Generate API Key</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Receive real-time notifications when branding changes occur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Webhook */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" placeholder="https://your-app.com/webhooks/branding" />
                </div>
                <div>
                  <Label>Events</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      'branding.updated',
                      'logo.uploaded',
                      'colors.changed',
                      'config.exported',
                      'tenant.created',
                      'api.key.used'
                    ].map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <input type="checkbox" id={event} className="rounded" />
                        <Label htmlFor={event} className="text-sm font-mono">
                          {event}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button>
                  <Webhook className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </div>

              {/* Webhook Example */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-2">Example Webhook Payload</h4>
                <CodeBlock
                  id="webhook-example"
                  language="json"
                  code={`{
  "event": "branding.updated",
  "timestamp": "2024-03-10T14:30:00Z",
  "tenant_id": "tenant_123",
  "data": {
    "companyName": "New Company Name",
    "colorScheme": {
      "primary": "#ff6b35"
    },
    "changed_fields": ["companyName", "colorScheme.primary"]
  }
}`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>API Testing</CardTitle>
              <CardDescription>
                Test API endpoints directly from this interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Request */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Method</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>DELETE</option>
                    </select>
                  </div>
                  <div>
                    <Label>Endpoint</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>/api/branding/config</option>
                      <option>/api/branding/assets/upload</option>
                      <option>/api/branding/preview</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Request Body (JSON)</Label>
                  <Textarea 
                    placeholder='{"companyName": "Test Company"}' 
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                  <Button variant="outline">Clear</Button>
                </div>
              </div>

              {/* Response */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="default">200 OK</Badge>
                    <span className="text-sm text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      142ms
                    </span>
                  </div>
                  <CodeBlock
                    id="test-response"
                    language="json"
                    code={`{
  "success": true,
  "data": {
    "companyName": "Test Company",
    "colorScheme": {
      "primary": "#3b82f6"
    }
  }
}`}
                  />
                </div>
              </div>

              {/* API Status */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">API Status</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-green-900">Operational</div>
                    <div className="text-xs text-green-600">All systems go</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-blue-900">99.9% Uptime</div>
                    <div className="text-xs text-blue-600">Last 30 days</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-900">Secure</div>
                    <div className="text-xs text-gray-600">SSL encrypted</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingAPI;
