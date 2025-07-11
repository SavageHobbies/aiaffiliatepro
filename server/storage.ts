import {
  users,
  affiliatePrograms,
  affiliateLinks,
  affiliateApplications,
  performanceData,
  userSettings,
  commissionPayments,
  linkMonitoring,
  fraudDetection,
  contentPerformance,
  competitorTracking,
  taxCompliance,
  generatedContent,
  deploymentLogs,
  type User,
  type UpsertUser,
  type AffiliateProgram,
  type InsertAffiliateProgram,
  type AffiliateLink,
  type InsertAffiliateLink,
  type AffiliateApplication,
  type InsertAffiliateApplication,
  type PerformanceData,
  type InsertPerformanceData,
  type UserSettings,
  type InsertUserSettings,
  type CommissionPayment,
  type InsertCommissionPayment,
  type LinkMonitoring,
  type InsertLinkMonitoring,
  type FraudDetection,
  type InsertFraudDetection,
  type ContentPerformance,
  type InsertContentPerformance,
  type CompetitorTracking,
  type InsertCompetitorTracking,
  type TaxCompliance,
  type InsertTaxCompliance,
  type GeneratedContent,
  type InsertGeneratedContent,
  type DeploymentLog,
  type InsertDeploymentLog,
  // Assuming these types are from @shared/schema and include password, hashedPassword, salt
  type InsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sum, count, sql } from "drizzle-orm";
import crypto from 'crypto';

// Define a type for creating a user via local registration (includes password)
// Assuming InsertUser from @shared/schema includes email, password, firstName, lastName
type CreateUserPayload = Omit<InsertUser, 'id' | 'hashedPassword' | 'salt' | 'createdAt' | 'updatedAt'> & {
  password: string;
};

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>; // Added for deserializeUser
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: CreateUserPayload): Promise<User>; // Updated type for local creation
  upsertUser(userData: UpsertUser): Promise<User>; // This is for OAuth/external user updates

  // Affiliate program operations
  getUserPrograms(userId: string): Promise<AffiliateProgram[]>;
  createProgram(userId: string, program: InsertAffiliateProgram): Promise<AffiliateProgram>;
  updateProgram(id: number, userId: string, program: Partial<InsertAffiliateProgram>): Promise<AffiliateProgram>;
  deleteProgram(id: number, userId: string): Promise<void>;
  getProgram(id: number, userId: string): Promise<AffiliateProgram | undefined>;

  // Affiliate link operations
  getUserLinks(userId: string): Promise<AffiliateLink[]>;
  createLink(userId: string, link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateLink(id: number, userId: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink>;
  deleteLink(id: number, userId: string): Promise<void>;
  getLink(id: number, userId: string): Promise<AffiliateLink | undefined>;

  // Affiliate application operations
  getUserApplications(userId: string): Promise<AffiliateApplication[]>;
  createApplication(userId: string, application: InsertAffiliateApplication): Promise<AffiliateApplication>;
  updateApplication(id: number, userId: string, application: Partial<InsertAffiliateApplication>): Promise<AffiliateApplication>;
  deleteApplication(id: number, userId: string): Promise<void>;
  getApplication(id: number, userId: string): Promise<AffiliateApplication | undefined>;

  // Performance data operations
  createPerformanceData(data: InsertPerformanceData): Promise<PerformanceData>;
  getUserPerformanceData(userId: string, startDate?: Date, endDate?: Date): Promise<PerformanceData[]>;

  // Analytics operations
  getUserStats(userId: string): Promise<{
    totalEarnings: number;
    totalClicks: number;
    totalConversions: number;
    activePrograms: number;
    conversionRate: number;
  }>;

  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(userId: string, settings: InsertUserSettings): Promise<UserSettings>;

  // Commission payment operations
  getUserCommissionPayments(userId: string): Promise<CommissionPayment[]>;
  createCommissionPayment(userId: string, payment: InsertCommissionPayment): Promise<CommissionPayment>;
  updateCommissionPayment(id: number, userId: string, payment: Partial<InsertCommissionPayment>): Promise<CommissionPayment>;
  deleteCommissionPayment(id: number, userId: string): Promise<void>;

  // Link monitoring operations
  getLinkMonitoring(linkId: number): Promise<LinkMonitoring[]>;
  createLinkMonitoring(monitoring: InsertLinkMonitoring): Promise<LinkMonitoring>;
  updateLinkMonitoring(id: number, monitoring: Partial<InsertLinkMonitoring>): Promise<LinkMonitoring>;
  checkLinkHealth(linkId: number): Promise<LinkMonitoring>;

  // Fraud detection operations
  createFraudDetection(detection: InsertFraudDetection): Promise<FraudDetection>;
  getFraudDetection(userId: string, startDate?: Date, endDate?: Date): Promise<FraudDetection[]>;
  analyzeFraudRisk(linkId: number, ipAddress: string, userAgent: string): Promise<number>;

  // Content performance operations
  getUserContentPerformance(userId: string): Promise<ContentPerformance[]>;
  createContentPerformance(userId: string, content: InsertContentPerformance): Promise<ContentPerformance>;
  updateContentPerformance(id: number, userId: string, content: Partial<InsertContentPerformance>): Promise<ContentPerformance>;
  deleteContentPerformance(id: number, userId: string): Promise<void>;

  // Competitor tracking operations
  getUserCompetitorTracking(userId: string): Promise<CompetitorTracking[]>;
  createCompetitorTracking(userId: string, competitor: InsertCompetitorTracking): Promise<CompetitorTracking>;
  updateCompetitorTracking(id: number, userId: string, competitor: Partial<InsertCompetitorTracking>): Promise<CompetitorTracking>;
  deleteCompetitorTracking(id: number, userId: string): Promise<void>;

  // Tax compliance operations
  getUserTaxCompliance(userId: string): Promise<TaxCompliance[]>;
  createTaxCompliance(userId: string, tax: InsertTaxCompliance): Promise<TaxCompliance>;
  updateTaxCompliance(id: number, userId: string, tax: Partial<InsertTaxCompliance>): Promise<TaxCompliance>;
  deleteTaxCompliance(id: number, userId: string): Promise<void>;

  // Content generation operations
  getUserGeneratedContent(userId: string): Promise<GeneratedContent[]>;
  createGeneratedContent(userId: string, content: InsertGeneratedContent): Promise<GeneratedContent>;
  updateGeneratedContent(id: number, userId: string, content: Partial<InsertGeneratedContent>): Promise<GeneratedContent>;
  deleteGeneratedContent(id: number, userId: string): Promise<void>;
  getGeneratedContent(id: number, userId: string): Promise<GeneratedContent | undefined>;

  // SSH deployment operations
  createDeploymentLog(log: InsertDeploymentLog): Promise<DeploymentLog>;
  getDeploymentLogs(contentId: number): Promise<DeploymentLog[]>;

  // Advanced analytics operations
  getAdvancedUserStats(userId: string): Promise<{
    totalEarnings: number;
    totalClicks: number;
    totalConversions: number;
    activePrograms: number;
    conversionRate: number;
    averageOrderValue: number;
    topPerformingContent: ContentPerformance[];
    fraudDetectionAlerts: number;
    paymentsPending: number;
    linkHealthScore: number;
    competitorInsights: CompetitorTracking[];
    taxComplianceStatus: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Handles local user registration
  async createUser(userData: CreateUserPayload): Promise<User> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(userData.password, salt, 1000, 64, 'sha512').toString('hex');
    const id = crypto.randomUUID();

    const [newUser] = await db
      .insert(users)
      .values({
        id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        hashedPassword,
        salt,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Default values for other fields if not provided in CreateUserPayload
        profileImageUrl: userData.profileImageUrl || null,
        website: userData.website || null,
      })
      .returning();

    return newUser;
  }

  // Handles updates for existing users, especially from OAuth (where password/salt aren't provided)
  async upsertUser(userData: UpsertUser): Promise<User> {
    // Attempt to find user by ID if provided, or by email if ID is not available (e.g., from OAuth claims)
    let existingUser: User | undefined;
    if (userData.id) {
      existingUser = await this.getUserById(userData.id);
    } else if (userData.email) {
      existingUser = await this.getUserByEmail(userData.email);
    }

    if (existingUser) {
      // User exists, update their profile data (excluding password/salt for OAuth updates)
      const [updatedUser] = await db
        .update(users)
        .set({
          firstName: userData.firstName ?? existingUser.firstName, // Use ?? to keep existing if undefined
          lastName: userData.lastName ?? existingUser.lastName,
          email: userData.email ?? existingUser.email, // Email should generally not change via upsert
          profileImageUrl: userData.profileImageUrl ?? existingUser.profileImageUrl,
          website: userData.website ?? existingUser.website,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    } else {
      // User does not exist, insert a new user (this path is primarily for initial OAuth user creation)
      // Ensure all required fields for InsertUser are present.
      // For OAuth, password and salt are NOT provided, so they must be optional in schema or handled.
      // Assuming 'hashedPassword' and 'salt' are nullable in your schema for OAuth users.
      const id = userData.id || crypto.randomUUID(); // Generate ID if not provided (e.g., for new OAuth users)
      const [newUser] = await db
        .insert(users)
        .values({
          id,
          email: userData.email!, // Email is crucial for new users
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          website: userData.website || null,
          hashedPassword: null, // OAuth users don't have local passwords
          salt: null, // OAuth users don't have local passwords
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return newUser;
    }
  }

  // Affiliate program operations
  async getUserPrograms(userId: string): Promise<AffiliateProgram[]> {
    return await db
      .select()
      .from(affiliatePrograms)
      .where(eq(affiliatePrograms.userId, userId))
      .orderBy(desc(affiliatePrograms.createdAt));
  }

  async createProgram(userId: string, program: InsertAffiliateProgram): Promise<AffiliateProgram> {
    const [newProgram] = await db
      .insert(affiliatePrograms)
      .values({ ...program, userId })
      .returning();
    return newProgram;
  }

  async updateProgram(id: number, userId: string, program: Partial<InsertAffiliateProgram>): Promise<AffiliateProgram> {
    const [updatedProgram] = await db
      .update(affiliatePrograms)
      .set({ ...program, updatedAt: new Date() })
      .where(and(eq(affiliatePrograms.id, id), eq(affiliatePrograms.userId, userId)))
      .returning();
    return updatedProgram;
  }

  async deleteProgram(id: number, userId: string): Promise<void> {
    await db
      .delete(affiliatePrograms)
      .where(and(eq(affiliatePrograms.id, id), eq(affiliatePrograms.userId, userId)));
  }

  async getProgram(id: number, userId: string): Promise<AffiliateProgram | undefined> {
    const [program] = await db
      .select()
      .from(affiliatePrograms)
      .where(and(eq(affiliatePrograms.id, id), eq(affiliatePrograms.userId, userId)));
    return program;
  }

  // Affiliate link operations
  async getUserLinks(userId: string): Promise<AffiliateLink[]> {
    return await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, userId))
      .orderBy(desc(affiliateLinks.createdAt));
  }

  async createLink(userId: string, link: InsertAffiliateLink): Promise<AffiliateLink> {
    const [newLink] = await db
      .insert(affiliateLinks)
      .values({ ...link, userId })
      .returning();
    return newLink;
  }

  async updateLink(id: number, userId: string, link: Partial<InsertAffiliateLink>): Promise<AffiliateLink> {
    const [updatedLink] = await db
      .update(affiliateLinks)
      .set({ ...link, updatedAt: new Date() })
      .where(and(eq(affiliateLinks.id, id), eq(affiliateLinks.userId, userId)))
      .returning();
    return updatedLink;
  }

  async deleteLink(id: number, userId: string): Promise<void> {
    await db
      .delete(affiliateLinks)
      .where(and(eq(affiliateLinks.id, id), eq(affiliateLinks.userId, userId)));
  }

  async getLink(id: number, userId: string): Promise<AffiliateLink | undefined> {
    const [link] = await db
      .select()
      .from(affiliateLinks)
      .where(and(eq(affiliateLinks.id, id), eq(affiliateLinks.userId, userId)));
    return link;
  }

  // Performance data operations
  async createPerformanceData(data: InsertPerformanceData): Promise<PerformanceData> {
    const [newData] = await db
      .insert(performanceData)
      .values(data)
      .returning();
    return newData;
  }

  async getUserPerformanceData(userId: string, startDate?: Date, endDate?: Date): Promise<PerformanceData[]> {
    let query = db.select().from(performanceData).where(eq(performanceData.userId, userId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(performanceData.userId, userId),
          sql`${performanceData.date} >= ${startDate}`,
          sql`${performanceData.date} <= ${endDate}`
        )
      );
    }
    
    return await query.orderBy(desc(performanceData.date));
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    totalEarnings: number;
    totalClicks: number;
    totalConversions: number;
    activePrograms: number;
    conversionRate: number;
  }> {
    // Get total earnings from links
    const [earningsResult] = await db
      .select({ total: sum(affiliateLinks.earnings) })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, userId));

    // Get total clicks and conversions from links
    const [clicksResult] = await db
      .select({ 
        totalClicks: sum(affiliateLinks.clicks),
        totalConversions: sum(affiliateLinks.conversions)
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, userId));

    // Get active programs count
    const [programsResult] = await db
      .select({ count: count() })
      .from(affiliatePrograms)
      .where(and(eq(affiliatePrograms.userId, userId), eq(affiliatePrograms.status, "active")));

    const totalEarnings = Number(earningsResult?.total || 0);
    const totalClicks = Number(clicksResult?.totalClicks || 0);
    const totalConversions = Number(clicksResult?.totalConversions || 0);
    const activePrograms = Number(programsResult?.count || 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      totalEarnings,
      totalClicks,
      totalConversions,
      activePrograms,
      conversionRate,
    };
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(userId: string, settings: InsertUserSettings): Promise<UserSettings> {
    const [upsertedSettings] = await db
      .insert(userSettings)
      .values({ ...settings, userId })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSettings;
  }

  // Affiliate application operations
  async getUserApplications(userId: string): Promise<AffiliateApplication[]> {
    return await db
      .select()
      .from(affiliateApplications)
      .where(eq(affiliateApplications.userId, userId))
      .orderBy(desc(affiliateApplications.applicationDate));
  }

  async createApplication(userId: string, application: InsertAffiliateApplication): Promise<AffiliateApplication> {
    const [newApplication] = await db
      .insert(affiliateApplications)
      .values({ ...application, userId })
      .returning();
    return newApplication;
  }

  async updateApplication(id: number, userId: string, application: Partial<InsertAffiliateApplication>): Promise<AffiliateApplication> {
    const [updatedApplication] = await db
      .update(affiliateApplications)
      .set({ ...application, updatedAt: new Date() })
      .where(and(eq(affiliateApplications.id, id), eq(affiliateApplications.userId, userId)))
      .returning();
    return updatedApplication;
  }

  async deleteApplication(id: number, userId: string): Promise<void> {
    await db
      .delete(affiliateApplications)
      .where(and(eq(affiliateApplications.id, id), eq(affiliateApplications.userId, userId)));
  }

  async getApplication(id: number, userId: string): Promise<AffiliateApplication | undefined> {
    const [application] = await db
      .select()
      .from(affiliateApplications)
      .where(and(eq(affiliateApplications.id, id), eq(affiliateApplications.userId, userId)));
    return application;
  }

  // Commission payment operations
  async getUserCommissionPayments(userId: string): Promise<CommissionPayment[]> {
    return await db
      .select()
      .from(commissionPayments)
      .where(eq(commissionPayments.userId, userId))
      .orderBy(desc(commissionPayments.createdAt));
  }

  async createCommissionPayment(userId: string, payment: InsertCommissionPayment): Promise<CommissionPayment> {
    const [newPayment] = await db
      .insert(commissionPayments)
      .values({ ...payment, userId })
      .returning();
    return newPayment;
  }

  async updateCommissionPayment(id: number, userId: string, payment: Partial<InsertCommissionPayment>): Promise<CommissionPayment> {
    const [updatedPayment] = await db
      .update(commissionPayments)
      .set(payment)
      .where(and(eq(commissionPayments.id, id), eq(commissionPayments.userId, userId)))
      .returning();
    return updatedPayment;
  }

  async deleteCommissionPayment(id: number, userId: string): Promise<void> {
    await db
      .delete(commissionPayments)
      .where(and(eq(commissionPayments.id, id), eq(commissionPayments.userId, userId)));
  }

  // Link monitoring operations
  async getLinkMonitoring(linkId: number): Promise<LinkMonitoring[]> {
    return await db
      .select()
      .from(linkMonitoring)
      .where(eq(linkMonitoring.linkId, linkId))
      .orderBy(desc(linkMonitoring.lastChecked));
  }

  async createLinkMonitoring(monitoring: InsertLinkMonitoring): Promise<LinkMonitoring> {
    const [newMonitoring] = await db
      .insert(linkMonitoring)
      .values(monitoring)
      .returning();
    return newMonitoring;
  }

  async updateLinkMonitoring(id: number, monitoring: Partial<InsertLinkMonitoring>): Promise<LinkMonitoring> {
    const [updatedMonitoring] = await db
      .update(linkMonitoring)
      .set(monitoring)
      .where(eq(linkMonitoring.id, id))
      .returning();
    return updatedMonitoring;
  }

  async checkLinkHealth(linkId: number): Promise<LinkMonitoring> {
    // This would integrate with actual link checking logic
    const monitoring = {
      linkId,
      lastChecked: new Date(),
      status: "active" as const,
      responseTime: Math.floor(Math.random() * 500) + 100, // Simulation
      httpStatus: 200,
      checksToday: 1,
    };
    
    return await this.createLinkMonitoring(monitoring);
  }

  // Fraud detection operations
  async createFraudDetection(detection: InsertFraudDetection): Promise<FraudDetection> {
    const [newDetection] = await db
      .insert(fraudDetection)
      .values(detection)
      .returning();
    return newDetection;
  }

  async getFraudDetection(userId: string, startDate?: Date, endDate?: Date): Promise<FraudDetection[]> {
    // Join with affiliate links to filter by user
    let query = db
      .select()
      .from(fraudDetection)
      .innerJoin(affiliateLinks, eq(fraudDetection.linkId, affiliateLinks.id))
      .where(eq(affiliateLinks.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(affiliateLinks.userId, userId),
          sql`${fraudDetection.clickTime} > NOW() - INTERVAL '1 hour'`, // Example: last hour
          sql`${fraudDetection.clickTime} >= ${startDate}`,
          sql`${fraudDetection.clickTime} <= ${endDate}`
        )
      );
    }

    const result = await query.orderBy(desc(fraudDetection.clickTime));
    return result.map(row => row.fraud_detection);
  }

  async analyzeFraudRisk(linkId: number, ipAddress: string, userAgent: string): Promise<number> {
    // Check for duplicate clicks from same IP
    const recentClicks = await db
      .select()
      .from(fraudDetection)
      .where(
        and(
          eq(fraudDetection.linkId, linkId),
          eq(fraudDetection.ipAddress, ipAddress),
          sql`${fraudDetection.clickTime} > NOW() - INTERVAL '1 hour'`
        )
      );

    let riskScore = 0;
    
    // Multiple clicks from same IP in short time
    if (recentClicks.length > 3) riskScore += 30;
    
    // Check for suspicious user agents
    if (userAgent.includes('bot') || userAgent.includes('crawler')) riskScore += 40;
    
    // Check for suspicious patterns
    if (userAgent.length < 20) riskScore += 20;
    
    return Math.min(riskScore, 100);
  }

  // Content performance operations
  async getUserContentPerformance(userId: string): Promise<ContentPerformance[]> {
    return await db
      .select()
      .from(contentPerformance)
      .where(eq(contentPerformance.userId, userId))
      .orderBy(desc(contentPerformance.lastUpdated));
  }

  async createContentPerformance(userId: string, content: InsertContentPerformance): Promise<ContentPerformance> {
    const [newContent] = await db
      .insert(contentPerformance)
      .values({ ...content, userId })
      .returning();
    return newContent;
  }

  async updateContentPerformance(id: number, userId: string, content: Partial<InsertContentPerformance>): Promise<ContentPerformance> {
    const [updatedContent] = await db
      .update(contentPerformance)
      .set({ ...content, lastUpdated: new Date() })
      .where(and(eq(contentPerformance.id, id), eq(contentPerformance.userId, userId)))
      .returning();
    return updatedContent;
  }

  async deleteContentPerformance(id: number, userId: string): Promise<void> {
    await db
      .delete(contentPerformance)
      .where(and(eq(contentPerformance.id, id), eq(contentPerformance.userId, userId)));
  }

  // Competitor tracking operations
  async getUserCompetitorTracking(userId: string): Promise<CompetitorTracking[]> {
    return await db
      .select()
      .from(competitorTracking)
      .where(eq(competitorTracking.userId, userId))
      .orderBy(desc(competitorTracking.lastAnalyzed));
  }

  async createCompetitorTracking(userId: string, competitor: InsertCompetitorTracking): Promise<CompetitorTracking> {
    const [newCompetitor] = await db
      .insert(competitorTracking)
      .values({ ...competitor, userId })
      .returning();
    return newCompetitor;
  }

  async updateCompetitorTracking(id: number, userId: string, competitor: Partial<InsertCompetitorTracking>): Promise<CompetitorTracking> {
    const [updatedCompetitor] = await db
      .update(competitorTracking)
      .set({ ...competitor, lastAnalyzed: new Date() })
      .where(and(eq(competitorTracking.id, id), eq(competitorTracking.userId, userId)))
      .returning();
    return updatedCompetitor;
  }

  async deleteCompetitorTracking(id: number, userId: string): Promise<void> {
    await db
      .delete(competitorTracking)
      .where(and(eq(competitorTracking.id, id), eq(competitorTracking.userId, userId)));
  }

  // Tax compliance operations
  async getUserTaxCompliance(userId: string): Promise<TaxCompliance[]> {
    return await db
      .select()
      .from(taxCompliance)
      .where(eq(taxCompliance.userId, userId))
      .orderBy(desc(taxCompliance.taxYear));
  }

  async createTaxCompliance(userId: string, tax: InsertTaxCompliance): Promise<TaxCompliance> {
    const [newTax] = await db
      .insert(taxCompliance)
      .values({ ...tax, userId })
      .returning();
    return newTax;
  }

  async updateTaxCompliance(id: number, userId: string, tax: Partial<InsertTaxCompliance>): Promise<TaxCompliance> {
    const [updatedTax] = await db
      .update(taxCompliance)
      .set(tax)
      .where(and(eq(taxCompliance.id, id), eq(taxCompliance.userId, userId)))
      .returning();
    return updatedTax;
  }

  async deleteTaxCompliance(id: number, userId: string): Promise<void> {
    await db
      .delete(taxCompliance)
      .where(and(eq(taxCompliance.id, id), eq(taxCompliance.userId, userId)));
  }

  // Advanced analytics operations
  async getAdvancedUserStats(userId: string): Promise<{
    totalEarnings: number;
    totalClicks: number;
    totalConversions: number;
    activePrograms: number;
    conversionRate: number;
    averageOrderValue: number;
    topPerformingContent: ContentPerformance[];
    fraudDetectionAlerts: number;
    paymentsPending: number;
    linkHealthScore: number;
    competitorInsights: CompetitorTracking[];
    taxComplianceStatus: string;
  }> {
    // Get basic stats (reuse existing getUserStats logic)
    const basicStats = await this.getUserStats(userId);
    
    // Get top performing content
    const topContent = await db
      .select()
      .from(contentPerformance)
      .where(eq(contentPerformance.userId, userId))
      .orderBy(desc(contentPerformance.totalEarnings))
      .limit(5);

    // Get fraud alerts count (last 30 days)
    const [fraudAlertsResult] = await db
      .select({ count: count() })
      .from(fraudDetection)
      .innerJoin(affiliateLinks, eq(fraudDetection.linkId, affiliateLinks.id))
      .where(
        and(
          eq(affiliateLinks.userId, userId),
          eq(fraudDetection.suspicious, true),
          sql`${fraudDetection.clickTime} > NOW() - INTERVAL '30 days'`
        )
      );

    // Get pending payments count
    const [pendingPaymentsResult] = await db
      .select({ count: count() })
      .from(commissionPayments)
      .where(
        and(
          eq(commissionPayments.userId, userId),
          eq(commissionPayments.status, "pending")
        )
      );

    // Calculate average link health score
    const linkHealthResults = await db
      .select({ 
        avgResponseTime: sql<number>`AVG(${linkMonitoring.responseTime})`,
        activeCount: count(),
      })
      .from(linkMonitoring)
      .innerJoin(affiliateLinks, eq(linkMonitoring.linkId, affiliateLinks.id))
      .where(
        and(
          eq(affiliateLinks.userId, userId),
          eq(linkMonitoring.status, "active")
        )
      );

    const avgResponseTime = linkHealthResults[0]?.avgResponseTime || 500;
    const linkHealthScore = Math.max(0, Math.min(100, 100 - (avgResponseTime / 10)));

    // Get competitor insights
    const competitorInsights = await db
      .select()
      .from(competitorTracking)
      .where(eq(competitorTracking.userId, userId))
      .orderBy(desc(competitorTracking.lastAnalyzed))
      .limit(3);

    // Check tax compliance status
    const currentYear = new Date().getFullYear();
    const [currentYearTax] = await db
      .select()
      .from(taxCompliance)
      .where(
        and(
          eq(taxCompliance.userId, userId),
          eq(taxCompliance.taxYear, currentYear)
        )
      );

    const taxStatus = currentYearTax?.filingStatus || "pending";

    // Calculate average order value
    const totalEarnings = basicStats.totalEarnings;
    const totalConversions = basicStats.totalConversions;
    const averageOrderValue = totalConversions > 0 ? totalEarnings / totalConversions : 0;

    return {
      ...basicStats,
      averageOrderValue,
      topPerformingContent: topContent,
      fraudDetectionAlerts: fraudAlertsResult?.count || 0,
      paymentsPending: pendingPaymentsResult?.count || 0,
      linkHealthScore: Math.round(linkHealthScore),
      competitorInsights,
      taxComplianceStatus: taxStatus,
    };
  }

  // Content generation operations
  async getUserGeneratedContent(userId: string): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.userId, userId))
      .orderBy(desc(generatedContent.createdAt));
  }

  async createGeneratedContent(userId: string, content: InsertGeneratedContent): Promise<GeneratedContent> {
    const [newContent] = await db
      .insert(generatedContent)
      .values({ ...content, userId })
      .returning();
    return newContent;
  }

  async updateGeneratedContent(id: number, userId: string, content: Partial<InsertGeneratedContent>): Promise<GeneratedContent> {
    const [updatedContent] = await db
      .update(generatedContent)
      .set({ ...content, updatedAt: new Date() })
      .where(and(eq(generatedContent.id, id), eq(generatedContent.userId, userId)))
      .returning();
    return updatedContent;
  }

  async deleteGeneratedContent(id: number, userId: string): Promise<void> {
    await db
      .delete(generatedContent)
      .where(and(eq(generatedContent.id, id), eq(generatedContent.userId, userId)));
  }

  async getGeneratedContent(id: number, userId: string): Promise<GeneratedContent | undefined> {
    const [content] = await db
      .select()
      .from(generatedContent)
      .where(and(eq(generatedContent.id, id), eq(generatedContent.userId, userId)));
    return content;
  }

  // SSH deployment operations
  async createDeploymentLog(log: InsertDeploymentLog): Promise<DeploymentLog> {
    const [newLog] = await db
      .insert(deploymentLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getDeploymentLogs(contentId: number): Promise<DeploymentLog[]> {
    return await db
      .select()
      .from(deploymentLogs)
      .where(eq(deploymentLogs.contentId, contentId))
      .orderBy(desc(deploymentLogs.deployedAt));
  }
}

export const storage = new DatabaseStorage();
