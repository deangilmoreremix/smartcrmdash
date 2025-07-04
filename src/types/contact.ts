export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  company?: string;
  position?: string;
  industry?: string;
  avatarSrc?: string;
  avatar?: string;
  sources?: string[];
  source?: string;
  interestLevel?: 'hot' | 'medium' | 'low';
  status: string;
  lastConnected?: string;
  notes?: string;
  aiScore?: number;
  tags: string[];
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  customFields?: Record<string, string>;
  createdAt: string | Date;
  updatedAt: string | Date;
}