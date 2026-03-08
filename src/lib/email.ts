import { Resend } from "resend";
import type { OrderItem, ShippingAddress } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Order payload for emails (from webhook or DB). */
export type OrderEmailPayload = {
  id?: string;
  customer_email: string;
  customer_name: string | null;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  total: number;
};

// Use onboarding@resend.dev for testing; set RESEND_FROM to e.g. "Prime Aroma <orders@primearoma.com>" when domain is verified
const FROM_CUSTOMER = process.env.RESEND_FROM ?? "Prime Aroma <onboarding@resend.dev>";
const FROM_ADMIN = process.env.RESEND_FROM ?? "onboarding@resend.dev";

function formatAddress(addr: ShippingAddress): string {
  const lines = [addr.street, [addr.city, addr.state, addr.zip].filter(Boolean).join(", "), addr.country].filter(Boolean);
  return lines.join("\n");
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

/** Customer confirmation email — navy and cream, minimal. */
export async function sendCustomerConfirmation(order: OrderEmailPayload): Promise<void> {
  try {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.12)">${item.name} × ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.12);text-align:right">${formatCurrency(item.price * item.quantity)}</td></tr>`
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#EDE8D0;color:#0a1628;padding:24px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid rgba(10,22,40,0.1);padding:32px">
    <h1 style="margin:0 0 24px;font-size:14px;letter-spacing:0.2em;font-weight:600;color:#0a1628">PRIME AROMA</h1>
    <h2 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0a1628">Order Confirmed</h2>
    <p style="margin:0 0 24px;color:#0a1628;line-height:1.5">Thank you for your order. We've received your payment and will prepare your items for shipment.</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead><tr><th style="text-align:left;padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.2)">Item</th><th style="text-align:right;padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.2)">Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin:0 0 8px;font-weight:600">Order total: ${formatCurrency(order.total)}</p>
    <div style="margin:24px 0 0;padding-top:24px;border-top:1px solid rgba(10,22,40,0.12)">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(10,22,40,0.7)">Shipping address</p>
      <p style="margin:0;white-space:pre-line">${formatAddress(order.shipping_address)}</p>
    </div>
    <p style="margin:24px 0 0;font-size:14px;color:rgba(10,22,40,0.8)">We'll notify you when your order ships.</p>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: FROM_CUSTOMER,
      to: order.customer_email,
      subject: "Your Prime Aroma Order is Confirmed",
      html,
    });
  } catch (err) {
    console.error("Resend customer confirmation failed:", err);
  }
}

/** Admin notification email. */
export async function sendAdminNotification(order: OrderEmailPayload): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL not set; skipping admin notification.");
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.12)">${item.name} × ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.12);text-align:right">${formatCurrency(item.price * item.quantity)}</td></tr>`
      )
      .join("");

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
    const adminOrdersUrl = origin.startsWith("http") ? `${origin}/admin/orders` : `https://${origin}/admin/orders`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#f5f5f5;color:#0a1628;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ddd;padding:28px">
    <h1 style="margin:0 0 8px;font-size:18px;color:#0a1628">New order received</h1>
    <p style="margin:0 0 20px;font-size:14px;color:rgba(10,22,40,0.8)">Prime Aroma</p>
    <p style="margin:0 0 4px;"><strong>Customer:</strong> ${order.customer_name ?? "—"} (${order.customer_email})</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <thead><tr><th style="text-align:left;padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.2)">Item</th><th style="text-align:right;padding:8px 0;border-bottom:1px solid rgba(10,22,40,0.2)">Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin:0 0 16px;font-weight:600">Total: ${formatCurrency(order.total)}</p>
    <div style="margin:16px 0">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:rgba(10,22,40,0.7)">Shipping address</p>
      <p style="margin:0;white-space:pre-line">${formatAddress(order.shipping_address)}</p>
    </div>
    <p style="margin:20px 0 0;"><a href="${adminOrdersUrl}" style="color:#0a1628;font-weight:600">View orders in admin →</a></p>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: FROM_ADMIN,
      to: adminEmail,
      subject: "New Order Received - Prime Aroma",
      html,
    });
  } catch (err) {
    console.error("Resend admin notification failed:", err);
  }
}
