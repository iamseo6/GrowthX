import express from "express";
import cors from "cors";
import { storage } from "../server/storage";
import { insertContactSubmissionSchema, insertNewsletterSchema, insertLeadSchema } from "../shared/schema";
import { fromError } from "zod-validation-error";
import { sendContactNotification, sendLeadNotification } from "../server/email";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Contact routes
app.post("/api/contact", async (req, res) => {
  try {
    const validationResult = insertContactSubmissionSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: fromError(validationResult.error).toString(),
      });
    }

    const submission = await storage.createContactSubmission(validationResult.data);
    
    const notifyEmail = process.env.NOTIFICATION_EMAIL;
    if (notifyEmail) {
      try {
        await sendContactNotification(validationResult.data, notifyEmail);
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

// Newsletter routes
app.post("/api/newsletter", async (req, res) => {
  try {
    const validationResult = insertNewsletterSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: fromError(validationResult.error).toString() });
    }
    const subscriber = await storage.createNewsletterSubscriber(validationResult.data);
    return res.status(201).json(subscriber);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Email already subscribed" });
    }
    console.error("Newsletter error:", error);
    return res.status(500).json({ error: "Failed to subscribe" });
  }
});

// Leads routes
app.post("/api/leads", async (req, res) => {
  try {
    const validationResult = insertLeadSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: fromError(validationResult.error).toString(),
      });
    }

    const lead = await storage.createLead(validationResult.data);
    
    const notifyEmail = process.env.NOTIFICATION_EMAIL;
    if (notifyEmail) {
      try {
        await sendLeadNotification(validationResult.data, notifyEmail);
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

// Sitemap
app.get("/api/sitemap.xml", (_req, res) => {
  const baseUrl = "https://growthx-livid.vercel.app";
  
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/services", priority: "0.9", changefreq: "weekly" },
    { url: "/case-studies", priority: "0.8", changefreq: "weekly" },
    { url: "/blog", priority: "0.8", changefreq: "weekly" },
    { url: "/get-started", priority: "0.9", changefreq: "monthly" },
    { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
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

export default app;
