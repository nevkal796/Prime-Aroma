import {
  createBrowserClient as createBrowserClientSSR,
  createServerClient as createServerClientSSR,
} from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client with auth session support (cookies).
 * Use in Client Components only.
 */
export function createBrowserClient() {
  return createBrowserClientSSR(supabaseUrl, supabaseAnonKey);
}

/**
 * Alias for createBrowserClient. Use in Client Components.
 */
export function getSupabaseBrowser() {
  return createBrowserClient();
}

/**
 * Server Supabase client (cookies from next/headers).
 * Use in Server Components, Route Handlers, and Server Actions only.
 * Call once per request.
 */
export async function createServerClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return createServerClientSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore when called from Server Component (middleware refreshes session)
        }
      },
    },
  });
}
