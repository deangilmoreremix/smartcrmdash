import { createClient } from '@supabase/supabase-js';
import type { Express } from 'express';

interface BulkUser {
  email: string;
  first_name: string;
  last_name: string;
  app_context?: string;
  phone?: string;
  company?: string;
  role?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  imported_users: string[];
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function bulkImportUsers(users: BulkUser[]): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
    imported_users: []
  };

  for (const user of users) {
    try {
      // Generate a temporary password
      const tempPassword = generateTempPassword();
      
      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          app_context: user.app_context || 'smartcrm',
          email_template_set: 'smartcrm',
          phone: user.phone,
          company: user.company,
          role: user.role,
          bulk_imported: true,
          imported_at: new Date().toISOString()
        }
      });

      if (error) {
        result.errors.push(`${user.email}: ${error.message}`);
        result.failed++;
      } else if (data.user) {
        result.success++;
        result.imported_users.push(user.email);
        
        // Send welcome email via Supabase
        await sendWelcomeEmail(user.email, user.first_name, tempPassword);
      }
    } catch (error: any) {
      result.errors.push(`${user.email}: ${error.message}`);
      result.failed++;
    }
  }

  return result;
}

async function sendWelcomeEmail(email: string, firstName: string, tempPassword: string) {
  try {
    // Use confirm reauthentication link for bulk import users
    const redirectUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/dashboard?welcome=true`
      : 'https://smart-crm-platform.replit.dev/dashboard?welcome=true';
    
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error(`Failed to send welcome email to ${email}:`, error);
    } else {
      console.log(`Bulk import welcome email sent to ${email}`);
    }
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
  }
}

function generateTempPassword(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Parse CSV data
export function parseCSV(csvContent: string): BulkUser[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  const users: BulkUser[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const user: any = {};
    
    headers.forEach((header, index) => {
      if (values[index]) {
        user[header] = values[index];
      }
    });
    
    // Ensure required fields
    if (user.email && user.first_name && user.last_name) {
      users.push({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        app_context: user.app_context || 'smartcrm',
        phone: user.phone,
        company: user.company,
        role: user.role
      });
    }
  }
  
  return users;
}

export function registerBulkImportRoutes(app: Express) {
  // Bulk import endpoint
  app.post('/api/bulk-import/users', async (req, res) => {
    try {
      const { users, send_notifications = true } = req.body;
      
      if (!users || !Array.isArray(users)) {
        return res.status(400).json({
          error: 'Users array is required'
        });
      }

      console.log(`Starting bulk import of ${users.length} users...`);
      
      const result = await bulkImportUsers(users);
      
      console.log(`Bulk import completed: ${result.success} success, ${result.failed} failed`);
      
      res.json({
        message: `Bulk import completed`,
        result
      });
    } catch (error: any) {
      console.error('Bulk import error:', error);
      res.status(500).json({
        error: 'Failed to import users',
        details: error.message
      });
    }
  });

  // Parse CSV endpoint
  app.post('/api/bulk-import/parse-csv', (req, res) => {
    try {
      const { csv_content } = req.body;
      
      if (!csv_content) {
        return res.status(400).json({
          error: 'CSV content is required'
        });
      }

      const users = parseCSV(csv_content);
      
      res.json({
        message: `Parsed ${users.length} users from CSV`,
        users,
        preview: users.slice(0, 5) // Show first 5 as preview
      });
    } catch (error: any) {
      console.error('CSV parsing error:', error);
      res.status(500).json({
        error: 'Failed to parse CSV',
        details: error.message
      });
    }
  });

  // Send notification to existing users
  app.post('/api/bulk-import/send-notifications', async (req, res) => {
    try {
      const { emails, message_type = 'welcome' } = req.body;
      
      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({
          error: 'Emails array is required'
        });
      }

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const email of emails) {
        try {
          const { error } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
          });

          if (error) {
            errors.push(`${email}: ${error.message}`);
            failed++;
          } else {
            sent++;
          }
        } catch (error: any) {
          errors.push(`${email}: ${error.message}`);
          failed++;
        }
      }

      res.json({
        message: 'Notification sending completed',
        sent,
        failed,
        errors
      });
    } catch (error: any) {
      console.error('Notification sending error:', error);
      res.status(500).json({
        error: 'Failed to send notifications',
        details: error.message
      });
    }
  });
}