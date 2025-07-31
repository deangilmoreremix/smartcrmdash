import React from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Building2, Type, Globe } from 'lucide-react';

interface BrandingPanelProps {
  className?: string;
}

export const BrandingPanel: React.FC<BrandingPanelProps> = ({ className = '' }) => {
  const { brandingConfig, updateBranding } = useWhiteLabel();

  const fontOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'nunito', label: 'Nunito' },
    { value: 'source-sans-pro', label: 'Source Sans Pro' },
    { value: 'raleway', label: 'Raleway' },
    { value: 'ubuntu', label: 'Ubuntu' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Company Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>
            Basic information about your company that will appear throughout the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={brandingConfig.companyName}
                onChange={(e) => updateBranding({ companyName: e.target.value })}
                placeholder="Your Company Name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={brandingConfig.tagline}
                onChange={(e) => updateBranding({ tagline: e.target.value })}
                placeholder="Your company tagline"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={brandingConfig.description}
              onChange={(e) => updateBranding({ description: e.target.value })}
              placeholder="A brief description of your company and services"
              className="mt-1 h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={brandingConfig.website}
                onChange={(e) => updateBranding({ website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={brandingConfig.supportEmail}
                onChange={(e) => updateBranding({ supportEmail: e.target.value })}
                placeholder="support@yourcompany.com"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Type className="w-5 h-5" />
            <span>Typography</span>
          </CardTitle>
          <CardDescription>
            Choose fonts that match your brand identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryFont">Primary Font</Label>
              <Select 
                value={brandingConfig.typography.primaryFont} 
                onValueChange={(value) => updateBranding({ 
                  typography: { 
                    ...brandingConfig.typography, 
                    primaryFont: value 
                  }
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select primary font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="secondaryFont">Secondary Font</Label>
              <Select 
                value={brandingConfig.typography.secondaryFont} 
                onValueChange={(value) => updateBranding({ 
                  typography: { 
                    ...brandingConfig.typography, 
                    secondaryFont: value 
                  }
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select secondary font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Font Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Font Preview</h4>
            <div className="space-y-2">
              <div 
                style={{ fontFamily: brandingConfig.typography.primaryFont }}
                className="text-2xl font-bold text-gray-900"
              >
                {brandingConfig.companyName || 'Your Company Name'}
              </div>
              <div 
                style={{ fontFamily: brandingConfig.typography.secondaryFont }}
                className="text-base text-gray-600"
              >
                {brandingConfig.tagline || 'Your company tagline appears here'}
              </div>
              <div 
                style={{ fontFamily: brandingConfig.typography.primaryFont }}
                className="text-sm text-gray-500"
              >
                This is how regular content will appear with your selected fonts.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>
            Contact details that will appear in footers and contact pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={brandingConfig.contact?.phone || ''}
                onChange={(e) => updateBranding({ 
                  contact: { 
                    ...brandingConfig.contact, 
                    phone: e.target.value 
                  }
                })}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={brandingConfig.contact?.email || ''}
                onChange={(e) => updateBranding({ 
                  contact: { 
                    ...brandingConfig.contact, 
                    email: e.target.value 
                  }
                })}
                placeholder="contact@yourcompany.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              value={brandingConfig.contact?.address || ''}
              onChange={(e) => updateBranding({ 
                contact: { 
                  ...brandingConfig.contact, 
                  address: e.target.value 
                }
              })}
              placeholder="123 Business St, City, State 12345"
              className="mt-1 h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={brandingConfig.social?.facebook || ''}
                onChange={(e) => updateBranding({ 
                  social: { 
                    ...brandingConfig.social, 
                    facebook: e.target.value 
                  }
                })}
                placeholder="https://facebook.com/yourcompany"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                type="url"
                value={brandingConfig.social?.twitter || ''}
                onChange={(e) => updateBranding({ 
                  social: { 
                    ...brandingConfig.social, 
                    twitter: e.target.value 
                  }
                })}
                placeholder="https://twitter.com/yourcompany"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={brandingConfig.social?.linkedin || ''}
                onChange={(e) => updateBranding({ 
                  social: { 
                    ...brandingConfig.social, 
                    linkedin: e.target.value 
                  }
                })}
                placeholder="https://linkedin.com/company/yourcompany"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandingPanel;
