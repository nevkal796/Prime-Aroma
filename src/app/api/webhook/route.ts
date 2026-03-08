import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendCustomerConfirmation, sendAdminNotification } from "@/lib/email";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.warn("STRIPE_WEBHOOK_SECRET is not set; webhook will not verify signatures.");
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const signature = request.headers.get("stripe-signature") ?? "";

    let event: Stripe.Event;
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      event = JSON.parse(raw) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });

      const lineItems = fullSession.line_items?.data ?? [];
      const items = lineItems.map((item) => ({
        product_id: (item.price?.product as string) ?? "",
        name: item.description ?? item.price?.nickname ?? "Item",
        price: ((item.price?.unit_amount ?? 0) as number) / 100,
        quantity: item.quantity ?? 0,
        image_url: null,
      }));

      const shipping = session.customer_details?.address;
      const shipping_address = shipping
        ? {
            street: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
            city: shipping.city ?? "",
            state: shipping.state ?? "",
            zip: shipping.postal_code ?? "",
            country: shipping.country ?? "",
          }
        : {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
          };

      const total = (session.amount_total ?? 0) / 100;
      const user_id = session.metadata?.user_id ?? null;

      const { data: inserted, error } = await supabaseAdmin
        .from("orders")
        .insert({
          stripe_session_id: sessionId,
          customer_email: session.customer_email ?? session.customer_details?.email ?? "",
          customer_name: session.customer_details?.name ?? null,
          shipping_address,
          items,
          total,
          status: "paid",
          fulfilled: false,
          user_id: user_id || null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Webhook order insert error:", error);
        return NextResponse.json(
          { error: "Failed to save order" },
          { status: 500 }
        );
      }

      const orderPayload = {
        id: inserted?.id,
        customer_email: session.customer_email ?? session.customer_details?.email ?? "",
        customer_name: session.customer_details?.name ?? null,
        shipping_address,
        items,
        total,
      };
      await sendCustomerConfirmation(orderPayload);
      await sendAdminNotification(orderPayload);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook failed" },
      { status: 500 }
    );
  }
}
