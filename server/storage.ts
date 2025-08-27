import { profiles, type Profile, type InsertProfile } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { id: string }): Promise<Profile>;
  getAllProfiles(): Promise<Profile[]>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile>;
  
  // Backward compatibility - alias Profile methods as User methods
  getUser(id: string): Promise<Profile | undefined>;
  getUserByUsername(username: string): Promise<Profile | undefined>;
  createUser(user: InsertProfile & { id: string }): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;

  constructor() {
    this.profiles = new Map();
    
    // Initialize with test data for role migration testing
    this.initializeTestData();
  }

  private initializeTestData() {
    const testProfiles: Profile[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'dean',
        firstName: 'Dean',
        lastName: 'Smith',
        role: 'user', // Will be migrated to super_admin
        avatar: null,
        appContext: 'smartcrm',
        emailTemplateSet: 'smartcrm',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        username: 'victor',
        firstName: 'Victor',
        lastName: 'Johnson',
        role: 'user', // Will be migrated to super_admin
        avatar: null,
        appContext: 'smartcrm',
        emailTemplateSet: 'smartcrm',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'samuel',
        firstName: 'Samuel',
        lastName: 'Wilson',
        role: 'user', // Will be migrated to super_admin
        avatar: null,
        appContext: 'smartcrm',
        emailTemplateSet: 'smartcrm',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'jane.doe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'admin', // Will be migrated to wl_user
        avatar: null,
        appContext: 'smartcrm',
        emailTemplateSet: 'smartcrm',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        username: 'john.smith',
        firstName: 'John',
        lastName: 'Smith',
        role: 'customer_admin', // Will be migrated to wl_user
        avatar: null,
        appContext: 'smartcrm',
        emailTemplateSet: 'smartcrm',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    testProfiles.forEach(profile => {
      this.profiles.set(profile.id, profile);
    });
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.username === username,
    );
  }

  async createProfile(insertProfile: InsertProfile & { id: string }): Promise<Profile> {
    const profile: Profile = { 
      id: insertProfile.id,
      username: insertProfile.username || null,
      firstName: insertProfile.firstName || null,
      lastName: insertProfile.lastName || null,
      role: insertProfile.role || null,
      avatar: insertProfile.avatar || null,
      appContext: insertProfile.appContext || 'smartcrm',
      emailTemplateSet: insertProfile.emailTemplateSet || 'smartcrm',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.profiles.set(insertProfile.id, profile);
    return profile;
  }

  // Backward compatibility methods
  async getUser(id: string): Promise<Profile | undefined> {
    return this.getProfile(id);
  }

  async getUserByUsername(username: string): Promise<Profile | undefined> {
    return this.getProfileByUsername(username);
  }

  async createUser(user: InsertProfile & { id: string }): Promise<Profile> {
    return this.createProfile(user);
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const existing = this.profiles.get(id);
    if (!existing) {
      throw new Error(`Profile with id ${id} not found`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    this.profiles.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
