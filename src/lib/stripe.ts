import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set. Use this module only on the server.");
}

/**
 * Server-side Stripe instance. Use only in API routes, server actions, and server components.
 * Do not import in client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});
