import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Copy, 
  RefreshCw, 
  Zap,
  CheckCircle,
  AlertCircle,
  Wand2,
  Plus,
  X
} from 'lucide-react';
import { useAPIStore } from '../../store/apiStore';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface AutoFormCompleterProps {
  isDark?: boolean;
}

export function AutoFormCompleter({ isDark = false }: AutoFormCompleterProps) {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
    { id: '2', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true },
    { id: '3', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
    { id: '4', label: 'Message', type: 'textarea', placeholder: 'Enter your message' }
  ]);
  
  const [formTitle, setFormTitle] = useState('Contact Form');
  const [formDescription, setFormDescription] = useState('Please fill out the form below and we\'ll get back to you soon.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Record<string, string>>({});
  const [completionPrompt, setCompletionPrompt] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const { openaiApiKey, geminiApiKey } = useAPIStore();

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' }
  ];

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter value',
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const generateFormData = async () => {
    if (!completionPrompt.trim()) return;

    setIsGenerating(true);
    setSuccess(false);

    try {
      // Simulate AI form completion (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData: Record<string, string> = {
        '1': 'John Smith',
        '2': 'john.smith@example.com',
        '3': '+1 (555) 123-4567',
        '4': 'I am interested in learning more about your services and would like to schedule a consultation.'
      };

      // Add more fields based on the prompt
      formFields.forEach(field => {
        if (!mockData[field.id]) {
          switch (field.type) {
            case 'text':
              mockData[field.id] = `Sample ${field.label.toLowerCase()}`;
              break;
            case 'email':
              mockData[field.id] = 'sample@example.com';
              break;
            case 'tel':
              mockData[field.id] = '+1 (555) 000-0000';
              break;
            case 'textarea':
              mockData[field.id] = `This is a sample response for ${field.label.toLowerCase()} based on the prompt: "${completionPrompt}"`;
              break;
            case 'select':
              mockData[field.id] = field.options?.[0] || 'Option 1';
              break;
            case 'checkbox':
              mockData[field.id] = 'true';
              break;
            case 'radio':
              mockData[field.id] = field.options?.[0] || 'Option 1';
              break;
          }
        }
      });

      setGeneratedData(mockData);
      setSuccess(true);
    } catch (error) {
      console.error('Error generating form data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const formDataText = Object.entries(generatedData)
      .map(([fieldId, value]) => {
        const field = formFields.find(f => f.id === fieldId);
        return `${field?.label}: ${value}`;
      })
      .join('\n');
    
    navigator.clipboard.writeText(formDataText);
  };

  const handleDownload = () => {
    const formDataText = Object.entries(generatedData)
      .map(([fieldId, value]) => {
        const field = formFields.find(f => f.id === fieldId);
        return `${field?.label}: ${value}`;
      })
      .join('\n');
    
    const blob = new Blob([formDataText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-data.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderField = (field: FormField, isPreview: boolean = false) => {
    const baseClasses = `w-full p-3 rounded-lg border ${
      isDark 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

    const value = generatedData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.id}
            placeholder={field.placeholder}
            className={`${baseClasses} resize-none`}
            rows={3}
            value={value}
            readOnly={isPreview}
            onChange={(e) => !isPreview && setGeneratedData(prev => ({ ...prev, [field.id]: e.target.value }))}
          />
        );
      case 'select':
        return (
          <select
            key={field.id}
            className={baseClasses}
            value={value}
            disabled={isPreview}
            onChange={(e) => !isPreview && setGeneratedData(prev => ({ ...prev, [field.id]: e.target.value }))}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="checkbox"
              checked={value === 'true'}
              disabled={isPreview}
              onChange={(e) => !isPreview && setGeneratedData(prev => ({ ...prev, [field.id]: e.target.checked.toString() }))}
              className="mr-2"
            />
            <span>{field.label}</span>
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  disabled={isPreview}
                  onChange={(e) => !isPreview && setGeneratedData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="mr-2"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <input
            key={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            value={value}
            readOnly={isPreview}
            onChange={(e) => !isPreview && setGeneratedData(prev => ({ ...prev, [field.id]: e.target.value }))}
          />
        );
    }
  };

  const hasRequiredApiKey = () => {
    return openaiApiKey || geminiApiKey;
  };

  return (
    <motion.div 
      className={`max-w-6xl mx-auto p-4 sm:p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 text-center sm:text-left"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mx-auto sm:mx-0 sm:mr-4 mb-4 sm:mb-0">
          <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Auto Form Completer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            AI-powered intelligent form completion and data generation
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Form Builder */}
        <motion.div 
          className={`p-4 sm:p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Form Configuration</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={addField}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!showPreview ? (
            <div className="space-y-4">
              {/* Form Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Form Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Form Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Form Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className={`w-full p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium mb-3">Form Fields</label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {formFields.map((field) => (
                    <div key={field.id} className={`p-3 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className={`text-sm font-medium bg-transparent border-none p-0 focus:ring-0 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        />
                        <button
                          onClick={() => removeField(field.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as FormField['type'] })}
                          className={`text-xs p-2 rounded border ${
                            isDark 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Placeholder text"
                          className={`text-xs p-2 rounded border ${
                            isDark 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      {(field.type === 'select' || field.type === 'radio') && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Options (comma separated)"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(field.id, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                            })}
                            className={`w-full text-xs p-2 rounded border ${
                              isDark 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Form Preview
            <div className={`p-4 rounded-lg border ${
              isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className="text-lg font-semibold mb-2">{formTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{formDescription}</p>
              <div className="space-y-4">
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field, true)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Prompt */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Completion Context</label>
            <textarea
              value={completionPrompt}
              onChange={(e) => setCompletionPrompt(e.target.value)}
              rows={3}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Describe the context or persona for form completion (e.g., 'Complete as a potential customer interested in premium services')"
            />
          </div>

          {!hasRequiredApiKey() && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-yellow-800 text-sm">
                  Please configure your API key in the settings to use AI form completion.
                </span>
              </div>
            </div>
          )}

          <button
            onClick={generateFormData}
            disabled={!completionPrompt.trim() || isGenerating || !hasRequiredApiKey()}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating Form Data...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Form Data
              </>
            )}
          </button>

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">Form data generated successfully!</span>
            </div>
          )}
        </motion.div>

        {/* Generated Form */}
        <motion.div 
          className={`p-4 sm:p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Completed Form</h2>
            {Object.keys(generatedData).length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            )}
          </div>

          {Object.keys(generatedData).length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{formTitle}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formDescription}</p>
              {formFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center rounded-lg border-2 border-dashed ${
              isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
            }`}>
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your completed form will appear here</p>
              <p className="text-sm mt-2">Configure your form and add a completion context to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
