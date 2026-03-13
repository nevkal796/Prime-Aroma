import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body?.items as { product_id: string; quantity: number }[] | undefined;
    if (!items?.length) {
      return NextResponse.json({ outOfStockItems: [] });
    }

    const productIds = [...new Set(items.map((i) => i.product_id))];
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("id, name, stock")
      .in("id", productIds);

    if (error) {
      console.error("Cart validate error:", error);
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 500 }
      );
    }

    const productMap = new Map((products ?? []).map((p) => [p.id, p]));
    const outOfStockItems: { id: string; name: string }[] = [];

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product || product.stock < item.quantity) {
        if (product) outOfStockItems.push({ id: product.id, name: product.name });
        else outOfStockItems.push({ id: item.product_id, name: "Unknown" });
      }
    }

    return NextResponse.json({ outOfStockItems });
  } catch (err) {
    console.error("Cart validate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Validation failed" },
      { status: 500 }
    );
  }
}
