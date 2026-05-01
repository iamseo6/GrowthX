import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertNewsletterSchema, insertLeadSchema } from "../shared/schema";
import { fromError } from "zod-validation-error";
import { isAuthenticated } from "./auth";
import { sendContactNotification, sendLeadNotification } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("Received contact submission request body:", req.body);
      const validationResult = insertContactSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        console.error("Validation failed:", validationResult.error);
        return res.status(400).json({
          error: fromError(validationResult.error).toString(),
        });
      }

      const submission = await storage.createContactSubmission(validationResult.data);
      console.log("Successfully saved submission:", submission);
      
      // Send email notification
      const notifyEmail = process.env.NOTIFICATION_EMAIL;
      if (notifyEmail) {
        try {
          await sendContactNotification(validationResult.data, notifyEmail);
          console.log("Email notification sent to:", notifyEmail);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      }
      
      return res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      return res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.get("/api/contact", isAuthenticated, async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      return res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      return res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.delete("/api/contact/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const deleted = await storage.deleteContactSubmission(id);
      if (!deleted) {
        return res.status(404).json({ error: "Submission not found" });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      return res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validationResult = insertNewsletterSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: fromError(validationResult.error).toString() });
      }
      const subscriber = await storage.createNewsletterSubscriber(validationResult.data);
      return res.status(201).json(subscriber);
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: "Email already subscribed" });
      }
      console.error("Newsletter error:", error);
      return res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.get("/api/newsletter", isAuthenticated, async (_req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      return res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      return res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.delete("/api/newsletter/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const deleted = await storage.deleteNewsletterSubscriber(id);
      if (!deleted) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      return res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      console.log("Received lead submission:", req.body);
      const validationResult = insertLeadSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        console.error("Lead validation failed:", validationResult.error);
        return res.status(400).json({
          error: fromError(validationResult.error).toString(),
        });
      }

      const lead = await storage.createLead(validationResult.data);
      console.log("Successfully saved lead:", lead);
      
      const notifyEmail = process.env.NOTIFICATION_EMAIL;
      if (notifyEmail) {
        try {
          await sendLeadNotification(validationResult.data, notifyEmail);
          console.log("Lead notification sent to:", notifyEmail);
        } catch (emailError) {
          console.error("Failed to send lead notification:", emailError);
        }
      }
      
      return res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({ error: "Failed to submit lead form" });
    }
  });

  app.get("/api/leads", isAuthenticated, async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      return res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.delete("/api/leads/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const deleted = await storage.deleteLead(id);
      if (!deleted) {
        return res.status(404).json({ error: "Lead not found" });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lead:", error);
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // XML Sitemap
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.REPLIT_DEPLOYMENT_URL || "https://growthxarabia.replit.app";
    
    const pages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/services", priority: "0.9", changefreq: "weekly" },
      { url: "/services/workflow-automation", priority: "0.8", changefreq: "monthly" },
      { url: "/services/ai-chatbots", priority: "0.8", changefreq: "monthly" },
      { url: "/services/crm-automation", priority: "0.8", changefreq: "monthly" },
      { url: "/services/data-analytics", priority: "0.8", changefreq: "monthly" },
      { url: "/services/ai-seo", priority: "0.8", changefreq: "monthly" },
      { url: "/services/ai-google-ads", priority: "0.8", changefreq: "monthly" },
      { url: "/services/ai-local-seo", priority: "0.8", changefreq: "monthly" },
      { url: "/services/ai-social-scheduling", priority: "0.8", changefreq: "monthly" },
      { url: "/case-studies", priority: "0.8", changefreq: "weekly" },
      { url: "/blog", priority: "0.8", changefreq: "weekly" },
      { url: "/blog/ai-automation-transforming-middle-east-business", priority: "0.7", changefreq: "monthly" },
      { url: "/blog/5-workflow-automations-every-business-needs", priority: "0.7", changefreq: "monthly" },
      { url: "/blog/ultimate-guide-ai-seo-arabic-markets", priority: "0.7", changefreq: "monthly" },
      { url: "/get-started", priority: "0.9", changefreq: "monthly" },
      { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
      { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
      { url: "/cookie-policy", priority: "0.3", changefreq: "yearly" },
      { url: "/sitemap", priority: "0.5", changefreq: "monthly" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  return httpServer;
}
