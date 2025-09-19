// server/partners/index.ts
import { createClient } from "@supabase/supabase-js";

// server/storage.ts
import { profiles, partners, partnerTiers, partnerMetrics, partnerCustomers, commissions, featurePackages, contacts, tenantConfigs, userWLSettings, partnerWLConfigs, whiteLabelPackages } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema });

// server/storage.ts
var DatabaseStorage = class {
  constructor(dbConnection) {
    this.db = dbConnection;
  }
  async getProfile(id) {
    const [profile] = await this.db.select().from(profiles).where(eq(profiles.id, id));
    return profile || void 0;
  }
  async getProfileByUsername(username) {
    const [profile] = await this.db.select().from(profiles).where(eq(profiles.username, username));
    return profile || void 0;
  }
  async createProfile(insertProfile) {
    const [profile] = await this.db.insert(profiles).values(insertProfile).returning();
    return profile;
  }
  async getAllProfiles() {
    return await this.db.select().from(profiles);
  }
  async updateProfile(id, updates) {
    const [profile] = await this.db.update(profiles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(profiles.id, id)).returning();
    if (!profile) {
      throw new Error(`Profile with id ${id} not found`);
    }
    return profile;
  }
  // Backward compatibility methods
  async getUser(id) {
    return this.getProfile(id);
  }
  async getUserByUsername(username) {
    return this.getProfileByUsername(username);
  }
  async createUser(user) {
    return this.createProfile(user);
  }
  // Partner Management Methods
  async getPartners() {
    return await this.db.select().from(partners).orderBy(partners.createdAt);
  }
  async getPartner(id) {
    const [partner] = await this.db.select().from(partners).where(eq(partners.id, id));
    return partner || void 0;
  }
  async createPartner(partner) {
    const [newPartner] = await this.db.insert(partners).values(partner).returning();
    return newPartner;
  }
  async updatePartner(id, updates) {
    const [partner] = await this.db.update(partners).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(partners.id, id)).returning();
    return partner || void 0;
  }
  async getPartnerStats(partnerId) {
    const partner = await this.getPartner(partnerId);
    if (!partner) return null;
    const [latestMetric] = await this.db.select().from(partnerMetrics).where(eq(partnerMetrics.partnerId, partnerId)).orderBy(desc(partnerMetrics.year), desc(partnerMetrics.month)).limit(1);
    return {
      totalRevenue: partner.totalRevenue,
      totalCommissions: partner.totalCommissions,
      customerCount: partner.customerCount,
      conversionRate: latestMetric?.conversionRate || 0.15,
      monthlyGrowth: 0.08,
      tier: partner.tier,
      commissionRate: partner.commissionRate,
      status: partner.status
    };
  }
  async getPartnerCustomers(partnerId) {
    const customers = await this.db.select({
      id: partnerCustomers.customerId,
      name: sql`concat(${contacts.firstName}, ' ', ${contacts.lastName})`.as("name"),
      email: contacts.email,
      value: partnerCustomers.lifetime_value,
      status: partnerCustomers.status,
      acquisitionDate: partnerCustomers.acquisitionDate
    }).from(partnerCustomers).innerJoin(contacts, eq(partnerCustomers.customerId, contacts.id)).where(eq(partnerCustomers.partnerId, partnerId));
    return customers;
  }
  async getPartnerCommissions(partnerId) {
    return await this.db.select().from(commissions).where(eq(commissions.partnerId, partnerId)).orderBy(desc(commissions.createdAt));
  }
  async getPartnerTiers() {
    return await this.db.select().from(partnerTiers).where(eq(partnerTiers.isActive, true)).orderBy(partnerTiers.priority);
  }
  async getFeaturePackages() {
    return await this.db.select().from(featurePackages).where(eq(featurePackages.isActive, true)).orderBy(featurePackages.createdAt);
  }
  async createFeaturePackage(pkg) {
    const [featurePackage] = await this.db.insert(featurePackages).values({
      name: pkg.name,
      description: pkg.description || null,
      features: pkg.features || [],
      price: pkg.price || null,
      billingCycle: pkg.billingCycle || "monthly",
      isActive: pkg.isActive !== void 0 ? pkg.isActive : true,
      targetTier: pkg.targetTier || null
    }).returning();
    return featurePackage;
  }
  async getRevenueAnalytics() {
    const partners2 = await this.getPartners();
    const totalRevenue = partners2.reduce((sum, p) => sum + parseFloat(p.totalRevenue || "0"), 0);
    const totalCommissions = partners2.reduce((sum, p) => sum + parseFloat(p.totalCommissions || "0"), 0);
    const totalCustomers = partners2.reduce((sum, p) => sum + (p.customerCount || 0), 0);
    return {
      totalRevenue,
      totalCommissions,
      totalPartners: partners2.length,
      activePartners: partners2.filter((p) => p.status === "active").length,
      totalCustomers,
      averageCommissionRate: 0.2,
      monthlyGrowth: 0.12,
      topPerformingTier: "gold",
      metrics: {
        revenue: {
          current: totalRevenue,
          previousMonth: totalRevenue * 0.9,
          growth: 0.1
        },
        commissions: {
          current: totalCommissions,
          previousMonth: totalCommissions * 0.9,
          growth: 0.1
        },
        partners: {
          current: partners2.length,
          previousMonth: Math.max(1, partners2.length - 1),
          growth: partners2.length > 1 ? 0.05 : 0
        }
      }
    };
  }
  // White Label Storage Methods for DatabaseStorage
  async getTenantConfig(tenantId) {
    const [config] = await this.db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId));
    return config || void 0;
  }
  async createTenantConfig(config) {
    const [tenantConfig] = await this.db.insert(tenantConfigs).values(config).returning();
    return tenantConfig;
  }
  async updateTenantConfig(tenantId, updates) {
    const [config] = await this.db.update(tenantConfigs).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tenantConfigs.tenantId, tenantId)).returning();
    return config || void 0;
  }
  async getUserWLSettings(userId) {
    const [settings] = await this.db.select().from(userWLSettings).where(eq(userWLSettings.userId, userId));
    return settings || void 0;
  }
  async createUserWLSettings(settings) {
    const [userSettings] = await this.db.insert(userWLSettings).values(settings).returning();
    return userSettings;
  }
  async updateUserWLSettings(userId, updates) {
    const [settings] = await this.db.update(userWLSettings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userWLSettings.userId, userId)).returning();
    return settings || void 0;
  }
  async getPartnerWLConfig(partnerId) {
    const [config] = await this.db.select().from(partnerWLConfigs).where(eq(partnerWLConfigs.partnerId, partnerId));
    return config || void 0;
  }
  async createPartnerWLConfig(config) {
    const [partnerConfig] = await this.db.insert(partnerWLConfigs).values(config).returning();
    return partnerConfig;
  }
  async updatePartnerWLConfig(partnerId, updates) {
    const [config] = await this.db.update(partnerWLConfigs).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(partnerWLConfigs.partnerId, partnerId)).returning();
    return config || void 0;
  }
  async getWhiteLabelPackages() {
    return await this.db.select().from(whiteLabelPackages).where(eq(whiteLabelPackages.isActive, true)).orderBy(whiteLabelPackages.createdAt);
  }
};
var MemStorage = class {
  constructor() {
    this.profiles = /* @__PURE__ */ new Map();
    this.partners = /* @__PURE__ */ new Map();
    this.partnerTiers = /* @__PURE__ */ new Map();
    this.commissions = /* @__PURE__ */ new Map();
    this.featurePackages = /* @__PURE__ */ new Map();
    this.tenantConfigs = /* @__PURE__ */ new Map();
    this.userWLSettings = /* @__PURE__ */ new Map();
    this.partnerWLConfigs = /* @__PURE__ */ new Map();
    this.whiteLabelPackages = /* @__PURE__ */ new Map();
    this.initializeTestData();
    this.initializePartnerTestData();
  }
  initializeTestData() {
    const testProfiles = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "dean",
        firstName: "Dean",
        lastName: "Smith",
        role: "user",
        // Will be migrated to super_admin
        avatar: null,
        appContext: "smartcrm",
        emailTemplateSet: "smartcrm",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        username: "victor",
        firstName: "Victor",
        lastName: "Johnson",
        role: "user",
        // Will be migrated to super_admin
        avatar: null,
        appContext: "smartcrm",
        emailTemplateSet: "smartcrm",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        username: "samuel",
        firstName: "Samuel",
        lastName: "Wilson",
        role: "user",
        // Will be migrated to super_admin
        avatar: null,
        appContext: "smartcrm",
        emailTemplateSet: "smartcrm",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        username: "jane.doe",
        firstName: "Jane",
        lastName: "Doe",
        role: "admin",
        // Will be migrated to wl_user
        avatar: null,
        appContext: "smartcrm",
        emailTemplateSet: "smartcrm",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        username: "john.smith",
        firstName: "John",
        lastName: "Smith",
        role: "customer_admin",
        // Will be migrated to wl_user
        avatar: null,
        appContext: "smartcrm",
        emailTemplateSet: "smartcrm",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    testProfiles.forEach((profile) => {
      this.profiles.set(profile.id, profile);
    });
  }
  initializePartnerTestData() {
    const tiers = [
      {
        id: "tier-bronze",
        name: "Bronze Partner",
        slug: "bronze",
        commissionRate: "15.00",
        minimumRevenue: "0.00",
        features: ["Basic CRM Access", "Email Support", "Partner Portal"],
        benefits: ["15% commission", "Basic marketing materials"],
        color: "#CD7F32",
        priority: 1,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "tier-silver",
        name: "Silver Partner",
        slug: "silver",
        commissionRate: "20.00",
        minimumRevenue: "5000.00",
        features: ["Advanced CRM Access", "Priority Support", "Custom Branding"],
        benefits: ["20% commission", "Co-marketing opportunities"],
        color: "#C0C0C0",
        priority: 2,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "tier-gold",
        name: "Gold Partner",
        slug: "gold",
        commissionRate: "25.00",
        minimumRevenue: "15000.00",
        features: ["Premium CRM Access", "Dedicated Support", "White Label"],
        benefits: ["25% commission", "Joint sales opportunities"],
        color: "#FFD700",
        priority: 3,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    tiers.forEach((tier) => this.partnerTiers.set(tier.id, tier));
    const testPartners = [
      {
        id: "partner-001",
        companyName: "TechSolutions Inc.",
        contactName: "John Smith",
        contactEmail: "john@techsolutions.com",
        phone: "+1-555-123-4567",
        website: "https://techsolutions.com",
        businessType: "Technology Consulting",
        status: "active",
        tier: "silver",
        commissionRate: "20.00",
        totalRevenue: "8500.00",
        totalCommissions: "1700.00",
        customerCount: 12,
        brandingConfig: {
          logo: "/assets/partners/techsolutions-logo.png",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF"
        },
        contractDetails: {
          startDate: "2024-01-15",
          contractDuration: "12 months",
          autoRenewal: true
        },
        payoutSettings: {
          method: "bank_transfer",
          frequency: "monthly",
          minimumPayout: 100
        },
        createdAt: /* @__PURE__ */ new Date("2024-01-15"),
        updatedAt: /* @__PURE__ */ new Date(),
        profileId: "550e8400-e29b-41d4-a716-446655440000"
      }
    ];
    testPartners.forEach((partner) => this.partners.set(partner.id, partner));
    const packages = [
      {
        id: "pkg-basic",
        name: "Basic CRM Package",
        description: "Essential CRM features for small businesses",
        features: ["Contact Management", "Deal Tracking", "Basic Reporting"],
        price: "29.99",
        billingCycle: "monthly",
        isActive: true,
        targetTier: "bronze",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    packages.forEach((pkg) => this.featurePackages.set(pkg.id, pkg));
    console.log(`Initialized ${this.partnerTiers.size} partner tiers, ${this.partners.size} partners, ${this.featurePackages.size} feature packages`);
  }
  async getProfile(id) {
    return this.profiles.get(id);
  }
  async getProfileByUsername(username) {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.username === username
    );
  }
  async createProfile(insertProfile) {
    const profile = {
      id: insertProfile.id,
      username: insertProfile.username || null,
      firstName: insertProfile.firstName || null,
      lastName: insertProfile.lastName || null,
      role: insertProfile.role || null,
      avatar: insertProfile.avatar || null,
      appContext: "smartcrm",
      emailTemplateSet: "smartcrm",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.profiles.set(insertProfile.id, profile);
    return profile;
  }
  // Backward compatibility methods
  async getUser(id) {
    return this.getProfile(id);
  }
  async getUserByUsername(username) {
    return this.getProfileByUsername(username);
  }
  async createUser(user) {
    return this.createProfile(user);
  }
  async getAllProfiles() {
    return Array.from(this.profiles.values());
  }
  async updateProfile(id, updates) {
    const existing = this.profiles.get(id);
    if (!existing) {
      throw new Error(`Profile with id ${id} not found`);
    }
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.profiles.set(id, updated);
    return updated;
  }
  // Partner Management Methods Implementation
  async getPartners() {
    return Array.from(this.partners.values());
  }
  async getPartner(id) {
    return this.partners.get(id);
  }
  async createPartner(insertPartner) {
    const id = "partner-" + Date.now();
    const partner = {
      id,
      companyName: insertPartner.companyName,
      contactName: insertPartner.contactName,
      contactEmail: insertPartner.contactEmail,
      phone: insertPartner.phone || null,
      website: insertPartner.website || null,
      businessType: insertPartner.businessType || null,
      status: insertPartner.status || "pending",
      tier: insertPartner.tier || "bronze",
      commissionRate: insertPartner.commissionRate || "15.00",
      totalRevenue: insertPartner.totalRevenue || "0.00",
      totalCommissions: insertPartner.totalCommissions || "0.00",
      customerCount: insertPartner.customerCount || 0,
      brandingConfig: insertPartner.brandingConfig || null,
      contractDetails: insertPartner.contractDetails || null,
      payoutSettings: insertPartner.payoutSettings || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      profileId: insertPartner.profileId || null
    };
    this.partners.set(id, partner);
    return partner;
  }
  async updatePartner(id, updates) {
    const existing = this.partners.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.partners.set(id, updated);
    return updated;
  }
  async getPartnerStats(partnerId) {
    const partner = this.partners.get(partnerId);
    if (!partner) return null;
    return {
      partnerId,
      totalRevenue: partner.totalRevenue,
      totalCommissions: partner.totalCommissions,
      customerCount: partner.customerCount,
      conversionRate: 0.15,
      monthlyGrowth: 0.08,
      tier: partner.tier,
      commissionRate: partner.commissionRate,
      status: partner.status
    };
  }
  async getPartnerCustomers(partnerId) {
    return [
      {
        id: "customer-001",
        name: "Acme Corp",
        email: "contact@acme.com",
        value: 2500,
        status: "active",
        acquisitionDate: "2024-01-15"
      }
    ];
  }
  async getPartnerCommissions(partnerId) {
    return Array.from(this.commissions.values()).filter(
      (commission) => commission.partnerId === partnerId
    );
  }
  async getPartnerTiers() {
    return Array.from(this.partnerTiers.values()).sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }
  async getFeaturePackages() {
    return Array.from(this.featurePackages.values());
  }
  async createFeaturePackage(pkg) {
    const id = "pkg-" + Date.now();
    const featurePackage = {
      id,
      name: pkg.name,
      description: pkg.description || null,
      features: pkg.features || [],
      price: pkg.price || null,
      billingCycle: pkg.billingCycle || "monthly",
      isActive: pkg.isActive !== void 0 ? pkg.isActive : true,
      targetTier: pkg.targetTier || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.featurePackages.set(id, featurePackage);
    return featurePackage;
  }
  async getRevenueAnalytics() {
    const partners2 = Array.from(this.partners.values());
    const totalRevenue = partners2.reduce((sum, p) => sum + parseFloat(p.totalRevenue || "0"), 0);
    const totalCommissions = partners2.reduce((sum, p) => sum + parseFloat(p.totalCommissions || "0"), 0);
    const totalCustomers = partners2.reduce((sum, p) => sum + (p.customerCount || 0), 0);
    return {
      totalRevenue,
      totalCommissions,
      totalPartners: partners2.length,
      activePartners: partners2.filter((p) => p.status === "active").length,
      totalCustomers,
      averageCommissionRate: 0.2,
      monthlyGrowth: 0.12,
      topPerformingTier: "gold",
      metrics: {
        revenue: {
          current: totalRevenue,
          previousMonth: totalRevenue * 0.9,
          growth: 0.1
        },
        commissions: {
          current: totalCommissions,
          previousMonth: totalCommissions * 0.9,
          growth: 0.1
        },
        partners: {
          current: partners2.length,
          previousMonth: Math.max(1, partners2.length - 1),
          growth: partners2.length > 1 ? 0.05 : 0
        }
      }
    };
  }
  // White Label Storage Methods for MemStorage
  async getTenantConfig(tenantId) {
    return this.tenantConfigs.get(tenantId);
  }
  async createTenantConfig(config) {
    const id = config.tenantId || "tenant-" + Date.now();
    const tenantConfig = {
      id: "tc-" + Date.now(),
      tenantId: id,
      companyName: config.companyName || "",
      logo: config.logo || null,
      favicon: config.favicon || null,
      primaryColor: config.primaryColor || "#3B82F6",
      secondaryColor: config.secondaryColor || "#1E40AF",
      accentColor: config.accentColor || "#10B981",
      backgroundColor: config.backgroundColor || "#FFFFFF",
      textColor: config.textColor || "#1F2937",
      customDomain: config.customDomain || null,
      customCSS: config.customCSS || null,
      emailFromName: config.emailFromName || null,
      emailReplyTo: config.emailReplyTo || null,
      emailSignature: config.emailSignature || null,
      brandingConfig: config.brandingConfig || null,
      features: config.features || null,
      profileId: config.profileId || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tenantConfigs.set(id, tenantConfig);
    return tenantConfig;
  }
  async updateTenantConfig(tenantId, updates) {
    const existing = this.tenantConfigs.get(tenantId);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tenantConfigs.set(tenantId, updated);
    return updated;
  }
  async getUserWLSettings(userId) {
    return this.userWLSettings.get(userId);
  }
  async createUserWLSettings(settings) {
    const userSettings = {
      id: "wl-" + Date.now(),
      userId: settings.userId,
      customBranding: settings.customBranding || null,
      enabledFeatures: settings.enabledFeatures || [],
      preferences: settings.preferences || null,
      settings: settings.settings || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.userWLSettings.set(settings.userId, userSettings);
    return userSettings;
  }
  async updateUserWLSettings(userId, updates) {
    const existing = this.userWLSettings.get(userId);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.userWLSettings.set(userId, updated);
    return updated;
  }
  async getPartnerWLConfig(partnerId) {
    return this.partnerWLConfigs.get(partnerId);
  }
  async createPartnerWLConfig(config) {
    const partnerConfig = {
      id: "pwl-" + Date.now(),
      partnerId: config.partnerId,
      companyName: config.companyName || "",
      logo: config.logo || null,
      primaryColor: config.primaryColor || "#3B82F6",
      secondaryColor: config.secondaryColor || "#1E40AF",
      customDomain: config.customDomain || null,
      emailFromName: config.emailFromName || null,
      emailReplyTo: config.emailReplyTo || null,
      brandingConfig: config.brandingConfig || null,
      features: config.features || null,
      profileId: config.profileId || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.partnerWLConfigs.set(config.partnerId, partnerConfig);
    return partnerConfig;
  }
  async updatePartnerWLConfig(partnerId, updates) {
    const existing = this.partnerWLConfigs.get(partnerId);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.partnerWLConfigs.set(partnerId, updated);
    return updated;
  }
  async getWhiteLabelPackages() {
    return Array.from(this.whiteLabelPackages.values()).filter((pkg) => pkg.isActive);
  }
};
var storage = process.env.DATABASE_URL ? new DatabaseStorage(db) : new MemStorage();

// server/partners/index.ts
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseKey = process.env.SUPABASE_ANON_KEY;
var supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
var handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters, body } = event;
  const pathParts = path.split("/").filter(Boolean);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
  if (httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  try {
    if (pathParts.length === 1 && pathParts[0] === "partners") {
      if (httpMethod === "GET") {
        const partners2 = await storage.getPartners();
        return { statusCode: 200, headers, body: JSON.stringify(partners2) };
      }
      if (httpMethod === "POST") {
        const partnerData = JSON.parse(body);
        const partner = await storage.createPartner(partnerData);
        return { statusCode: 201, headers, body: JSON.stringify(partner) };
      }
    }
    if (pathParts.length === 2 && pathParts[0] === "partners") {
      const partnerId = pathParts[1];
      if (httpMethod === "GET") {
        const partner = await storage.getPartner(partnerId);
        if (!partner) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Partner not found" }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(partner) };
      }
      if (httpMethod === "PUT") {
        const updates = JSON.parse(body);
        const partner = await storage.updatePartner(partnerId, updates);
        if (!partner) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Partner not found" }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(partner) };
      }
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "stats") {
      const partnerId = pathParts[1];
      if (httpMethod === "GET") {
        const stats = await storage.getPartnerStats(partnerId);
        return { statusCode: 200, headers, body: JSON.stringify(stats) };
      }
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "commissions") {
      const partnerId = pathParts[1];
      if (httpMethod === "GET") {
        const commissions2 = await storage.getPartnerCommissions(partnerId);
        return { statusCode: 200, headers, body: JSON.stringify(commissions2) };
      }
    }
    if (pathParts.length === 2 && pathParts[0] === "partners" && pathParts[1] === "onboard" && httpMethod === "POST") {
      const { brandingConfig, ...partnerData } = JSON.parse(body);
      const newPartner = await storage.createPartner({
        ...partnerData,
        brandingConfig,
        status: "pending",
        tier: "bronze",
        profileId: "dev-user-12345"
      });
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          partner: newPartner,
          message: "Partner application submitted successfully"
        })
      };
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "approve" && httpMethod === "POST") {
      const partnerId = pathParts[1];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: partnerId,
          status: "active",
          approvedAt: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    }
    if (pathParts.length === 2 && pathParts[0] === "partners" && pathParts[1] === "pending" && httpMethod === "GET") {
      if (!supabase) {
        const pendingPartners = [
          {
            id: "partner_1",
            name: "TechCorp Solutions",
            contact_email: "contact@techcorp.com",
            subdomain: "techcorp",
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            status: "pending"
          }
        ];
        return { statusCode: 200, headers, body: JSON.stringify(pendingPartners) };
      }
      const { data, error } = await supabase.from("partners").select("*").eq("status", "pending").order("created_at", { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }
    if (pathParts.length === 2 && pathParts[0] === "partners" && pathParts[1] === "active" && httpMethod === "GET") {
      if (!supabase) {
        const activePartners = [
          {
            id: "partner_3",
            name: "SalesForce Plus",
            contact_email: "admin@salesforceplus.com",
            subdomain: "salesforceplus",
            created_at: new Date(Date.now() - 6048e5).toISOString(),
            status: "active"
          }
        ];
        return { statusCode: 200, headers, body: JSON.stringify(activePartners) };
      }
      const { data, error } = await supabase.from("partners").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "stats" && httpMethod === "GET") {
      const partnerId = pathParts[1];
      if (!supabase) {
        const stats2 = {
          total_customers: 42,
          active_customers: 38,
          total_revenue: 14200,
          monthly_revenue: 14200,
          customer_growth_rate: 23
        };
        return { statusCode: 200, headers, body: JSON.stringify(stats2) };
      }
      const { data: stats, error: statsError } = await supabase.from("partner_stats").select("*").eq("partner_id", partnerId).order("created_at", { ascending: false }).limit(1).single();
      if (statsError && statsError.code !== "PGRST116") {
        throw statsError;
      }
      if (!stats) {
        const { data: customers, error: customersError } = await supabase.from("partner_customers").select("monthly_revenue, status").eq("partner_id", partnerId);
        if (customersError) throw customersError;
        const totalCustomers = customers?.length || 0;
        const activeCustomers = customers?.filter((c) => c.status === "active").length || 0;
        const totalRevenue = customers?.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0) || 0;
        const calculatedStats = {
          total_customers: totalCustomers,
          active_customers: activeCustomers,
          total_revenue: totalRevenue,
          monthly_revenue: totalRevenue,
          customer_growth_rate: 0
        };
        return { statusCode: 200, headers, body: JSON.stringify(calculatedStats) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(stats) };
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "customers" && httpMethod === "GET") {
      const partnerId = pathParts[1];
      if (!supabase) {
        const customers = [
          {
            id: "1",
            name: "Acme Corp",
            subdomain: "acme",
            status: "active",
            plan: "enterprise",
            monthly_revenue: 299,
            created_at: "2024-01-15T00:00:00Z",
            last_active: "2024-06-28T00:00:00Z"
          }
        ];
        return { statusCode: 200, headers, body: JSON.stringify(customers) };
      }
      const { data, error } = await supabase.from("partner_customers").select("*").eq("partner_id", partnerId).order("created_at", { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }
    if (pathParts.length === 3 && pathParts[0] === "partners" && pathParts[2] === "customers" && httpMethod === "POST") {
      const partnerId = pathParts[1];
      const { companyName, contactEmail, plan } = JSON.parse(body);
      const newCustomer = {
        id: `customer_${Date.now()}`,
        name: companyName,
        subdomain: companyName.toLowerCase().replace(/\s+/g, ""),
        status: "active",
        plan: plan || "basic",
        monthly_revenue: plan === "enterprise" ? 299 : plan === "pro" ? 149 : 49,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        last_active: (/* @__PURE__ */ new Date()).toISOString()
      };
      return { statusCode: 200, headers, body: JSON.stringify(newCustomer) };
    }
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Partner endpoint not found" })
    };
  } catch (error) {
    console.error("Partners function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message })
    };
  }
};
export {
  handler
};
