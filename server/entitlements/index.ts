import { createClient } from '@supabase/supabase-js';
import { getUserEntitlement, isUserActive, handleSuccessfulPurchase } from '../entitlements-utils.js';
import { db } from '../db.js';
import { entitlements } from '@shared/schema';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export const handler = async (event: any, context: any) => {
  const { httpMethod, path, body } = event;
  const pathParts = path.split('/').filter(Boolean);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET /api/entitlements/check - Check user entitlement
    if (pathParts.length >= 2 && pathParts[0] === 'entitlements' && pathParts[1] === 'check' && httpMethod === 'GET') {
      const userId = 'dev-user-12345'; // In real implementation, get from auth

      if (!userId) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      const entitlement = await getUserEntitlement(userId);
      const isActive = isUserActive(entitlement);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          entitlement,
          isActive,
          hasAccess: isActive
        })
      };
    }

    // GET /api/entitlements/list - List all entitlements
    if (pathParts.length >= 2 && pathParts[0] === 'entitlements' && pathParts[1] === 'list' && httpMethod === 'GET') {
      const entitlementsList = await db.select().from(entitlements).limit(100);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          entitlements: entitlementsList || [],
          total: entitlementsList?.length || 0
        })
      };
    }

    // POST /api/entitlements/create - Create entitlement
    if (pathParts.length >= 2 && pathParts[0] === 'entitlements' && pathParts[1] === 'create' && httpMethod === 'POST') {
      const { userId, productType, planName, planAmount, currency } = JSON.parse(body);

      if (!userId || !productType || !planName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
      }

      const entitlement = await handleSuccessfulPurchase(
        userId,
        productType,
        {
          planName,
          planAmount: planAmount?.toString(),
          currency: currency || 'USD',
        }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, entitlement })
      };
    }

    // Not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Entitlements endpoint not found' })
    };

  } catch (error: any) {
    console.error('Entitlements function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};