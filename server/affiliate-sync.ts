import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    clicks?: number;
    conversions?: number;
    earnings?: number;
    newLinks?: number;
  };
  error?: string;
}

export class AffiliateSyncService {
  
  // Amazon Associates API integration
  async syncAmazonAssociates(programId: number, credentials: any): Promise<SyncResult> {
    try {
      // Amazon Associates doesn't have a public API, so we'd need to scrape
      // or use their Product Advertising API for product data
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Login to Amazon Associates
      await page.goto(credentials.loginUrl || 'https://affiliate-program.amazon.com/');
      await page.type('#ap_email', credentials.username);
      await page.type('#ap_password', credentials.password);
      await page.click('#signInSubmit');
      
      // Wait for dashboard to load
      await page.waitForSelector('.dashboard', { timeout: 10000 });
      
      // Navigate to reports section
      await page.goto('https://affiliate-program.amazon.com/home/reports');
      
      // Extract performance data
      const data = await page.evaluate(() => {
        // This would extract actual data from the Amazon dashboard
        return {
          clicks: parseInt(document.querySelector('.clicks')?.textContent || '0'),
          conversions: parseInt(document.querySelector('.conversions')?.textContent || '0'),
          earnings: parseFloat(document.querySelector('.earnings')?.textContent?.replace('$', '') || '0')
        };
      });
      
      await browser.close();
      
      // Update database with new data
      await storage.updateProgramPerformance(programId, data);
      
      return {
        success: true,
        message: "Amazon Associates data synced successfully",
        data
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to sync Amazon Associates data",
        error: error.message
      };
    }
  }

  // ShareASale API integration
  async syncShareASale(programId: number, credentials: any): Promise<SyncResult> {
    try {
      if (!credentials.apiKey || !credentials.apiSecret || !credentials.affiliateId) {
        throw new Error("ShareASale API credentials incomplete");
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const version = "2.8";
      const action = "activity";
      
      // Create ShareASale API signature
      const stringToSign = `${credentials.apiKey}:${timestamp}:${credentials.affiliateId}:${action}`;
      const crypto = require('crypto');
      const signature = crypto.createHmac('sha256', credentials.apiSecret).update(stringToSign).digest('hex');

      const response = await axios.get('https://api.shareasale.com/w.cfm', {
        params: {
          affiliateId: credentials.affiliateId,
          token: credentials.apiKey,
          version,
          action,
          format: 'json',
          dateStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          dateEnd: new Date().toISOString().split('T')[0]
        },
        headers: {
          'x-ShareASale-Date': timestamp.toString(),
          'x-ShareASale-Authentication': signature
        }
      });

      const data = response.data;
      let totalClicks = 0;
      let totalConversions = 0;
      let totalEarnings = 0;

      if (data && Array.isArray(data)) {
        data.forEach((record: any) => {
          totalClicks += parseInt(record.clicks || 0);
          totalConversions += parseInt(record.sales || 0);
          totalEarnings += parseFloat(record.commission || 0);
        });
      }

      await storage.updateProgramPerformance(programId, {
        clicks: totalClicks,
        conversions: totalConversions,
        earnings: totalEarnings
      });

      return {
        success: true,
        message: "ShareASale data synced successfully",
        data: {
          clicks: totalClicks,
          conversions: totalConversions,
          earnings: totalEarnings
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to sync ShareASale data",
        error: error.message
      };
    }
  }

  // Commission Junction (CJ Affiliate) API integration
  async syncCommissionJunction(programId: number, credentials: any): Promise<SyncResult> {
    try {
      if (!credentials.apiKey) {
        throw new Error("CJ Affiliate API key required");
      }

      // Get commission data
      const commissionResponse = await axios.get('https://commission-detail.api.cj.com/v3/commissions', {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Accept': 'application/json'
        },
        params: {
          'date-type': 'event',
          'start-date': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          'end-date': new Date().toISOString().split('T')[0]
        }
      });

      let totalEarnings = 0;
      let totalConversions = 0;

      if (commissionResponse.data && commissionResponse.data.commissions) {
        commissionResponse.data.commissions.forEach((commission: any) => {
          totalEarnings += parseFloat(commission.commissionAmount || 0);
          totalConversions += 1;
        });
      }

      await storage.updateProgramPerformance(programId, {
        conversions: totalConversions,
        earnings: totalEarnings
      });

      return {
        success: true,
        message: "Commission Junction data synced successfully",
        data: {
          conversions: totalConversions,
          earnings: totalEarnings
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to sync Commission Junction data",
        error: error.message
      };
    }
  }

  // Generic web scraping for networks without APIs
  async syncGenericScraping(programId: number, credentials: any): Promise<SyncResult> {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Login to affiliate dashboard
      await page.goto(credentials.loginUrl);
      
      // Fill login form (this would need to be customized per network)
      await page.type('input[type="email"], input[name="username"], input[name="email"]', credentials.username);
      await page.type('input[type="password"], input[name="password"]', credentials.password);
      await page.click('button[type="submit"], input[type="submit"]');
      
      // Wait for dashboard
      await page.waitForNavigation();
      
      // Navigate to stats/reports page
      if (credentials.dashboardUrl) {
        await page.goto(credentials.dashboardUrl);
      }
      
      // Extract data (this would need customization per network)
      const data = await page.evaluate(() => {
        // Generic selectors - would need customization
        const clicksElement = document.querySelector('[data-metric="clicks"], .clicks, #clicks');
        const conversionsElement = document.querySelector('[data-metric="conversions"], .conversions, #conversions');
        const earningsElement = document.querySelector('[data-metric="earnings"], .earnings, #earnings');
        
        return {
          clicks: clicksElement ? parseInt(clicksElement.textContent?.replace(/[^\d]/g, '') || '0') : 0,
          conversions: conversionsElement ? parseInt(conversionsElement.textContent?.replace(/[^\d]/g, '') || '0') : 0,
          earnings: earningsElement ? parseFloat(earningsElement.textContent?.replace(/[^\d.]/g, '') || '0') : 0
        };
      });
      
      await browser.close();
      
      await storage.updateProgramPerformance(programId, data);
      
      return {
        success: true,
        message: "Generic scraping completed successfully",
        data
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to scrape affiliate data",
        error: error.message
      };
    }
  }

  // Main sync method that routes to appropriate network handler
  async syncProgram(programId: number): Promise<SyncResult> {
    try {
      const program = await storage.getProgram(programId);
      if (!program) {
        return {
          success: false,
          message: "Program not found"
        };
      }

      const credentials = {
        loginUrl: program.loginUrl,
        username: program.username,
        password: program.password, // This should be decrypted
        apiKey: program.apiKey,
        apiSecret: program.apiSecret,
        affiliateId: program.affiliateId,
        trackingId: program.trackingId,
        dashboardUrl: program.dashboardUrl
      };

      let result: SyncResult;

      switch (program.network?.toLowerCase()) {
        case 'amazon associates':
        case 'amazon':
          result = await this.syncAmazonAssociates(programId, credentials);
          break;
        case 'shareasale':
          result = await this.syncShareASale(programId, credentials);
          break;
        case 'commission junction':
        case 'cj affiliate':
          result = await this.syncCommissionJunction(programId, credentials);
          break;
        default:
          // Fall back to generic scraping
          result = await this.syncGenericScraping(programId, credentials);
          break;
      }

      // Update last sync time
      if (result.success) {
        await storage.updateProgram(programId, program.userId, {
          lastDataSync: new Date()
        });
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: "Sync failed",
        error: error.message
      };
    }
  }

  // Sync all enabled programs for a user
  async syncAllUserPrograms(userId: string): Promise<SyncResult[]> {
    const programs = await storage.getUserPrograms(userId);
    const results: SyncResult[] = [];

    for (const program of programs) {
      if (program.syncEnabled && program.status === 'active') {
        const result = await this.syncProgram(program.id);
        results.push({
          ...result,
          message: `${program.name}: ${result.message}`
        });
      }
    }

    return results;
  }
}

export const affiliateSyncService = new AffiliateSyncService();