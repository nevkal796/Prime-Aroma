import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * Server-side sign-out: clears Supabase auth cookies and redirects to home.
 * Use a full page navigation to this route (e.g. window.location.href = '/auth/signout')
 * so the browser gets the response with cleared cookies.
 */
export async function GET(request: Request) {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url));
}
