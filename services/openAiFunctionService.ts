import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';
import { Deal, Contact } from '../types';

interface CrmFunctions {
  searchDeals: (params: {query: string, status?: string, minValue?: number, maxValue?: number}) => Promise<Deal[]>;
  searchContacts: (params: {query: string, status?: string, industry?: string}) => Promise<Contact[]>;
  createTask: (params: {title: string, description?: string, dueDate?: string, priority?: string, relatedToType?: string, relatedToId?: string}) => Promise<{id: string, success: boolean}>;
  scheduleFollowUp: (params: {contactId: string, date: string, meetingType?: string, notes?: string}) => Promise<{id: string, success: boolean}>;
  getContactInfo: (params: {contactId: string}) => Promise<Contact | null>;
  getDealInfo: (params: {dealId: string}) => Promise<Deal | null>;
}

// Mock implementation of CRM functions for the demo
const crmFunctions: CrmFunctions = {
  searchDeals: async (params) => {
    console.log('Searching deals with params:', params);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock deals
    return [
      {
        id: 'deal-1',
        title: 'Enterprise License',
        value: 75000,
        stage: 'qualification',
        company: 'Acme Inc',
        contact: 'John Doe',
        contactId: 'contact-1',
        dueDate: new Date('2025-07-15'),
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-06-01'),
        probability: 10,
        daysInStage: 5,
        priority: 'high'
      },
      {
        id: 'deal-2',
        title: 'Software Renewal',
        value: 45000,
        stage: 'proposal',
        company: 'Globex Corp',
        contact: 'Jane Smith',
        contactId: 'contact-2',
        dueDate: new Date('2025-06-30'),
        createdAt: new Date('2025-05-15'),
        updatedAt: new Date('2025-06-01'),
        probability: 50,
        daysInStage: 3,
        priority: 'medium'
      }
    ].filter(deal => {
      // Apply filters
      if (params.status && deal.stage !== params.status) return false;
      if (params.minValue && deal.value < params.minValue) return false;
      if (params.maxValue && deal.value > params.maxValue) return false;
      if (params.query && !deal.title.toLowerCase().includes(params.query.toLowerCase())) return false;
      return true;
    });
  },
  
  searchContacts: async (params) => {
    console.log('Searching contacts with params:', params);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock contacts
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        company: 'Acme Inc',
        position: 'CTO',
        status: 'customer',
        score: 85,
        lastContact: new Date('2023-06-15'),
        notes: 'Interested in enterprise plan',
        industry: 'Technology',
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@globex.com',
        phone: '(555) 987-6543',
        company: 'Globex Corp',
        position: 'Marketing Director',
        status: 'lead',
        score: 65,
        lastContact: new Date('2023-05-28'),
        notes: 'Follow up on marketing proposal',
        industry: 'Manufacturing',
        location: 'Chicago, IL'
      }
    ].filter(contact => {
      // Apply filters
      if (params.status && contact.status !== params.status) return false;
      if (params.industry && contact.industry !== params.industry) return false;
      if (params.query && !contact.name.toLowerCase().includes(params.query.toLowerCase())) return false;
      return true;
    });
  },
  
  createTask: async (params) => {
    console.log('Creating task with params:', params);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: `task-${Date.now()}`,
      success: true
    };
  },
  
  scheduleFollowUp: async (params) => {
    console.log('Scheduling follow-up with params:', params);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response
    return {
      id: `appointment-${Date.now()}`,
      success: true
    };
  },
  
  getContactInfo: async (params) => {
    console.log('Getting contact info with ID:', params.contactId);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock contact or null if not found
    const contacts = {
      '1': {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        company: 'Acme Inc',
        position: 'CTO',
        status: 'customer',
        score: 85,
        lastContact: new Date('2023-06-15'),
        notes: 'Interested in enterprise plan',
        industry: 'Technology',
        location: 'San Francisco, CA'
      },
      '2': {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@globex.com',
        phone: '(555) 987-6543',
        company: 'Globex Corp',
        position: 'Marketing Director',
        status: 'lead',
        score: 65,
        lastContact: new Date('2023-05-28'),
        notes: 'Follow up on marketing proposal',
        industry: 'Manufacturing',
        location: 'Chicago, IL'
      }
    };
    
    return contacts[params.contactId] || null;
  },
  
  getDealInfo: async (params) => {
    console.log('Getting deal info with ID:', params.dealId);
    // Mock implementation - would connect to actual API in production
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock deal or null if not found
    const deals = {
      'deal-1': {
        id: 'deal-1',
        title: 'Enterprise License',
        value: 75000,
        stage: 'qualification',
        company: 'Acme Inc',
        contact: 'John Doe',
        contactId: 'contact-1',
        dueDate: new Date('2025-07-15'),
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-06-01'),
        probability: 10,
        daysInStage: 5,
        priority: 'high'
      },
      'deal-2': {
        id: 'deal-2',
        title: 'Software Renewal',
        value: 45000,
        stage: 'proposal',
        company: 'Globex Corp',
        contact: 'Jane Smith',
        contactId: 'contact-2',
        dueDate: new Date('2025-06-30'),
        createdAt: new Date('2025-05-15'),
        updatedAt: new Date('2025-06-01'),
        probability: 50,
        daysInStage: 3,
        priority: 'medium'
      }
    };
    
    return deals[params.dealId] || null;
  }
};

// Define function schemas for OpenAI function calling
const functionSchemas = [
  {
    name: 'searchDeals',
    description: 'Search for deals in the CRM system based on various criteria',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find matching deals'
        },
        status: {
          type: 'string',
          enum: ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
          description: 'Filter by deal status'
        },
        minValue: {
          type: 'number',
          description: 'Minimum deal value'
        },
        maxValue: {
          type: 'number',
          description: 'Maximum deal value'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'searchContacts',
    description: 'Search for contacts in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find matching contacts'
        },
        status: {
          type: 'string',
          enum: ['lead', 'prospect', 'customer', 'churned'],
          description: 'Filter by contact status'
        },
        industry: {
          type: 'string',
          description: 'Filter by industry'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'createTask',
    description: 'Create a new task in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Task title'
        },
        description: {
          type: 'string',
          description: 'Task description'
        },
        dueDate: {
          type: 'string',
          description: 'Due date for the task (ISO format)'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Task priority'
        },
        relatedToType: {
          type: 'string',
          enum: ['contact', 'deal'],
          description: 'Type of entity this task is related to'
        },
        relatedToId: {
          type: 'string',
          description: 'ID of the entity this task is related to'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'scheduleFollowUp',
    description: 'Schedule a follow-up with a contact',
    parameters: {
      type: 'object',
      properties: {
        contactId: {
          type: 'string',
          description: 'ID of the contact to follow up with'
        },
        date: {
          type: 'string',
          description: 'Date and time for the follow-up (ISO format)'
        },
        meetingType: {
          type: 'string',
          enum: ['call', 'video', 'in-person'],
          description: 'Type of meeting'
        },
        notes: {
          type: 'string',
          description: 'Notes for the follow-up'
        }
      },
      required: ['contactId', 'date']
    }
  },
  {
    name: 'getContactInfo',
    description: 'Get detailed information about a specific contact',
    parameters: {
      type: 'object',
      properties: {
        contactId: {
          type: 'string',
          description: 'ID of the contact to get information for'
        }
      },
      required: ['contactId']
    }
  },
  {
    name: 'getDealInfo',
    description: 'Get detailed information about a specific deal',
    parameters: {
      type: 'object',
      properties: {
        dealId: {
          type: 'string',
          description: 'ID of the deal to get information for'
        }
      },
      required: ['dealId']
    }
  }
];

export const useOpenAIFunctions = () => {
  const { apiKeys } = useApiStore();
  
  const getClient = () => {
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not set');
    }
    
    return new OpenAI({
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true // Note: In production, proxy requests through a backend
    });
  };
  
  // Execute function calls from OpenAI
  const executeFunction = async (functionName: string, args: any) => {
    if (typeof crmFunctions[functionName as keyof CrmFunctions] === 'function') {
      // Convert arguments if needed (e.g., parse dates)
      try {
        return await crmFunctions[functionName as keyof CrmFunctions](args);
      } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        throw error;
      }
    } else {
      throw new Error(`Function ${functionName} not implemented`);
    }
  };
  
  // Chat with function calling capabilities
  const chatWithFunctions = async (
    messages: { role: 'system' | 'user' | 'assistant' | 'function'; content: string; name?: string }[],
    availableFunctions: string[] = []
  ) => {
    const client = getClient();
    
    try {
      // Filter function schemas based on available functions
      const selectedFunctionSchemas = functionSchemas.filter(
        schema => availableFunctions.includes(schema.name)
      );
      
      // Initial API call with functions
      const response = await client.chat.completions.create({
        model: "gpt-4o", // Updated from gpt-4-turbo-preview
        messages,
        functions: selectedFunctionSchemas.length > 0 ? selectedFunctionSchemas : undefined,
        function_call: selectedFunctionSchemas.length > 0 ? 'auto' : undefined,
      });
      
      const responseMessage = response.choices[0].message;
      
      // Check if the model wants to call a function
      if (responseMessage.function_call) {
        const functionName = responseMessage.function_call.name;
        let functionArgs = {};
        
        try {
          functionArgs = JSON.parse(responseMessage.function_call.arguments);
        } catch (error) {
          console.error('Error parsing function arguments:', error);
          throw new Error('Invalid function arguments');
        }
        
        // Execute the function
        const functionResult = await executeFunction(functionName, functionArgs);
        
        // Append the function call and result to messages
        const newMessages = [
          ...messages,
          {
            role: 'assistant',
            content: '',
            function_call: {
              name: functionName,
              arguments: responseMessage.function_call.arguments,
            },
          },
          {
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResult),
          },
        ];
        
        // Call the API again with the updated messages
        return chatWithFunctions(newMessages, availableFunctions);
      }
      
      return responseMessage;
    } catch (error) {
      console.error('Error in chat with functions:', error);
      throw error;
    }
  };
  
  // Simplified helper for sales assistant with functions
  const salesAssistantWithFunctions = async (
    userMessage: string,
    context: string = '',
    previousMessages: { role: 'system' | 'user' | 'assistant' | 'function'; content: string; name?: string }[] = []
  ) => {
    const systemMessage = {
      role: 'system' as const,
      content: `You are an AI-powered sales assistant in a CRM system. You can help with:
- Finding and analyzing deals and contacts
- Creating tasks and scheduling follow-ups
- Providing information about specific deals and contacts
- Offering sales advice and strategies

${context}

Always be helpful, professional, and focused on helping the user achieve their sales goals.`
    };
    
    const messages = [
      systemMessage,
      ...previousMessages,
      {
        role: 'user' as const,
        content: userMessage
      }
    ];
    
    // These are all the functions this assistant can use
    const availableFunctions = [
      'searchDeals',
      'searchContacts',
      'createTask',
      'scheduleFollowUp',
      'getContactInfo',
      'getDealInfo'
    ];
    
    return chatWithFunctions(messages, availableFunctions);
  };
  
  return {
    chatWithFunctions,
    salesAssistantWithFunctions,
    functionSchemas,
    executeFunction
  };
};