import { profiles, type Profile, type InsertProfile } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { id: string }): Promise<Profile>;
  
  // Backward compatibility - alias Profile methods as User methods
  getUser(id: string): Promise<Profile | undefined>;
  getUserByUsername(username: string): Promise<Profile | undefined>;
  createUser(user: InsertProfile & { id: string }): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;

  constructor() {
    this.profiles = new Map();
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
      ...insertProfile, 
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
}

export const storage = new MemStorage();
