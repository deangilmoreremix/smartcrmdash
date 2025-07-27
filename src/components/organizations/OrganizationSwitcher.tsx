import React, { useState } from 'react';
import { useOrganization, useOrganizationList } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Building, ChevronDown, Plus, Users } from 'lucide-react';
import { CreateOrganizationModal } from './CreateOrganizationModal';

export const OrganizationSwitcher: React.FC = () => {
  const { organization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectOrganization = async (orgId: string) => {
    if (setActive) {
      await setActive({ organization: orgId });
      setIsDropdownOpen(false);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Organization
        </Button>
        <CreateOrganizationModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={() => {
            // Organization will be auto-selected after creation
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span className="truncate">{organization.name}</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-2 py-1">
              Your Organizations
            </div>
            
            {userMemberships.data?.map((membership) => (
              <button
                key={membership.organization.id}
                onClick={() => handleSelectOrganization(membership.organization.id)}
                className={`w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                  membership.organization.id === organization.id ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <Building className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {membership.organization.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {membership.role} • {membership.organization.membersCount} members
                  </div>
                </div>
              </button>
            ))}
            
            <hr className="my-2" />
            
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-center gap-2 text-blue-600"
            >
              <Plus className="w-4 h-4" />
              Create Organization
            </button>
          </div>
        </div>
      )}

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => setIsDropdownOpen(false)}
      />

      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
