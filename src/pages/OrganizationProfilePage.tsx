import React from 'react';
import { OrganizationProfile } from '@clerk/clerk-react';
import { Building, Users, Settings, FileText, Shield } from 'lucide-react';

const CustomIcon = ({ Icon }: { Icon: React.ComponentType<any> }) => (
  <Icon className="w-4 h-4" />
);

const BillingPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Billing & Subscription</h1>
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
      <div className="mb-4">
        <div className="text-sm text-gray-600">Plan: <span className="font-medium">Free Trial</span></div>
        <div className="text-sm text-gray-600">Users: <span className="font-medium">1/5</span></div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Upgrade Plan
      </button>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Organization Settings</h1>
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">White Label Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <input
              type="color"
              defaultValue="#3b82f6"
              className="w-16 h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://your-domain.com/webhooks"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrganizationProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Management</h1>
          <p className="text-gray-600">Manage your organization settings, members, and billing.</p>
        </div>
        
        <OrganizationProfile 
          routing="path"
          path="/organization-profile"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg border border-gray-200 rounded-lg",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
            }
          }}
        >
          {/* Custom Billing Page */}
          <OrganizationProfile.Page
            label="Billing"
            labelIcon={<CustomIcon Icon={FileText} />}
            url="billing"
          >
            <BillingPage />
          </OrganizationProfile.Page>

          {/* Custom Settings Page */}
          <OrganizationProfile.Page
            label="Settings"
            labelIcon={<CustomIcon Icon={Settings} />}
            url="settings"
          >
            <SettingsPage />
          </OrganizationProfile.Page>

          {/* Link to Dashboard */}
          <OrganizationProfile.Link
            label="Dashboard"
            labelIcon={<CustomIcon Icon={Building} />}
            url="/dashboard"
          />

          {/* Reorder default pages */}
          <OrganizationProfile.Page label="members" />
          <OrganizationProfile.Page label="general" />
        </OrganizationProfile>
      </div>
    </div>
  );
};

export default OrganizationProfilePage;
