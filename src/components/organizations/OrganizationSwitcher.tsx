import React from 'react';
import { OrganizationSwitcher as ClerkOrganizationSwitcher } from '@clerk/clerk-react';
import { Building, Settings } from 'lucide-react';

const CustomIcon = ({ Icon }: { Icon: React.ComponentType<any> }) => (
  <Icon className="w-4 h-4" />
);

export const OrganizationSwitcher: React.FC = () => {
  return (
    <ClerkOrganizationSwitcher
      appearance={{
        elements: {
          rootBox: "flex items-center",
          organizationSwitcherTrigger: "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors",
          organizationSwitcherTriggerIcon: "w-4 h-4",
          organizationPreview: "flex items-center gap-2",
          organizationPreviewAvatarBox: "w-6 h-6",
          organizationPreviewTextContainer: "flex flex-col",
          organizationPreviewMainIdentifier: "font-medium text-sm",
          organizationPreviewSecondaryIdentifier: "text-xs text-gray-500",
        },
        variables: {
          colorPrimary: '#3b82f6',
        }
      }}
      organizationProfileMode="navigation"
      organizationProfileUrl="/organization-profile"
      createOrganizationMode="navigation"
      createOrganizationUrl="/organizations"
    >
      {/* Custom Settings Page in Organization Profile */}
      <ClerkOrganizationSwitcher.OrganizationProfilePage
        label="Settings"
        labelIcon={<CustomIcon Icon={Settings} />}
        url="settings"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Organization Settings</h1>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">White Label Configuration</h2>
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
                    Primary Brand Color
                  </label>
                  <input
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-16 h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Company Name"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClerkOrganizationSwitcher.OrganizationProfilePage>

      {/* Link to Dashboard */}
      <ClerkOrganizationSwitcher.OrganizationProfileLink
        label="Dashboard"
        labelIcon={<CustomIcon Icon={Building} />}
        url="/dashboard"
      />
    </ClerkOrganizationSwitcher>
  );
};
