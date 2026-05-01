// Resend email client integration
import { Resend } from 'resend';

async function getCredentials() {
  // Try direct RESEND_API_KEY first (Vercel deployment)
  const directApiKey = process.env.RESEND_API_KEY;
  if (directApiKey) {
    return { 
      apiKey: directApiKey, 
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev' 
    };
  }

  // Fallback to Replit connectors
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error('No Resend API key or Replit connector available');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendContactNotification(submission: {
  firstName: string;
  lastName: string;
  email: string;
  website?: string | null;
  message: string;
}, notifyEmail: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    const fullName = `${submission.firstName} ${submission.lastName}`;
    
    const result = await client.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        ${submission.website ? `<p><strong>Website:</strong> ${submission.website}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${submission.message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This notification was sent from GrowthX Arabia website.</p>
      `
    });
    
    console.log('Email notification sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
}

export async function sendLeadNotification(lead: {
  selectedService: string;
  companyName: string;
  website?: string | null;
  industry: string;
  budgetRange: string;
  timeline: string;
  projectDescription?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  preferWhatsApp?: string | null;
}, notifyEmail: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    const fullName = `${lead.firstName} ${lead.lastName}`;
    
    const result = await client.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `🔥 New Lead: ${fullName} - ${lead.selectedService}`,
      html: `
        <h2>New Lead from Get Started Funnel</h2>
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone} ${lead.preferWhatsApp === 'yes' ? '(Prefers WhatsApp)' : ''}</p>` : ''}
        
        <h3>Company Details</h3>
        <p><strong>Company:</strong> ${lead.companyName}</p>
        ${lead.website ? `<p><strong>Website:</strong> ${lead.website}</p>` : ''}
        <p><strong>Industry:</strong> ${lead.industry}</p>
        
        <h3>Project Requirements</h3>
        <p><strong>Service Interested:</strong> ${lead.selectedService}</p>
        <p><strong>Budget Range:</strong> ${lead.budgetRange}</p>
        <p><strong>Timeline:</strong> ${lead.timeline}</p>
        ${lead.projectDescription ? `<p><strong>Project Description:</strong></p><p>${lead.projectDescription}</p>` : ''}
        
        <hr>
        <p style="color: #666; font-size: 12px;">This lead was submitted through the GrowthX Arabia Get Started funnel.</p>
      `
    });
    
    console.log('Lead notification sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send lead notification:', error);
    throw error;
  }
}
