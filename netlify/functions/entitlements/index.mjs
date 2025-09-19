// server/entitlements/index.ts
import { createClient } from "@supabase/supabase-js";

// server/entitlements-utils.ts
import { DateTime } from "luxon";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema });

// server/entitlements-utils.ts
import { entitlements } from "@shared/schema";
import { eq } from "drizzle-orm";
var ZONE = "America/New_York";
function startOfNextMonthUTC(nowISO) {
  const dt = DateTime.fromISO(nowISO, { zone: ZONE }).startOf("month").plus({ months: 1 });
  return dt.toUTC().toISO();
}
function startOfNextYearUTC(nowISO) {
  const dt = DateTime.fromISO(nowISO, { zone: ZONE }).startOf("year").plus({ years: 1 });
  return dt.toUTC().toISO();
}
async function upsertEntitlement(params) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const existing = await db.select().from(entitlements).where(eq(entitlements.userId, params.userId)).limit(1);
  if (existing.length > 0) {
    const [updated] = await db.update(entitlements).set({
      status: params.status,
      productType: params.productType,
      revokeAt: params.revokeAt ? new Date(params.revokeAt) : null,
      lastInvoiceStatus: params.lastInvoiceStatus,
      delinquencyCount: params.delinquencyCount ?? existing[0].delinquencyCount,
      stripeSubscriptionId: params.stripeSubscriptionId ?? existing[0].stripeSubscriptionId,
      stripeCustomerId: params.stripeCustomerId ?? existing[0].stripeCustomerId,
      zaxaaSubscriptionId: params.zaxaaSubscriptionId ?? existing[0].zaxaaSubscriptionId,
      planName: params.planName ?? existing[0].planName,
      planAmount: params.planAmount ?? existing[0].planAmount,
      currency: params.currency ?? existing[0].currency,
      updatedAt: new Date(now)
    }).where(eq(entitlements.userId, params.userId)).returning();
    return updated;
  } else {
    const [created] = await db.insert(entitlements).values({
      userId: params.userId,
      status: params.status,
      productType: params.productType,
      revokeAt: params.revokeAt ? new Date(params.revokeAt) : null,
      lastInvoiceStatus: params.lastInvoiceStatus,
      delinquencyCount: params.delinquencyCount ?? 0,
      stripeSubscriptionId: params.stripeSubscriptionId,
      stripeCustomerId: params.stripeCustomerId,
      zaxaaSubscriptionId: params.zaxaaSubscriptionId,
      planName: params.planName,
      planAmount: params.planAmount,
      currency: params.currency ?? "USD"
    }).returning();
    return created;
  }
}
function calculateRevokeDate(productType, nowISO) {
  switch (productType) {
    case "lifetime":
      return null;
    // never revoke
    case "monthly":
      return startOfNextMonthUTC(nowISO);
    // revoke at 12:00am ET next month
    case "yearly":
      return startOfNextYearUTC(nowISO);
    // revoke at 12:00am ET next year
    case "payment_plan":
      return startOfNextMonthUTC(nowISO);
    // default rolling window; only enforced on miss
    default:
      return null;
  }
}
async function handleSuccessfulPurchase(userId, productType, metadata = {}) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const revokeAt = calculateRevokeDate(productType, now);
  return await upsertEntitlement({
    userId,
    status: "active",
    productType,
    revokeAt,
    lastInvoiceStatus: "paid",
    delinquencyCount: 0,
    ...metadata
  });
}
async function getUserEntitlement(userId) {
  const result = await db.select().from(entitlements).where(eq(entitlements.userId, userId)).limit(1);
  return result[0] || null;
}
function isUserActive(entitlement) {
  if (!entitlement) return false;
  const now = Date.now();
  const isActive = entitlement.status === "active" && (!entitlement.revokeAt || new Date(entitlement.revokeAt).getTime() > now);
  return isActive;
}

// server/entitlements/index.ts
import { pgTable, text, serial, integer, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
var entitlements2 = pgTable("entitlements", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  status: text("status").notNull().default("active"),
  productType: text("product_type"),
  revokeAt: timestamp("revoke_at", { withTimezone: true }),
  lastInvoiceStatus: text("last_invoice_status"),
  delinquencyCount: integer("delinquency_count").default(0),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  zaxaaSubscriptionId: text("zaxaa_subscription_id"),
  planName: text("plan_name"),
  planAmount: decimal("plan_amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
var handler = async (event, context) => {
  const { httpMethod, path, body } = event;
  const pathParts = path.split("/").filter(Boolean);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
  if (httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  try {
    if (pathParts.length >= 2 && pathParts[0] === "entitlements" && pathParts[1] === "check" && httpMethod === "GET") {
      const userId = "dev-user-12345";
      if (!userId) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
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
    if (pathParts.length >= 2 && pathParts[0] === "entitlements" && pathParts[1] === "list" && httpMethod === "GET") {
      const entitlementsList = await db.select().from(entitlements2).limit(100);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          entitlements: entitlementsList || [],
          total: entitlementsList?.length || 0
        })
      };
    }
    if (pathParts.length >= 2 && pathParts[0] === "entitlements" && pathParts[1] === "create" && httpMethod === "POST") {
      const { userId, productType, planName, planAmount, currency } = JSON.parse(body);
      if (!userId || !productType || !planName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
      }
      const entitlement = await handleSuccessfulPurchase(
        userId,
        productType,
        {
          planName,
          planAmount: planAmount?.toString(),
          currency: currency || "USD"
        }
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, entitlement })
      };
    }
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Entitlements endpoint not found" })
    };
  } catch (error) {
    console.error("Entitlements function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message })
    };
  }
};
export {
  handler
};
