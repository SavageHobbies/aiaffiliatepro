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

// User settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  emailNotifications: boolean("email_notifications").default(true),
  commissionAlerts: boolean("commission_alerts").default(true),
  weeklyReports: boolean("weekly_reports").default(false),
  currency: varchar("currency").default("USD"),
  timezone: varchar("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
