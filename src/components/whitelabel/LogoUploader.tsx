import React, { useState, useRef } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Upload, X, Image, FileImage, AlertCircle, Check } from 'lucide-react';

interface LogoUploaderProps {
  className?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ className = '' }) => {
  const { brandingConfig, updateBranding } = useWhiteLabel();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'uploading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'favicon') => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles[0], type);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    setUploadStatus({ type: 'uploading', message: 'Uploading...' });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'File size must be less than 5MB' });
      return;
    }

    try {
      // Convert to base64 for preview (in real app, upload to server)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        if (type === 'logo') {
          updateBranding({ logoUrl: dataUrl });
        } else {
          updateBranding({ faviconUrl: dataUrl });
        }
        
        setUploadStatus({ type: 'success', message: `${type} uploaded successfully` });
        setTimeout(() => setUploadStatus({ type: 'idle' }), 3000);
      };
      
      reader.onerror = () => {
        setUploadStatus({ type: 'error', message: 'Failed to read file' });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleUrlUpdate = (url: string, type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      updateBranding({ logoUrl: url });
    } else {
      updateBranding({ faviconUrl: url });
    }
  };

  const removeLogo = (type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      updateBranding({ logoUrl: '' });
    } else {
      updateBranding({ faviconUrl: '' });
    }
  };

  const UploadArea: React.FC<{
    type: 'logo' | 'favicon';
    title: string;
    description: string;
    currentUrl: string;
    inputRef: React.RefObject<HTMLInputElement>;
    acceptedFormats?: string;
    recommendedSize?: string;
  }> = ({ type, title, description, currentUrl, inputRef, acceptedFormats = 'PNG, JPG, SVG', recommendedSize }) => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Image className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Logo/Favicon Display */}
        {currentUrl && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentUrl}
                  alt={`Current ${type}`}
                  className={`object-contain ${
                    type === 'logo' ? 'h-12 max-w-32' : 'h-8 w-8'
                  } border border-gray-200 rounded`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Current {type}</p>
                <p className="text-xs text-gray-500">
                  {currentUrl.startsWith('data:') ? 'Uploaded file' : 'External URL'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeLogo(type)}
              className="flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </Button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, type)}
        >
          <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your {type} here
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: {acceptedFormats}
              {recommendedSize && ` • Recommended: ${recommendedSize}`}
            </p>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
            </Button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, type)}
            className="hidden"
          />
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor={`${type}-url`} className="text-sm font-medium">
            Or enter a URL
          </Label>
          <Input
            id={`${type}-url`}
            type="url"
            placeholder={`https://example.com/${type}.png`}
            value={currentUrl.startsWith('data:') ? '' : currentUrl}
            onChange={(e) => handleUrlUpdate(e.target.value, type)}
            className="mt-1"
          />
        </div>

        {/* Upload Status */}
        {uploadStatus.type !== 'idle' && (
          <div className={`flex items-center space-x-2 p-3 rounded-md ${
            uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' :
            uploadStatus.type === 'error' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {uploadStatus.type === 'success' && <Check className="w-4 h-4" />}
            {uploadStatus.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {uploadStatus.type === 'uploading' && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span className="text-sm">{uploadStatus.message}</span>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">
            {type === 'logo' ? 'Logo Guidelines' : 'Favicon Guidelines'}
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            {type === 'logo' ? (
              <>
                <li>• Use transparent background (PNG) for best results</li>
                <li>• Recommended size: 200x60px or maintain aspect ratio</li>
                <li>• Ensure logo is readable on both light and dark backgrounds</li>
                <li>• SVG format preferred for scalability</li>
              </>
            ) : (
              <>
                <li>• Use 32x32px or 16x16px for best browser support</li>
                <li>• ICO format preferred, PNG also supported</li>
                <li>• Simple design works best at small sizes</li>
                <li>• Test visibility on browser tabs</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <UploadArea
        type="logo"
        title="Company Logo"
        description="Upload your company logo that will appear in the navigation and branding areas"
        currentUrl={brandingConfig.logoUrl}
        inputRef={logoInputRef}
        acceptedFormats="PNG, JPG, SVG"
        recommendedSize="200x60px"
      />

      <UploadArea
        type="favicon"
        title="Favicon"
        description="Upload a favicon that will appear in browser tabs and bookmarks"
        currentUrl={brandingConfig.faviconUrl}
        inputRef={faviconInputRef}
        acceptedFormats="ICO, PNG"
        recommendedSize="32x32px"
      />

      {/* Logo Preview in Context */}
      {brandingConfig.logoUrl && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Logo Preview</CardTitle>
            <CardDescription>
              See how your logo appears in different contexts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Navigation Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Navigation Bar</h4>
              <div 
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: brandingConfig.colorScheme.surface }}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={brandingConfig.logoUrl}
                    alt="Logo"
                    className="h-8 max-w-24 object-contain"
                  />
                  <span 
                    className="font-semibold text-lg"
                    style={{ color: brandingConfig.colorScheme.text.primary }}
                  >
                    {brandingConfig.companyName}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <span 
                    className="text-sm"
                    style={{ color: brandingConfig.colorScheme.text.secondary }}
                  >
                    Dashboard
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: brandingConfig.colorScheme.text.secondary }}
                  >
                    Settings
                  </span>
                </div>
              </div>
            </div>

            {/* Card Header Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Login Page</h4>
              <div 
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: brandingConfig.colorScheme.background }}
              >
                <img
                  src={brandingConfig.logoUrl}
                  alt="Logo"
                  className="h-12 max-w-48 object-contain mx-auto mb-4"
                />
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: brandingConfig.colorScheme.text.primary }}
                >
                  Welcome to {brandingConfig.companyName}
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: brandingConfig.colorScheme.text.secondary }}
                >
                  Sign in to your account
                </p>
              </div>
            </div>

            {/* Email Signature Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Email Signature</h4>
              <div className="p-4 bg-gray-50 rounded-lg border text-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={brandingConfig.logoUrl}
                    alt="Logo"
                    className="h-6 max-w-16 object-contain"
                  />
                  <div>
                    <div className="font-medium">{brandingConfig.companyName}</div>
                    <div className="text-gray-600 text-xs">{brandingConfig.tagline}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 border-t pt-2">
                  {brandingConfig.contact?.email} | {brandingConfig.contact?.phone}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogoUploader;
