import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * OAuth callback: exchange the auth code for a session and redirect home.
 * Supabase redirects here after Google sign-in with ?code=...
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
