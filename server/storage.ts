import {
  users,
  affiliatePrograms,
  affiliateLinks,
  affiliateApplications,
  performanceData,
  userSettings,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sum, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
}

export const storage = new DatabaseStorage();
