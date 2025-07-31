import React, { useState } from 'react';
import { useOrganizationList } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building, Plus } from 'lucide-react';

interface CreateOrganizationModalProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({ 
  onSuccess,
  trigger,
  isOpen,
  onOpenChange
}) => {
  const { createOrganization, setActive } = useOrganizationList();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !createOrganization) return;

    setIsCreating(true);
    try {
      const org = await createOrganization({
        name: formData.name.trim(),
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      });
      
      if (org && setActive) {
        await setActive({ organization: org.id });
        onOpenChange(false);
        setFormData({ name: '', description: '' });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      alert('Failed to create organization. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Create New Organization
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Set up a new workspace for your team. You'll be the admin of this organization.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Company"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your organization"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !formData.name.trim()}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
