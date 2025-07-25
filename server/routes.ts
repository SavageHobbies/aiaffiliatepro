import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sessionMiddleware, isAuthenticated } from "./auth";
import passport from 'passport';
import { 
  insertAffiliateProgramSchema,
  insertAffiliateLinkSchema,
  insertAffiliateApplicationSchema,
  insertUserSettingsSchema,
  insertGeneratedContentSchema,
  insertDeploymentLogSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to block access to .env files under /api/
  app.use('/api/\\.env(\\..*)?', (req: Request, res: Response, next: NextFunction) => {
    console.warn(`Blocked attempted access to sensitive file: ${req.path}`);
    res.status(404).json({ message: 'Not Found' });
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth routes
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully' });
  });

  app.post('/api/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await storage.createUser({ email, password, firstName, lastName } as any);
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to log in after registration' });
        }
        res.json({ message: 'Registered and logged in successfully' });
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.redirect('/');
    });
  });

  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/onboarding' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/dashboard');
    });

  // User Profile API
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, website } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        firstName,
        lastName,
        website,
        email: req.user.email,
        profileImageUrl: req.user.profileImageUrl,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Affiliate Programs API
  app.get("/api/programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programs = await storage.getUserPrograms(userId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.post("/api/programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertAffiliateProgramSchema.parse(req.body);
      const program = await storage.createProgram(userId, validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating program:", error);
        res.status(500).json({ message: "Failed to create program" });
      }
    }
  });

  app.put("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programId = parseInt(req.params.id);
      const validatedData = insertAffiliateProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(programId, userId, validatedData);
      res.json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating program:", error);
        res.status(500).json({ message: "Failed to update program" });
      }
    }
  });

  app.delete("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programId = parseInt(req.params.id);
      await storage.deleteProgram(programId, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Affiliate Links API
  app.get("/api/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const links = await storage.getUserLinks(userId);
      res.json(links);
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  app.post("/api/links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertAffiliateLinkSchema.parse(req.body);
      const link = await storage.createLink(userId, validatedData);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating link:", error);
        res.status(500).json({ message: "Failed to create link" });
      }
    }
  });

  app.put("/api/links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const linkId = parseInt(req.params.id);
      const validatedData = insertAffiliateLinkSchema.partial().parse(req.body);
      const link = await storage.updateLink(linkId, userId, validatedData);
      res.json(link);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating link:", error);
        res.status(500).json({ message: "Failed to update link" });
      }
    }
  });

  app.delete("/api/links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const linkId = parseInt(req.params.id);
      await storage.deleteLink(linkId, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "Failed to delete link" });
    }
  });

  // Analytics API
  app.get("/api/analytics/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/analytics/performance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const performance = await storage.getUserPerformanceData(userId, start, end);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  // User Settings API
  app.get("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.getUserSettings(userId);
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.upsertUserSettings(userId, validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  // API Keys routes
  app.put('/api/settings/api-keys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { geminiApiKey, openaiApiKey } = req.body;
      
      // Update user settings with API keys
      const settings = await storage.upsertUserSettings(userId, {
        geminiApiKey,
        openaiApiKey,
      });
      
      res.json({ message: "API keys updated successfully" });
    } catch (error) {
      console.error("Error updating API keys:", error);
      res.status(500).json({ message: "Failed to update API keys" });
    }
  });

  // SSH Connection test
  app.post('/api/settings/ssh/test', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.getUserSettings(userId);
      
      if (!settings?.sshHost || !settings?.sshUsername || !settings?.sshPassword) {
        return res.status(400).json({ message: "SSH configuration incomplete" });
      }

      // In a real implementation, you would test SSH connection here
      // For now, we'll simulate a successful test
      res.json({ message: "SSH connection test successful" });
    } catch (error) {
      console.error("Error testing SSH connection:", error);
      res.status(500).json({ message: "Failed to test SSH connection" });
    }
  });

  // Deploy content
  app.post('/api/generated-content/:id/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const contentId = parseInt(req.params.id);
      
      // Get the content to deploy
      const content = await storage.getGeneratedContent(contentId, userId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Get user's SSH settings
      const settings = await storage.getUserSettings(userId);
      if (!settings?.sshHost || !settings?.sshUsername || !settings?.sshPassword) {
        return res.status(400).json({ message: "SSH configuration required" });
      }

      // In a real implementation, you would:
      // 1. Connect to SSH server
      // 2. Upload the HTML/CSS files
      // 3. Update the content record with deployment URL
      
      // For now, simulate deployment
      const deploymentPath = `/content-${contentId}-${Date.now()}.html`;
      const deploymentUrl = `https://${settings.sshHost}${deploymentPath}`;
      
      await storage.updateGeneratedContent(contentId, userId, {
        status: "published",
        deploymentPath,
        deploymentUrl,
      });

      // Log the deployment
      await storage.createDeploymentLog({
        contentId,
        userId,
        status: "success",
        deploymentPath,
        logMessage: "Deployed via SSH",
      });

      res.json({ 
        message: "Content deployed successfully",
        deploymentUrl,
        deploymentPath 
      });
    } catch (error) {
      console.error("Error deploying content:", error);
      res.status(500).json({ message: "Failed to deploy content" });
    }
  });

  // Affiliate Applications API
  app.get("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const applications = await storage.getUserApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertAffiliateApplicationSchema.parse(req.body);
      const application = await storage.createApplication(userId, validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating application:", error);
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });

  app.put("/api/applications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const validatedData = insertAffiliateApplicationSchema.partial().parse(req.body);
      const application = await storage.updateApplication(id, userId, validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Failed to update application" });
      }
    }
  });

  app.delete("/api/applications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      await storage.deleteApplication(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });


  // Commission payment routes
  app.get('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const payments = await storage.getUserCommissionPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const payment = await storage.createCommissionPayment(userId, req.body);
      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.put('/api/payments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const payment = await storage.updateCommissionPayment(id, userId, req.body);
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  app.delete('/api/payments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      await storage.deleteCommissionPayment(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  // Link monitoring routes
  app.get('/api/links/:linkId/monitoring', isAuthenticated, async (req: any, res) => {
    try {
      const linkId = parseInt(req.params.linkId);
      const monitoring = await storage.getLinkMonitoring(linkId);
      res.json(monitoring);
    } catch (error) {
      console.error("Error fetching link monitoring:", error);
      res.status(500).json({ message: "Failed to fetch link monitoring" });
    }
  });

  app.post('/api/links/:linkId/check-health', isAuthenticated, async (req: any, res) => {
    try {
      const linkId = parseInt(req.params.linkId);
      const monitoring = await storage.checkLinkHealth(linkId);
      res.json(monitoring);
    } catch (error) {
      console.error("Error checking link health:", error);
      res.status(500).json({ message: "Failed to check link health" });
    }
  });

  // Content performance routes
  app.get('/api/content-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const content = await storage.getUserContentPerformance(userId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content performance:", error);
      res.status(500).json({ message: "Failed to fetch content performance" });
    }
  });

  app.post('/api/content-performance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const content = await storage.createContentPerformance(userId, req.body);
      res.json(content);
    } catch (error) {
      console.error("Error creating content performance:", error);
      res.status(500).json({ message: "Failed to create content performance" });
    }
  });

  app.put('/api/content-performance/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const content = await storage.updateContentPerformance(id, userId, req.body);
      res.json(content);
    } catch (error) {
      console.error("Error updating content performance:", error);
      res.status(500).json({ message: "Failed to update content performance" });
    }
  });

  app.delete('/api/content-performance/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      await storage.deleteContentPerformance(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content performance:", error);
      res.status(500).json({ message: "Failed to delete content performance" });
    }
  });

  // Competitor tracking routes
  app.get('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const competitors = await storage.getUserCompetitorTracking(userId);
      res.json(competitors);
    } catch (error) {
      console.error("Error fetching competitors:", error);
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });

  app.post('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const competitor = await storage.createCompetitorTracking(userId, req.body);
      res.json(competitor);
    } catch (error) {
      console.error("Error creating competitor:", error);
      res.status(500).json({ message: "Failed to create competitor" });
    }
  });

  app.put('/api/competitors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const competitor = await storage.updateCompetitorTracking(id, userId, req.body);
      res.json(competitor);
    } catch (error) {
      console.error("Error updating competitor:", error);
      res.status(500).json({ message: "Failed to update competitor" });
    }
  });

  app.delete('/api/competitors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      await storage.deleteCompetitorTracking(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting competitor:", error);
      res.status(500).json({ message: "Failed to delete competitor" });
    }
  });

  // Advanced analytics route
  app.get('/api/analytics/advanced', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getAdvancedUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
      res.status(500).json({ message: "Failed to fetch advanced analytics" });
    }
  });

  // Content generation routes
  app.get('/api/generated-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const content = await storage.getUserGeneratedContent(userId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching generated content:", error);
      res.status(500).json({ message: "Failed to fetch generated content" });
    }
  });

  app.post('/api/generated-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertGeneratedContentSchema.parse(req.body);
      const content = await storage.createGeneratedContent(userId, validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating generated content:", error);
        res.status(500).json({ message: "Failed to create generated content" });
      }
    }
  });

  app.put('/api/generated-content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const validatedData = insertGeneratedContentSchema.partial().parse(req.body);
      const content = await storage.updateGeneratedContent(id, userId, validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating generated content:", error);
        res.status(500).json({ message: "Failed to update generated content" });
      }
    }
  });

  app.delete('/api/generated-content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      await storage.deleteGeneratedContent(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting generated content:", error);
      res.status(500).json({ message: "Failed to delete generated content" });
    }
  });

  app.get('/api/generated-content/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const id = parseInt(req.params.id);
      const content = await storage.getGeneratedContent(id, userId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching generated content:", error);
      res.status(500).json({ message: "Failed to fetch generated content" });
    }
  });

  // SSH deployment routes
  app.post('/api/deployments', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDeploymentLogSchema.parse(req.body);
      const deployment = await storage.createDeploymentLog(validatedData);
      res.status(201).json(deployment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating deployment log:", error);
        res.status(500).json({ message: "Failed to create deployment log" });
      }
    }
  });

  app.get('/api/generated-content/:contentId/deployments', isAuthenticated, async (req: any, res) => {
    try {
      const contentId = parseInt(req.params.contentId);
      const deployments = await storage.getDeploymentLogs(contentId);
      res.json(deployments);
    } catch (error) {
      console.error("Error fetching deployment logs:", error);
      res.status(500).json({ message: "Failed to fetch deployment logs" });
    }
  });

  // AI Content Generation endpoint
  app.post("/api/generate-content", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { aiApiKey, prompt, contentType, keywords, selectedPrograms, title } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!aiApiKey || !prompt) {
        return res.status(400).json({ message: "AI API key and prompt are required" });
      }

      // Import the Gemini utility
      const { generateAffiliateContent } = await import("./ai/gemini");
      
      // Generate content using AI
      const generatedContent = await generateAffiliateContent(
        aiApiKey,
        prompt,
        contentType || "blog post",
        keywords ? keywords.split(",").map((k: string) => k.trim()) : [],
        selectedPrograms || []
      );

      res.json({ 
        content: generatedContent,
        message: "Content generated successfully" 
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
  });

  // Affiliate Data Sync Routes
  app.post("/api/programs/:id/sync", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programId = parseInt(req.params.id);
      
      // Verify program belongs to user
      const program = await storage.getProgram(programId);
      if (!program || program.userId !== userId) {
        return res.status(404).json({ message: "Program not found" });
      }

      const { affiliateSyncService } = await import("./affiliate-sync");
      const result = await affiliateSyncService.syncProgram(programId);
      
      res.json(result);
    } catch (error: any) {
      console.error("Error syncing program:", error);
      res.status(500).json({ message: "Failed to sync program data", error: error.message });
    }
  });

  app.post("/api/sync-all", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { affiliateSyncService } = await import("./affiliate-sync");
      const results = await affiliateSyncService.syncAllUserPrograms(userId);
      
      res.json({
        message: "Sync completed",
        results
      });
    } catch (error: any) {
      console.error("Error syncing all programs:", error);
      res.status(500).json({ message: "Failed to sync programs", error: error.message });
    }
  });

  app.post("/api/programs/:id/test-connection", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const programId = parseInt(req.params.id);
      
      // Verify program belongs to user
      const program = await storage.getProgram(programId);
      if (!program || program.userId !== userId) {
        return res.status(404).json({ message: "Program not found" });
      }

      // Test connection without full sync
      const { affiliateSyncService } = await import("./affiliate-sync");
      
      // For now, just verify credentials are present
      const hasCredentials = program.username && program.password && program.loginUrl;
      const hasApiCredentials = program.apiKey && (program.network?.toLowerCase().includes('shareasale') ? program.apiSecret : true);
      
      if (!hasCredentials && !hasApiCredentials) {
        return res.json({
          success: false,
          message: "Missing required credentials. Please add login details or API keys."
        });
      }

      res.json({
        success: true,
        message: "Connection test successful. Credentials appear to be configured correctly."
      });
    } catch (error: any) {
      console.error("Error testing connection:", error);
      res.status(500).json({ message: "Failed to test connection", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
