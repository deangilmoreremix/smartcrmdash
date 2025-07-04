export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  position?: string;
  status: string;
  avatar?: string;
  [key: string]: any;
}