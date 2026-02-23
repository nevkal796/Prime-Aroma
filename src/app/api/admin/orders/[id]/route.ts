import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_COOKIE = "admin_session";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ fulfilled: true })
    .eq("id", id);

  if (error) {
    console.error("Order fulfill error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to update order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
