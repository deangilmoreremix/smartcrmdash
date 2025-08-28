import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// User role enum
export const userRoles = ['super_admin', 'wl_user', 'regular_user'] as const;
export type UserRole = typeof userRoles[number];

// Profiles table (links to Supabase auth.users)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("regular_user"),
  avatar: text("avatar_url"),
  appContext: text("app_context").default("smartcrm"), // Track which app the user came from
  emailTemplateSet: text("email_template_set").default("smartcrm"), // Control which email templates to use
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  industry: text("industry"),
  source: text("source"),
  tags: text("tags").array(),
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Deals table
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }),
  stage: text("stage").notNull(),
  probability: integer("probability").default(0),
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  description: text("description"),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  dealId: integer("deal_id").references(() => deals.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  type: text("type").default("meeting"),
  status: text("status").default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Communications table (emails, calls, etc.)
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // email, call, sms, meeting
  subject: text("subject"),
  content: text("content"),
  direction: text("direction").notNull(), // inbound, outbound
  status: text("status").default("sent"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  type: text("type").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  dealId: integer("deal_id").references(() => deals.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Documents table
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  contactId: integer("contact_id").references(() => contacts.id),
  dealId: integer("deal_id").references(() => deals.id),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Lead automation rules table
export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: json("trigger"), // JSON object defining trigger conditions
  actions: json("actions"), // JSON array of actions to perform
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// AI query history table
export const aiQueries = pgTable("ai_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: text("response"),
  type: text("type").notNull(), // natural_language, sentiment, sales_pitch, email_draft
  model: text("model"),
  createdAt: timestamp("created_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profiles.id),
});

// Entitlements table for subscription and payment management
export const entitlements = pgTable("entitlements", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => profiles.id), // Link to Supabase user
  status: text("status").notNull().default("active"), // active, past_due, canceled, refunded, inactive
  productType: text("product_type"), // lifetime, monthly, yearly, payment_plan
  revokeAt: timestamp("revoke_at", { withTimezone: true }), // When access should flip off (UTC)
  lastInvoiceStatus: text("last_invoice_status"), // paid, open, uncollectible, void, failed
  delinquencyCount: integer("delinquency_count").default(0), // For payment plan misses
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  zaxaaSubscriptionId: text("zaxaa_subscription_id"),
  planName: text("plan_name"),
  planAmount: decimal("plan_amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const profilesRelations = relations(profiles, ({ many, one }) => ({
  contacts: many(contacts),
  deals: many(deals),
  tasks: many(tasks),
  appointments: many(appointments),
  communications: many(communications),
  notes: many(notes),
  documents: many(documents),
  automationRules: many(automationRules),
  aiQueries: many(aiQueries),
  entitlement: one(entitlements, {
    fields: [profiles.id],
    references: [entitlements.userId],
  }),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [contacts.profileId],
    references: [profiles.id],
  }),
  deals: many(deals),
  tasks: many(tasks),
  appointments: many(appointments),
  communications: many(communications),
  notes: many(notes),
  documents: many(documents),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [deals.contactId],
    references: [contacts.id],
  }),
  profile: one(profiles, {
    fields: [deals.profileId],
    references: [profiles.id],
  }),
  tasks: many(tasks),
  notes: many(notes),
  documents: many(documents),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  contact: one(contacts, {
    fields: [tasks.contactId],
    references: [contacts.id],
  }),
  deal: one(deals, {
    fields: [tasks.dealId],
    references: [deals.id],
  }),
  profile: one(profiles, {
    fields: [tasks.profileId],
    references: [profiles.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  contact: one(contacts, {
    fields: [appointments.contactId],
    references: [contacts.id],
  }),
  profile: one(profiles, {
    fields: [appointments.profileId],
    references: [profiles.id],
  }),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  contact: one(contacts, {
    fields: [communications.contactId],
    references: [contacts.id],
  }),
  profile: one(profiles, {
    fields: [communications.profileId],
    references: [profiles.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  contact: one(contacts, {
    fields: [notes.contactId],
    references: [contacts.id],
  }),
  deal: one(deals, {
    fields: [notes.dealId],
    references: [deals.id],
  }),
  profile: one(profiles, {
    fields: [notes.profileId],
    references: [profiles.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  contact: one(contacts, {
    fields: [documents.contactId],
    references: [contacts.id],
  }),
  deal: one(deals, {
    fields: [documents.dealId],
    references: [deals.id],
  }),
  profile: one(profiles, {
    fields: [documents.profileId],
    references: [profiles.id],
  }),
}));

export const automationRulesRelations = relations(automationRules, ({ one }) => ({
  profile: one(profiles, {
    fields: [automationRules.profileId],
    references: [profiles.id],
  }),
}));

export const aiQueriesRelations = relations(aiQueries, ({ one }) => ({
  profile: one(profiles, {
    fields: [aiQueries.profileId],
    references: [profiles.id],
  }),
}));

export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  user: one(profiles, {
    fields: [entitlements.userId],
    references: [profiles.id],
  }),
}));

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).pick({
  username: true,
  firstName: true,
  lastName: true,
  role: true,
  avatar: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunicationSchema = createInsertSchema(communications).omit({
  id: true,
  createdAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiQuerySchema = createInsertSchema(aiQueries).omit({
  id: true,
  createdAt: true,
});

export const insertEntitlementSchema = createInsertSchema(entitlements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type AutomationRule = typeof automationRules.$inferSelect;
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type AiQuery = typeof aiQueries.$inferSelect;
export type InsertAiQuery = z.infer<typeof insertAiQuerySchema>;
export type Entitlement = typeof entitlements.$inferSelect;
export type InsertEntitlement = z.infer<typeof insertEntitlementSchema>;

// Partner-related tables for Revenue Sharing & Partner Management

// Partners table
export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name"), // Made nullable to fix the constraint error
  contactEmail: text("contact_email").notNull().unique(),
  phone: text("phone"),
  website: text("website"),
  businessType: text("business_type"),
  status: text("status").default("pending"), // pending, active, suspended, terminated
  tier: text("tier").default("bronze"), // bronze, silver, gold, platinum
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("15.00"),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0.00"),
  totalCommissions: decimal("total_commissions", { precision: 12, scale: 2 }).default("0.00"),
  customerCount: integer("customer_count").default(0),
  brandingConfig: json("branding_config"), // Logo, colors, custom domain
  contractDetails: json("contract_details"), // Terms, conditions, etc.
  payoutSettings: json("payout_settings"), // Payment method, schedule, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profiles.id), // Partner owner
});

// Partner Tiers configuration
export const partnerTiers = pgTable("partner_tiers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // Bronze Partner, Silver Partner, etc.
  slug: text("slug").notNull().unique(), // bronze, silver, gold, platinum
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  minimumRevenue: decimal("minimum_revenue", { precision: 10, scale: 2 }).default("0.00"),
  features: text("features").array(), // Array of feature names
  benefits: text("benefits").array(), // Array of benefit descriptions
  color: text("color"), // UI color scheme
  priority: integer("priority").default(1), // For ordering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commission tracking
export const commissions = pgTable("commissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  dealId: integer("deal_id").references(() => deals.id),
  customerId: integer("customer_id").references(() => contacts.id),
  type: text("type").notNull(), // one_time, recurring, bonus
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  rate: decimal("rate", { precision: 5, scale: 2 }), // Commission rate used
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }), // Original amount before commission
  status: text("status").default("pending"), // pending, approved, paid, cancelled
  description: text("description"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  profileId: uuid("profile_id").references(() => profiles.id), // System user who created
});

// Payout management
export const payouts = pgTable("payouts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  commissionsCount: integer("commissions_count").default(0),
  paymentMethod: text("payment_method"), // stripe, paypal, bank_transfer, check
  paymentDetails: json("payment_details"), // Payment-specific information
  status: text("status").default("pending"), // pending, processing, completed, failed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  processedAt: timestamp("processed_at"),
  failureReason: text("failure_reason"),
  externalTransactionId: text("external_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  processedBy: uuid("processed_by").references(() => profiles.id),
});

// Partner customers - tracks customer attribution
export const partnerCustomers = pgTable("partner_customers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  customerId: integer("customer_id").references(() => contacts.id).notNull(),
  referralCode: text("referral_code"),
  acquisitionDate: timestamp("acquisition_date").defaultNow(),
  lifetime_value: decimal("lifetime_value", { precision: 10, scale: 2 }).default("0.00"),
  status: text("status").default("active"), // active, churned, suspended
  source: text("source"), // How customer was acquired
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature packages for partner tiers
export const featurePackages = pgTable("feature_packages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  features: text("features").array(),
  price: decimal("price", { precision: 8, scale: 2 }),
  billingCycle: text("billing_cycle"), // monthly, yearly, one_time
  isActive: boolean("is_active").default(true),
  targetTier: text("target_tier"), // Which partner tier this is for
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner performance metrics
export const partnerMetrics = pgTable("partner_metrics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  newCustomers: integer("new_customers").default(0),
  totalCustomers: integer("total_customers").default(0),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).default("0.00"),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0.00"),
  commissionsEarned: decimal("commissions_earned", { precision: 10, scale: 2 }).default("0.00"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.00"),
  churnRate: decimal("churn_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  partnerMonthYearIdx: sql`CREATE UNIQUE INDEX IF NOT EXISTS partner_month_year_idx ON ${table} (partner_id, month, year)`,
}));

// Relations for partner tables
export const partnersRelations = relations(partners, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [partners.profileId],
    references: [profiles.id],
  }),
  tier: one(partnerTiers, {
    fields: [partners.tier],
    references: [partnerTiers.slug],
  }),
  commissions: many(commissions),
  payouts: many(payouts),
  customers: many(partnerCustomers),
  metrics: many(partnerMetrics),
}));

export const partnerTiersRelations = relations(partnerTiers, ({ many }) => ({
  partners: many(partners),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  partner: one(partners, {
    fields: [commissions.partnerId],
    references: [partners.id],
  }),
  deal: one(deals, {
    fields: [commissions.dealId],
    references: [deals.id],
  }),
  customer: one(contacts, {
    fields: [commissions.customerId],
    references: [contacts.id],
  }),
  profile: one(profiles, {
    fields: [commissions.profileId],
    references: [profiles.id],
  }),
}));

export const payoutsRelations = relations(payouts, ({ one, many }) => ({
  partner: one(partners, {
    fields: [payouts.partnerId],
    references: [partners.id],
  }),
  processedBy: one(profiles, {
    fields: [payouts.processedBy],
    references: [profiles.id],
  }),
}));

export const partnerCustomersRelations = relations(partnerCustomers, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerCustomers.partnerId],
    references: [partners.id],
  }),
  customer: one(contacts, {
    fields: [partnerCustomers.customerId],
    references: [contacts.id],
  }),
}));

export const partnerMetricsRelations = relations(partnerMetrics, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerMetrics.partnerId],
    references: [partners.id],
  }),
}));

// Insert schemas for partner tables
export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerTierSchema = createInsertSchema(partnerTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  paidAt: true,
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  processedAt: true,
});

export const insertPartnerCustomerSchema = createInsertSchema(partnerCustomers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeaturePackageSchema = createInsertSchema(featurePackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerMetricsSchema = createInsertSchema(partnerMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// White Label Configuration Tables

// Tenant configurations (for multi-tenancy and white-labeling)
export const tenantConfigs = pgTable("tenant_configs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().unique(), // Unique identifier for tenant
  companyName: text("company_name"),
  logo: text("logo"), // Logo URL
  favicon: text("favicon"), // Favicon URL
  primaryColor: text("primary_color").default("#3B82F6"),
  secondaryColor: text("secondary_color").default("#1E40AF"),
  accentColor: text("accent_color").default("#10B981"),
  backgroundColor: text("background_color").default("#FFFFFF"),
  textColor: text("text_color").default("#1F2937"),
  customDomain: text("custom_domain"),
  customCSS: text("custom_css"),
  emailFromName: text("email_from_name"),
  emailReplyTo: text("email_reply_to"),
  emailSignature: text("email_signature"),
  features: json("features"), // Feature toggles and settings
  brandingConfig: json("branding_config"), // Complete branding configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profiles.id), // Tenant owner
});

// White Label Package Configurations
export const whiteLabelPackages = pgTable("white_label_packages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  features: text("features").array(), // Array of enabled features
  pricing: json("pricing"), // Pricing configuration
  customizations: json("customizations"), // Available customization options
  restrictions: json("restrictions"), // Feature restrictions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User White Label Settings (per user customizations)
export const userWLSettings = pgTable("user_wl_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  packageId: uuid("package_id").references(() => whiteLabelPackages.id),
  customBranding: json("custom_branding"), // User's custom branding settings
  enabledFeatures: text("enabled_features").array(), // User's enabled WL features
  preferences: json("preferences"), // User interface preferences
  settings: json("settings"), // Additional settings storage
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner White Label Configurations (extends partners table)
export const partnerWLConfigs = pgTable("partner_wl_configs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: uuid("partner_id").references(() => partners.id).notNull().unique(),
  brandingActive: boolean("branding_active").default(false),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  customDomain: text("custom_domain"),
  emailBranding: json("email_branding"), // Email template customizations
  uiCustomizations: json("ui_customizations"), // UI theme customizations
  featureOverrides: json("feature_overrides"), // Feature availability overrides
  apiSettings: json("api_settings"), // API configuration for partner
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// White Label insert schemas
export const insertTenantConfigSchema = createInsertSchema(tenantConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWhiteLabelPackageSchema = createInsertSchema(whiteLabelPackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserWLSettingsSchema = createInsertSchema(userWLSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerWLConfigSchema = createInsertSchema(partnerWLConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Backward compatibility - keep User types but make them reference Profile
export type User = Profile;
export type InsertUser = InsertProfile;

// White Label types
export type TenantConfig = typeof tenantConfigs.$inferSelect;
export type InsertTenantConfig = z.infer<typeof insertTenantConfigSchema>;
export type WhiteLabelPackage = typeof whiteLabelPackages.$inferSelect;
export type InsertWhiteLabelPackage = z.infer<typeof insertWhiteLabelPackageSchema>;
export type UserWLSettings = typeof userWLSettings.$inferSelect;
export type InsertUserWLSettings = z.infer<typeof insertUserWLSettingsSchema>;
export type PartnerWLConfig = typeof partnerWLConfigs.$inferSelect;
export type InsertPartnerWLConfig = z.infer<typeof insertPartnerWLConfigSchema>;

// Export partner types
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type PartnerTier = typeof partnerTiers.$inferSelect;
export type InsertPartnerTier = z.infer<typeof insertPartnerTierSchema>;
export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type PartnerCustomer = typeof partnerCustomers.$inferSelect;
export type InsertPartnerCustomer = z.infer<typeof insertPartnerCustomerSchema>;
export type FeaturePackage = typeof featurePackages.$inferSelect;
export type InsertFeaturePackage = z.infer<typeof insertFeaturePackageSchema>;
export type PartnerMetrics = typeof partnerMetrics.$inferSelect;
export type InsertPartnerMetrics = z.infer<typeof insertPartnerMetricsSchema>;