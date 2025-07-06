import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  website: varchar("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Affiliate programs table
export const affiliatePrograms = pgTable("affiliate_programs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  network: varchar("network"), // Amazon Associates, ShareASale, CJ Affiliate, etc.
  category: varchar("category"),
  dashboardUrl: varchar("dashboard_url"),
  commissionStructure: varchar("commission_structure"),
  cookieDuration: varchar("cookie_duration"),
  paymentThreshold: varchar("payment_threshold"),
  paymentMethod: varchar("payment_method"),
  contactEmail: varchar("contact_email"),
  status: varchar("status").notNull().default("pending"), // active, pending, rejected, inactive
  notes: text("notes"),
  dateJoined: timestamp("date_joined"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Affiliate links table
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programId: integer("program_id").references(() => affiliatePrograms.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  originalUrl: text("original_url").notNull(),
  shortUrl: varchar("short_url"),
  description: text("description"),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance tracking table
export const performanceData = pgTable("performance_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programId: integer("program_id").references(() => affiliatePrograms.id, { onDelete: "cascade" }),
  linkId: integer("link_id").references(() => affiliateLinks.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Affiliate program applications table
export const affiliateApplications = pgTable("affiliate_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programName: varchar("program_name").notNull(),
  companyName: varchar("company_name").notNull(),
  website: varchar("website"),
  applicationUrl: varchar("application_url"),
  applicationDate: timestamp("application_date").defaultNow(),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected, under_review
  expectedResponseTime: varchar("expected_response_time"), // e.g., "7-14 days"
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  requirements: text("requirements"), // Store specific requirements mentioned
  contactEmail: varchar("contact_email"),
  commissionRate: varchar("commission_rate"),
  priority: varchar("priority").default("medium"), // high, medium, low
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commission payments tracking table
export const commissionPayments = pgTable("commission_payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programId: integer("program_id").references(() => affiliatePrograms.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  paymentDate: timestamp("payment_date"),
  expectedPaymentDate: timestamp("expected_payment_date"),
  status: varchar("status").default("pending"), // pending, processing, paid, failed
  paymentMethod: varchar("payment_method"), // paypal, bank_transfer, check, etc.
  transactionId: varchar("transaction_id"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0.00"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Link monitoring table for tracking link health
export const linkMonitoring = pgTable("link_monitoring", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull().references(() => affiliateLinks.id, { onDelete: "cascade" }),
  lastChecked: timestamp("last_checked").defaultNow(),
  status: varchar("status").default("active"), // active, broken, redirect_changed, expired
  responseTime: integer("response_time"), // in milliseconds
  httpStatus: integer("http_status"),
  finalUrl: text("final_url"), // after redirects
  errorMessage: text("error_message"),
  checksToday: integer("checks_today").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fraud detection table
export const fraudDetection = pgTable("fraud_detection", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").references(() => affiliateLinks.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  clickTime: timestamp("click_time").defaultNow(),
  suspicious: boolean("suspicious").default(false),
  fraudType: varchar("fraud_type"), // click_fraud, bot_traffic, cookie_stuffing, duplicate_click
  riskScore: integer("risk_score").default(0), // 0-100
  geoLocation: varchar("geo_location"),
  sessionId: varchar("session_id"),
  referrer: text("referrer"),
  deviceFingerprint: text("device_fingerprint"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content performance tracking
export const contentPerformance = pgTable("content_performance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentUrl: text("content_url").notNull(),
  contentTitle: varchar("content_title"),
  contentType: varchar("content_type"), // blog_post, video, social_media, email
  publishDate: timestamp("publish_date"),
  totalClicks: integer("total_clicks").default(0),
  totalConversions: integer("total_conversions").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.00"),
  avgOrderValue: decimal("avg_order_value", { precision: 10, scale: 2 }).default("0.00"),
  seoRanking: integer("seo_ranking"),
  socialShares: integer("social_shares").default(0),
  emailOpens: integer("email_opens").default(0),
  emailClicks: integer("email_clicks").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Competitor tracking table
export const competitorTracking = pgTable("competitor_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  competitorName: varchar("competitor_name").notNull(),
  competitorUrl: text("competitor_url"),
  niche: varchar("niche"),
  estimatedTraffic: integer("estimated_traffic"),
  topProducts: text("top_products"), // JSON array of product names
  promotionStrategy: text("promotion_strategy"),
  lastAnalyzed: timestamp("last_analyzed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tax compliance tracking
export const taxCompliance = pgTable("tax_compliance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taxYear: integer("tax_year").notNull(),
  country: varchar("country").notNull(),
  totalIncome: decimal("total_income", { precision: 12, scale: 2 }).default("0.00"),
  totalExpenses: decimal("total_expenses", { precision: 12, scale: 2 }).default("0.00"),
  taxOwed: decimal("tax_owed", { precision: 12, scale: 2 }).default("0.00"),
  filingStatus: varchar("filing_status"), // filed, pending, overdue
  filingDate: timestamp("filing_date"),
  documents: text("documents"), // JSON array of document URLs
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  emailNotifications: boolean("email_notifications").default(true),
  commissionAlerts: boolean("commission_alerts").default(true),
  weeklyReports: boolean("weekly_reports").default(false),
  currency: varchar("currency").default("USD"),
  timezone: varchar("timezone").default("UTC"),
  // SSH hosting configuration
  sshHost: varchar("ssh_host"),
  sshUsername: varchar("ssh_username"),
  sshPassword: text("ssh_password"), // encrypted
  sshPort: integer("ssh_port").default(22),
  webRootPath: varchar("web_root_path").default("/public_html"),
  // AI API configuration
  openaiApiKey: text("openai_api_key"), // encrypted
  geminiApiKey: text("gemini_api_key"), // encrypted
  preferredAiProvider: varchar("preferred_ai_provider").default("openai"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content generation and deployment tracking
export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  contentType: varchar("content_type").notNull(), // 'comparison', 'review', 'landing_page'
  selectedPrograms: jsonb("selected_programs").notNull(), // array of program IDs
  aiPrompt: text("ai_prompt").notNull(),
  generatedHtml: text("generated_html").notNull(),
  generatedCss: text("generated_css"),
  status: varchar("status").default("draft"), // draft, published, archived
  deploymentPath: varchar("deployment_path"), // path on SSH server
  deploymentUrl: varchar("deployment_url"), // live URL
  seoKeywords: jsonb("seo_keywords"), // array of keywords
  metaDescription: text("meta_description"),
  totalViews: integer("total_views").default(0),
  totalClicks: integer("total_clicks").default(0),
  totalConversions: integer("total_conversions").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  lastDeployedAt: timestamp("last_deployed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SSH deployment logs
export const deploymentLogs = pgTable("deployment_logs", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => generatedContent.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status").notNull(), // success, failed, in_progress
  deploymentPath: varchar("deployment_path").notNull(),
  logMessage: text("log_message"),
  errorDetails: text("error_details"),
  deployedAt: timestamp("deployed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  programs: many(affiliatePrograms),
  links: many(affiliateLinks),
  performanceData: many(performanceData),
  applications: many(affiliateApplications),
  settings: one(userSettings),
}));

export const affiliateProgramsRelations = relations(affiliatePrograms, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliatePrograms.userId],
    references: [users.id],
  }),
  links: many(affiliateLinks),
  performanceData: many(performanceData),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliateLinks.userId],
    references: [users.id],
  }),
  program: one(affiliatePrograms, {
    fields: [affiliateLinks.programId],
    references: [affiliatePrograms.id],
  }),
  performanceData: many(performanceData),
}));

export const performanceDataRelations = relations(performanceData, ({ one }) => ({
  user: one(users, {
    fields: [performanceData.userId],
    references: [users.id],
  }),
  program: one(affiliatePrograms, {
    fields: [performanceData.programId],
    references: [affiliatePrograms.id],
  }),
  link: one(affiliateLinks, {
    fields: [performanceData.linkId],
    references: [affiliateLinks.id],
  }),
}));

export const affiliateApplicationsRelations = relations(affiliateApplications, ({ one }) => ({
  user: one(users, {
    fields: [affiliateApplications.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const commissionPaymentsRelations = relations(commissionPayments, ({ one }) => ({
  user: one(users, { fields: [commissionPayments.userId], references: [users.id] }),
  program: one(affiliatePrograms, { fields: [commissionPayments.programId], references: [affiliatePrograms.id] }),
}));

export const linkMonitoringRelations = relations(linkMonitoring, ({ one }) => ({
  link: one(affiliateLinks, { fields: [linkMonitoring.linkId], references: [affiliateLinks.id] }),
}));

export const fraudDetectionRelations = relations(fraudDetection, ({ one }) => ({
  link: one(affiliateLinks, { fields: [fraudDetection.linkId], references: [affiliateLinks.id] }),
}));

export const contentPerformanceRelations = relations(contentPerformance, ({ one }) => ({
  user: one(users, { fields: [contentPerformance.userId], references: [users.id] }),
}));

export const competitorTrackingRelations = relations(competitorTracking, ({ one }) => ({
  user: one(users, { fields: [competitorTracking.userId], references: [users.id] }),
}));

export const taxComplianceRelations = relations(taxCompliance, ({ one }) => ({
  user: one(users, { fields: [taxCompliance.userId], references: [users.id] }),
}));

export const generatedContentRelations = relations(generatedContent, ({ one, many }) => ({
  user: one(users, { fields: [generatedContent.userId], references: [users.id] }),
  deploymentLogs: many(deploymentLogs),
}));

export const deploymentLogsRelations = relations(deploymentLogs, ({ one }) => ({
  content: one(generatedContent, { fields: [deploymentLogs.contentId], references: [generatedContent.id] }),
  user: one(users, { fields: [deploymentLogs.userId], references: [users.id] }),
}));

// Schema types for forms and API
export const insertAffiliateProgramSchema = createInsertSchema(affiliatePrograms).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  userId: true,
  clicks: true,
  conversions: true,
  earnings: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceDataSchema = createInsertSchema(performanceData).omit({
  id: true,
  createdAt: true,
});

export const insertAffiliateApplicationSchema = createInsertSchema(affiliateApplications).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionPaymentSchema = createInsertSchema(commissionPayments).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertLinkMonitoringSchema = createInsertSchema(linkMonitoring).omit({
  id: true,
  createdAt: true,
});

export const insertFraudDetectionSchema = createInsertSchema(fraudDetection).omit({
  id: true,
  createdAt: true,
});

export const insertContentPerformanceSchema = createInsertSchema(contentPerformance).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertCompetitorTrackingSchema = createInsertSchema(competitorTracking).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertTaxComplianceSchema = createInsertSchema(taxCompliance).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  userId: true,
  totalViews: true,
  totalClicks: true,
  totalConversions: true,
  revenue: true,
  lastDeployedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeploymentLogSchema = createInsertSchema(deploymentLogs).omit({
  id: true,
  deployedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertAffiliateProgram = z.infer<typeof insertAffiliateProgramSchema>;
export type AffiliateProgram = typeof affiliatePrograms.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateApplication = z.infer<typeof insertAffiliateApplicationSchema>;
export type AffiliateApplication = typeof affiliateApplications.$inferSelect;
export type InsertPerformanceData = z.infer<typeof insertPerformanceDataSchema>;
export type PerformanceData = typeof performanceData.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertCommissionPayment = z.infer<typeof insertCommissionPaymentSchema>;
export type CommissionPayment = typeof commissionPayments.$inferSelect;
export type InsertLinkMonitoring = z.infer<typeof insertLinkMonitoringSchema>;
export type LinkMonitoring = typeof linkMonitoring.$inferSelect;
export type InsertFraudDetection = z.infer<typeof insertFraudDetectionSchema>;
export type FraudDetection = typeof fraudDetection.$inferSelect;
export type InsertContentPerformance = z.infer<typeof insertContentPerformanceSchema>;
export type ContentPerformance = typeof contentPerformance.$inferSelect;
export type InsertCompetitorTracking = z.infer<typeof insertCompetitorTrackingSchema>;
export type CompetitorTracking = typeof competitorTracking.$inferSelect;
export type InsertTaxCompliance = z.infer<typeof insertTaxComplianceSchema>;
export type TaxCompliance = typeof taxCompliance.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertDeploymentLog = z.infer<typeof insertDeploymentLogSchema>;
export type DeploymentLog = typeof deploymentLogs.$inferSelect;
