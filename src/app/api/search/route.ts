import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_RESULTS = 12;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (q.length === 0) {
      return NextResponse.json([]);
    }

    // Case-insensitive prefix match on name only (equivalent to name.toLowerCase().startsWith(searchTerm.toLowerCase()))
    const searchTerm = q.replace(/%/g, "\\%").replace(/_/g, "\\_");
    const prefixPattern = `${searchTerm}%`;

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, image_url")
      .ilike("name", prefixPattern)
      .order("name")
      .limit(MAX_RESULTS);

    if (error) {
      console.error("Search API error:", error);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
