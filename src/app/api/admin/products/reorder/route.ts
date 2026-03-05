import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_COOKIE = "admin_session_v2";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}

type ReorderItem = {
  id: string;
  display_order: number;
};

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be an array of { id, display_order }" },
        { status: 400 }
      );
    }

    const items: ReorderItem[] = [];
    for (const entry of body) {
      if (!entry || typeof entry.id !== "string" || typeof entry.display_order !== "number") {
        return NextResponse.json(
          { error: "Each item must have id (string) and display_order (number)" },
          { status: 400 }
        );
      }
      items.push({ id: entry.id, display_order: entry.display_order });
    }

    if (items.length) {
      // Update each product's display_order. The list is small, so
      // simple sequential updates are acceptable here.
      for (const { id, display_order } of items) {
        const { error } = await supabaseAdmin
          .from("products")
          .update({ display_order })
          .eq("id", id);
        if (error) {
          console.error("Reorder error:", error);
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reorder error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

