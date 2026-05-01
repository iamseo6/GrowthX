import { z } from "zod";

// User schemas
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  password: string;
};

// Contact submission schemas
export const insertContactSubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  message: z.string().min(1, "Message is required"),
});

export type ContactSubmission = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  website?: string;
  message: string;
  createdAt: Date;
};

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Newsletter schemas
export const insertNewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscriber = {
  id: number;
  email: string;
  createdAt: Date;
};

// Lead schemas
export const insertLeadSchema = z.object({
  selectedService: z.string().min(1),
  companyName: z.string().min(1),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().min(1),
  budgetRange: z.string().min(1),
  timeline: z.string().min(1),
  projectDescription: z.string().optional().or(z.literal("")),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  preferWhatsApp: z.string().default("no"),
});

export type Lead = {
  id: number;
  selectedService: string;
  companyName: string;
  website?: string;
  industry: string;
  budgetRange: string;
  timeline: string;
  projectDescription?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferWhatsapp: string;
  createdAt: Date;
};

export type InsertLead = z.infer<typeof insertLeadSchema>;
