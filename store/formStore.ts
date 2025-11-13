import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient';

export type FormField = {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
};

export type FormTemplate = {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  submissions: number;
  lastUpdated: Date;
  userId: string;
  publicURL?: string;
  isActive: boolean;
  totalViews?: number;
  conversionRate?: number;
};

export type FormSubmission = {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ip?: string;
  referrer?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

interface FormState {
  forms: Record<string, FormTemplate>;
  submissions: Record<string, FormSubmission[]>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchForms: () => Promise<void>;
  fetchSubmissions: (formId: string) => Promise<void>;
  createForm: (form: Partial<FormTemplate>) => Promise<void>;
  updateForm: (id: string, form: Partial<FormTemplate>) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  getFormSubmissions: (formId: string) => FormSubmission[];
  submitFormResponse: (formId: string, data: Record<string, any>) => Promise<void>;
  getPublicFormUrl: (formId: string) => string;
  toggleFormActive: (formId: string, isActive: boolean) => Promise<void>;
}

// Helper function to generate a shareable URL for a form
const generatePublicUrl = (formId: string) => {
  // In a real implementation, this would generate a URL through a URL shortener service
  // Or use the public URL from your hosting provider
  return `https://forms.example.com/${formId}`;
};

export const useFormStore = create<FormState>((set, get) => ({
  forms: {
    'form-1': {
      id: 'form-1',
      name: 'Contact Request Form',
      description: 'Generic contact form for website leads',
      fields: [
        { id: 'f1', type: 'text', label: 'Full Name', required: true },
        { id: 'f2', type: 'email', label: 'Email Address', required: true },
        { id: 'f3', type: 'phone', label: 'Phone Number', required: false },
        { id: 'f4', type: 'select', label: 'Inquiry Type', required: true, options: ['Sales', 'Support', 'Partnership', 'Other'] },
        { id: 'f5', type: 'textarea', label: 'Message', required: true }
      ],
      submissions: 142,
      lastUpdated: new Date('2025-05-15'),
      userId: 'demo-user-123',
      publicURL: 'https://forms.example.com/form-1',
      isActive: true,
      totalViews: 350,
      conversionRate: 40.6
    },
    'form-2': {
      id: 'form-2',
      name: 'Customer Satisfaction Survey',
      description: 'Post-purchase survey for product feedback',
      fields: [
        { id: 'f1', type: 'text', label: 'Full Name', required: false },
        { id: 'f2', type: 'email', label: 'Email Address', required: true },
        { id: 'f3', type: 'radio', label: 'How would you rate our service?', required: true, options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'] },
        { id: 'f4', type: 'checkbox', label: 'Which features do you use most?', required: false, options: ['Reports', 'Automation', 'API', 'Mobile App', 'Analytics'] },
        { id: 'f5', type: 'textarea', label: 'Additional Feedback', required: false }
      ],
      submissions: 78,
      lastUpdated: new Date('2025-05-20'),
      userId: 'demo-user-123',
      publicURL: 'https://forms.example.com/form-2',
      isActive: true,
      totalViews: 200,
      conversionRate: 39.0
    }
  },
  submissions: {
    'form-1': [
      {
        id: 'sub-1',
        formId: 'form-1',
        data: {
          'Full Name': 'John Doe',
          'Email Address': 'john.doe@example.com',
          'Phone Number': '(555) 123-4567',
          'Inquiry Type': 'Sales',
          'Message': 'I would like to learn more about your enterprise plan.'
        },
        submittedAt: new Date('2025-06-15T14:32:00'),
        ip: '192.168.1.1',
        referrer: 'https://google.com',
        contact: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567'
        }
      },
      {
        id: 'sub-2',
        formId: 'form-1',
        data: {
          'Full Name': 'Jane Smith',
          'Email Address': 'jane.smith@example.com',
          'Phone Number': '(555) 987-6543',
          'Inquiry Type': 'Support',
          'Message': 'I need help with configuring my account.'
        },
        submittedAt: new Date('2025-06-14T10:15:00'),
        ip: '192.168.1.2',
        referrer: 'https://example.com',
        contact: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543'
        }
      }
    ],
    'form-2': [
      {
        id: 'sub-3',
        formId: 'form-2',
        data: {
          'Email Address': 'robert@example.com',
          'How would you rate our service?': 'Good',
          'Which features do you use most?': ['Reports', 'Mobile App'],
          'Additional Feedback': 'Great product overall, but the mobile app could use some improvements.'
        },
        submittedAt: new Date('2025-06-12T09:45:00'),
        ip: '192.168.1.3',
        referrer: 'https://example.com/feedback',
        contact: {
          email: 'robert@example.com'
        }
      }
    ]
  },
  isLoading: false,
  error: null,
  
  fetchForms: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real implementation, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('forms')
      //   .select('*')
      //   .eq('user_id', get().currentUser.id);
      
      // if (error) throw error;
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would set forms from the API response
      set({ isLoading: false });
    } catch (err) {
      console.error('Error fetching forms:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch forms' 
      });
    }
  },
  
  fetchSubmissions: async (formId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real implementation, this would be a Supabase query
      // const { data, error } = await supabase
      //   .from('form_submissions')
      //   .select('*')
      //   .eq('form_id', formId);
      
      // if (error) throw error;
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would update submissions from the API response
      set({ isLoading: false });
    } catch (err) {
      console.error('Error fetching submissions:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch submissions' 
      });
    }
  },
  
  createForm: async (formData: Partial<FormTemplate>) => {
    set({ isLoading: true, error: null });
    
    try {
      const formId = formData.id || `form-${uuidv4()}`;
      const newForm: FormTemplate = {
        id: formId,
        name: formData.name || 'Untitled Form',
        description: formData.description || '',
        fields: formData.fields || [],
        submissions: 0,
        lastUpdated: new Date(),
        userId: 'demo-user-123', // In a real app, this would be the current user's ID
        publicURL: generatePublicUrl(formId),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        totalViews: 0,
        conversionRate: 0
      };
      
      // In a real implementation, this would save to Supabase
      // const { data, error } = await supabase
      //   .from('forms')
      //   .insert([newForm]);
      
      // if (error) throw error;
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const { forms } = get();
      set({ 
        forms: { ...forms, [formId]: newForm },
        isLoading: false 
      });
    } catch (err) {
      console.error('Error creating form:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to create form' 
      });
    }
  },
  
  updateForm: async (id: string, formData: Partial<FormTemplate>) => {
    set({ isLoading: true, error: null });
    
    try {
      const { forms } = get();
      const existingForm = forms[id];
      
      if (!existingForm) {
        throw new Error(`Form with id ${id} not found`);
      }
      
      const updatedForm: FormTemplate = {
        ...existingForm,
        ...formData,
        lastUpdated: new Date()
      };
      
      // In a real implementation, this would save to Supabase
      // const { error } = await supabase
      //   .from('forms')
      //   .update(updatedForm)
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      set({ 
        forms: { ...forms, [id]: updatedForm },
        isLoading: false 
      });
    } catch (err) {
      console.error('Error updating form:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to update form' 
      });
    }
  },
  
  deleteForm: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real implementation, this would delete from Supabase
      // const { error } = await supabase
      //   .from('forms')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const { forms } = get();
      const { [id]: deletedForm, ...remainingForms } = forms;
      
      set({ 
        forms: remainingForms,
        isLoading: false 
      });
    } catch (err) {
      console.error('Error deleting form:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to delete form' 
      });
    }
  },
  
  getFormSubmissions: (formId: string) => {
    const { submissions } = get();
    return submissions[formId] || [];
  },
  
  submitFormResponse: async (formId: string, data: Record<string, any>) => {
    set({ isLoading: true, error: null });
    
    try {
      const { forms, submissions } = get();
      const form = forms[formId];
      
      if (!form) {
        throw new Error(`Form with id ${formId} not found`);
      }
      
      const submissionId = `sub-${uuidv4()}`;
      const newSubmission: FormSubmission = {
        id: submissionId,
        formId,
        data,
        submittedAt: new Date(),
        ip: '192.168.1.1', // In a real app, this would be the actual IP
        referrer: 'https://example.com', // In a real app, this would be the actual referrer
        contact: {
          name: data['Full Name'] || data['Name'],
          email: data['Email Address'] || data['Email'],
          phone: data['Phone Number'] || data['Phone']
        }
      };
      
      // In a real implementation, this would save to Supabase
      // const { error } = await supabase
      //   .from('form_submissions')
      //   .insert([newSubmission]);
      
      // if (error) throw error;
      
      // Update form submissions count
      const updatedForm: FormTemplate = {
        ...form,
        submissions: form.submissions + 1,
        lastUpdated: new Date()
      };
      
      // Calculate new conversion rate
      if (form.totalViews) {
        const newConversionRate = ((form.submissions + 1) / form.totalViews) * 100;
        updatedForm.conversionRate = parseFloat(newConversionRate.toFixed(1));
      }
      
      // For the demo, we just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const formSubmissions = submissions[formId] || [];
      
      set({ 
        forms: { ...forms, [formId]: updatedForm },
        submissions: { ...submissions, [formId]: [...formSubmissions, newSubmission] },
        isLoading: false 
      });
    } catch (err) {
      console.error('Error submitting form response:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to submit form response' 
      });
    }
  },
  
  getPublicFormUrl: (formId: string) => {
    const { forms } = get();
    const form = forms[formId];
    
    if (!form) {
      return '';
    }
    
    return form.publicURL || generatePublicUrl(formId);
  },
  
  toggleFormActive: async (formId: string, isActive: boolean) => {
    const { forms } = get();
    const form = forms[formId];
    
    if (!form) {
      return;
    }
    
    await get().updateForm(formId, { isActive });
  }
}));