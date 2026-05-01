import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

// Zod schemas for validation
const contactSubmissionSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional().nullable(),
  message: z.string().min(1),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

const leadSchema = z.object({
  selectedService: z.string().min(1),
  companyName: z.string().min(1),
  website: z.string().optional().nullable(),
  industry: z.string().min(1),
  budgetRange: z.string().min(1),
  timeline: z.string().min(1),
  projectDescription: z.string().optional().nullable(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  preferWhatsApp: z.string().optional().default("no"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const path = url.split('?')[0];

  // Check database connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(connectionString);

  try {
    // POST /api/contact
    if (path === '/api/contact' && req.method === 'POST') {
      const validationResult = contactSubmissionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors.map(e => e.message).join(', ') });
      }

      const { firstName, lastName, email, website, message } = validationResult.data;
      
      const result = await sql`
        INSERT INTO contact_submissions (first_name, last_name, email, website, message)
        VALUES (${firstName}, ${lastName}, ${email}, ${website || null}, ${message})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    // POST /api/newsletter
    if (path === '/api/newsletter' && req.method === 'POST') {
      const validationResult = newsletterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors.map(e => e.message).join(', ') });
      }

      const { email } = validationResult.data;
      
      try {
        const result = await sql`
          INSERT INTO newsletter_subscribers (email)
          VALUES (${email})
          RETURNING *
        `;
        return res.status(201).json(result[0]);
      } catch (error: any) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Email already subscribed' });
        }
        throw error;
      }
    }

    // POST /api/leads
    if (path === '/api/leads' && req.method === 'POST') {
      const validationResult = leadSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors.map(e => e.message).join(', ') });
      }

      const data = validationResult.data;
      
      const result = await sql`
        INSERT INTO leads (
          selected_service, company_name, website, industry, budget_range, 
          timeline, project_description, first_name, last_name, email, phone, prefer_whatsapp
        )
        VALUES (
          ${data.selectedService}, ${data.companyName}, ${data.website || null}, 
          ${data.industry}, ${data.budgetRange}, ${data.timeline}, 
          ${data.projectDescription || null}, ${data.firstName}, ${data.lastName}, 
          ${data.email}, ${data.phone || null}, ${data.preferWhatsApp}
        )
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    // GET /api/sitemap.xml
    if (path === '/api/sitemap.xml' && req.method === 'GET') {
      const baseUrl = 'https://growthx-livid.vercel.app';
      
      const pages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/services', priority: '0.9', changefreq: 'weekly' },
        { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
        { url: '/blog', priority: '0.8', changefreq: 'weekly' },
        { url: '/get-started', priority: '0.9', changefreq: 'monthly' },
        { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
      ];

      const today = new Date().toISOString().split('T')[0];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      return res.status(200).send(xml);
    }

    // Not found
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
