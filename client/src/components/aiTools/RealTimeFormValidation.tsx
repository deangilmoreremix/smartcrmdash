import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, Mail, Phone, User, Building } from 'lucide-react';

interface ValidationResult {
  field: string;
  isValid: boolean;
  message: string;
  confidence: number;
}

interface RealTimeFormValidationProps {
  onClose?: () => void;
}

const RealTimeFormValidation: React.FC<RealTimeFormValidationProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});

  const simulateAIValidation = async (field: string, value: string): Promise<ValidationResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    let isValid = true;
    let message = '';
    let confidence = 0.95;

    switch (field) {
      case 'name':
        isValid = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
        message = isValid 
          ? 'Valid name format detected'
          : 'Names should contain only letters and spaces (min 2 characters)';
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid 
          ? 'Email format is valid and deliverable'
          : 'Invalid email format detected';
        confidence = isValid ? 0.92 : 0.98;
        break;
        
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
        isValid = phoneRegex.test(value.replace(/\D/g, ''));
        message = isValid 
          ? 'Valid phone number format'
          : 'Invalid phone number format';
        break;
        
      case 'company':
        isValid = value.length >= 2;
        message = isValid 
          ? 'Company name looks valid'
          : 'Company name should be at least 2 characters';
        break;
        
      case 'message':
        isValid = value.length >= 10;
        message = isValid 
          ? `Message is well-structured (${value.length} characters)`
          : 'Message should be at least 10 characters for better context';
        break;
        
      default:
        message = 'Field validated';
    }

    return { field, isValid, message, confidence };
  };

  const handleFieldChange = async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (value.trim().length === 0) {
      setValidationResults(prev => {
        const newResults = { ...prev };
        delete newResults[field];
        return newResults;
      });
      return;
    }

    setIsValidating(prev => ({ ...prev, [field]: true }));
    
    try {
      const result = await simulateAIValidation(field, value);
      setValidationResults(prev => ({ ...prev, [field]: result }));
    } finally {
      setIsValidating(prev => ({ ...prev, [field]: false }));
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'name': return <User className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'company': return <Building className="h-4 w-4" />;
      default: return null;
    }
  };

  const getValidationIcon = (field: string) => {
    if (isValidating[field]) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    const result = validationResults[field];
    if (!result) return null;
    
    return result.isValid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getValidationMessage = (field: string) => {
    const result = validationResults[field];
    if (!result && !isValidating[field]) return null;
    
    if (isValidating[field]) {
      return (
        <div className="text-sm text-blue-600 mt-1">
          Validating with AI...
        </div>
      );
    }
    
    return (
      <div className={`text-sm mt-1 ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
        {result.message}
        {result.confidence && (
          <span className="text-gray-500 ml-1">
            ({Math.round(result.confidence * 100)}% confident)
          </span>
        )}
      </div>
    );
  };

  const isFormValid = Object.keys(formData).every(field => {
    const result = validationResults[field];
    return !formData[field as keyof typeof formData] || (result && result.isValid);
  });

  const validFields = Object.values(validationResults).filter(r => r.isValid).length;
  const totalFields = Object.keys(validationResults).length;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-time AI Form Validation</h2>
        <p className="text-gray-600">
          Experience intelligent form validation powered by AI. Watch as your input is validated in real-time.
        </p>
        
        {totalFields > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Validation Progress</span>
              <span className="text-sm text-gray-600">{validFields}/{totalFields} fields valid</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalFields > 0 ? (validFields / totalFields) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getFieldIcon('name')}
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {getValidationIcon('name')}
            </div>
          </div>
          {getValidationMessage('name')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getFieldIcon('email')}
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {getValidationIcon('email')}
            </div>
          </div>
          {getValidationMessage('email')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getFieldIcon('phone')}
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {getValidationIcon('phone')}
            </div>
          </div>
          {getValidationMessage('phone')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getFieldIcon('company')}
            </div>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {getValidationIcon('company')}
            </div>
          </div>
          {getValidationMessage('company')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <div className="relative">
            <textarea
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your message or inquiry..."
            />
            <div className="absolute top-3 right-3">
              {getValidationIcon('message')}
            </div>
          </div>
          {getValidationMessage('message')}
        </div>

        <button
          type="button"
          disabled={!isFormValid}
          className={`w-full p-3 rounded-lg font-medium transition-colors ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default RealTimeFormValidation;