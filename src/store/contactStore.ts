import { create } from 'zustand';
import { Contact } from '../types/contact';
import { logger } from '../services/logger.service';
import { avatarCollection } from '../utils/avatars';

interface ContactStore {
  contacts: Record<string, Contact>;
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
}

// Create sample contacts with data from both branches
export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: {
    '1': {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      name: 'Jane Doe',
      email: 'jane.doe@microsoft.com',
      phone: '+1 (555) 123-4567',
      company: 'Microsoft',
      position: 'Marketing Director',
      title: 'Marketing Director',
      industry: 'Technology',
      avatar: avatarCollection.women[0],
      avatarSrc: avatarCollection.women[0],
      status: 'prospect',
      interestLevel: 'hot',
      source: 'LinkedIn',
      sources: ['LinkedIn', 'Email'],
      tags: ['Enterprise', 'Software', 'High-Value'],
      aiScore: 85,
      isFavorite: true,
      lastConnected: '2024-01-15 at 2:30 pm',
      notes: 'Interested in enterprise solutions. Scheduled follow-up for next week.',
      socialProfiles: {
        linkedin: 'https://linkedin.com/in/janedoe',
        twitter: 'https://twitter.com/janedoe',
        website: 'https://microsoft.com'
      },
      customFields: {
        'Budget Range': '$200K-$500K',
        'Company Size': '10,000+',
        'Decision Timeline': 'Q3 2025'
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      firstName: 'Darlene',
      lastName: 'Robertson',
      name: 'Darlene Robertson',
      email: 'darlene.r@ford.com',
      phone: '+1 (555) 234-5678',
      company: 'Ford Motor Company',
      position: 'Financial Manager',
      title: 'Financial Manager',
      industry: 'Automotive',
      avatar: avatarCollection.women[1],
      avatarSrc: avatarCollection.women[1],
      status: 'lead',
      interestLevel: 'warm',
      source: 'LinkedIn',
      sources: ['LinkedIn', 'Facebook'],
      tags: ['Finance', 'Automotive', 'F500'],
      aiScore: 65,
      isFavorite: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    '3': {
      id: '3',
      firstName: 'Wade',
      lastName: 'Warren',
      name: 'Wade Warren',
      email: 'wade.warren@zenith.com',
      phone: '+1 (555) 345-6789',
      company: 'Zenith Corp',
      position: 'Operations Manager',
      title: 'Operations Manager',
      industry: 'Manufacturing',
      avatar: avatarCollection.men[0],
      avatarSrc: avatarCollection.men[0],
      status: 'lead',
      interestLevel: 'low',
      source: 'Facebook',
      sources: ['Website', 'Typeform'],
      tags: ['Operations', 'Mid-Market'],
      aiScore: 35,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    '4': {
      id: '4',
      firstName: 'Jonah',
      lastName: 'Jude',
      name: 'Jonah Jude',
      email: 'jonah.j@binaryit.com',
      phone: '+1 (555) 456-7890',
      company: 'Binary IT Solutions',
      position: 'Web Developer',
      title: 'Web Developer',
      industry: 'Technology',
      avatar: avatarCollection.tech[0],
      avatarSrc: avatarCollection.tech[0],
      status: 'prospect',
      interestLevel: 'warm',
      source: 'LinkedIn',
      sources: ['Referral'],
      tags: ['Technology', 'Development', 'SMB'],
      aiScore: 90,
      isFavorite: true,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22')
    },
    '5': {
      id: '5',
      firstName: 'Sarah',
      lastName: 'Chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@techstartup.com',
      phone: '+1 (555) 567-8901',
      company: 'TechStartup Inc',
      position: 'CTO',
      title: 'CTO',
      industry: 'Technology',
      avatar: avatarCollection.executives[2],
      avatarSrc: avatarCollection.executives[2],
      status: 'prospect',
      interestLevel: 'hot',
      source: 'Referral',
      sources: ['Website', 'Email'],
      tags: ['Executive', 'Technology', 'Startup'],
      aiScore: 75,
      isFavorite: true,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-25')
    },
    '6': {
      id: '6',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      name: 'Michael Rodriguez',
      email: 'michael.r@globalsales.com',
      phone: '+1 (555) 678-9012',
      company: 'Global Sales Corp',
      position: 'Sales Director',
      title: 'Sales Director',
      industry: 'Sales',
      avatar: avatarCollection.men[2],
      avatarSrc: avatarCollection.men[2],
      status: 'lead',
      interestLevel: 'warm',
      source: 'Conference',
      sources: ['LinkedIn', 'Cold Call'],
      tags: ['Sales', 'B2B', 'Enterprise'],
      aiScore: 92,
      isFavorite: true,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-27')
    },
    '7': {
      id: '7',
      firstName: 'Emily',
      lastName: 'Johnson',
      name: 'Emily Johnson',
      email: 'emily.j@marketingpro.com',
      phone: '+1 (555) 789-0123',
      company: 'Marketing Pro Agency',
      position: 'VP Marketing',
      title: 'VP Marketing',
      industry: 'Marketing',
      avatar: avatarCollection.women[3],
      avatarSrc: avatarCollection.women[3],
      status: 'prospect',
      interestLevel: 'hot',
      source: 'LinkedIn',
      sources: ['Trade Show', 'Email'],
      tags: ['Marketing', 'Agency', 'Creative'],
      aiScore: 15,
      isFavorite: false,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-29')
    },
    '8': {
      id: '8',
      firstName: 'David',
      lastName: 'Thompson',
      name: 'David Thompson',
      email: 'david.t@consulting.com',
      phone: '+1 (555) 890-1234',
      company: 'Thompson Consulting',
      position: 'Senior Consultant',
      title: 'Senior Consultant',
      industry: 'Consulting',
      avatar: avatarCollection.men[3],
      avatarSrc: avatarCollection.men[3],
      status: 'lead',
      interestLevel: 'medium',
      source: 'Website',
      sources: ['Webinar', 'LinkedIn'],
      tags: ['Consulting', 'Strategy', 'Professional'],
      aiScore: 72,
      isFavorite: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-30')
    }
  },
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
      logger.info('Contacts fetched successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
      set({ error: errorMessage, isLoading: false });
      logger.error('Failed to fetch contacts', error as Error);
    }
  },

  addContact: (contactData) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      contacts: { ...state.contacts, [newContact.id]: newContact }
    }));
    logger.info('Contact added successfully', { contactId: newContact.id });
  },

  updateContact: (id, updates) => {
    set(state => ({
      contacts: {
        ...state.contacts,
        [id]: {
          ...state.contacts[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
    logger.info('Contact updated successfully', { contactId: id });
  },

  deleteContact: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.contacts;
      return { contacts: rest };
    });
    logger.info('Contact deleted successfully', { contactId: id });
  }
}));