import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, user_id } = body as {
      items: { product_id: string; name: string; price: number; quantity: number; image_url: string | null }[];
      user_id?: string;
    };

    if (!items?.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const productIds = [...new Set(items.map((i) => i.product_id))];
    const { data: products, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("id, name, stock")
      .in("id", productIds);

    if (fetchError) {
      console.error("Checkout stock fetch error:", fetchError);
      return NextResponse.json(
        { error: "Unable to verify inventory" },
        { status: 500 }
      );
    }

    const productMap = new Map((products ?? []).map((p) => [p.id, p]));
    const outOfStockItems: { id: string; name: string }[] = [];

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        outOfStockItems.push({ id: item.product_id, name: item.name });
        continue;
      }
      if (product.stock < item.quantity) {
        outOfStockItems.push({ id: product.id, name: product.name });
      }
    }

    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          error:
            "This item is now out of stock. Please remove it from your cart to continue.",
          outOfStockItems: outOfStockItems.map((o) => ({ id: o.id, name: o.name })),
        },
        { status: 400 }
      );
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : undefined,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const authSession = await getServerSession(authOptions);
    const sessionUserId = (authSession?.user as any)?.id as string | undefined;
    const effectiveUserId = sessionUserId ?? user_id;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const cartItemsMeta = items.map((i) => ({ i: i.product_id, q: i.quantity }));
    const metadata: Record<string, string> = {
      cart_items: JSON.stringify(cartItemsMeta),
    };
    if (effectiveUserId) metadata.user_id = effectiveUserId;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
