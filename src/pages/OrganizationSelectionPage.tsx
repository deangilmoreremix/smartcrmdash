import React, { useState } from 'react';
import { useOrganizationList, useUser } from '@clerk/clerk-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Building, 
  Plus, 
  Users, 
  Crown,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export const OrganizationSelectionPage: React.FC = () => {
  const { user } = useUser();
  const { userMemberships, setActive, createOrganization, isLoaded } = useOrganizationList();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectOrganization = async (orgId: string) => {
    if (setActive) {
      await setActive({ organization: orgId });
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !createOrganization) return;

    setIsCreating(true);
    try {
      const org = await createOrganization({
        name: newOrgName.trim(),
        slug: newOrgName.toLowerCase().replace(/\s+/g, '-')
      });
      
      if (org && setActive) {
        await setActive({ organization: org.id });
      }
    } catch (error) {
      console.error('Error creating organization:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Select an organization to continue or create a new one
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Organization Card */}
          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setShowCreateForm(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 h-48">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Create Organization</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Start a new workspace for your team
              </p>
            </CardContent>
          </Card>

          {/* Existing Organizations */}
          {userMemberships.data?.map((membership) => (
            <Card 
              key={membership.organization.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectOrganization(membership.organization.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <span className="truncate">{membership.organization.name}</span>
                  </CardTitle>
                  {membership.role === 'admin' && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <CardDescription>
                  Role: {membership.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{membership.organization.membersCount} members</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Organization Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Organization</CardTitle>
                <CardDescription>
                  Set up a new workspace for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrganization} className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="My Company"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewOrgName('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating || !newOrgName.trim()}
                      className="flex-1"
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSelectionPage;
